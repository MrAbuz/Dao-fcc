import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// @ts-ignore
import { ethers } from "hardhat" //import { ethers } from "ethers", it added "ethers" by default but patrick had "hardhat" so I switched, if it gives error should try to switch back

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("Deploying Governance Token...")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        // waitConfirmations: (add later, ahhh from what patrick was saying this seems to be just for verifying the contract on etherscan. We need to wait a bit for etherscan to be able to verify)
    })

    // verify function with check to see if its on a developmentChain. add this

    log(`Deployed Governance Token to address ${governanceToken.address}`)

    await delegate(governanceToken.address, deployer)
    log("Delegated!")
}

// When you deploy this contract, nobody has voting power yet because nobody has the token delegated to them, so we want to delegate it to our deployer.
// Delegate function. We'll use the delegate function for this, which is a function to delegate the votes to others

const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const tx = await governanceToken.delegate(delegatedAccount)
    await tx.wait(1)
    console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

export default deployGovernanceToken //forgot this and it gave me an error patrick says appears a lot "deployScript.func is not a function"
