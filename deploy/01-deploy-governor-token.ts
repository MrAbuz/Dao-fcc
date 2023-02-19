import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    log("Deploying Governance Token...")
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        // waitConfirmations: (add later, is this just to verify the contract in etherscan for example? from what patrick was saying looked like this was just cuz of it)
    })

    //add the verify function with check to see if its on a developmentChain

    log(`Deployed Governance Token to address ${governanceToken.address}`)
}

export default deployGovernanceToken //forgot this and it gave me an error patrick says appears a lot "deployScript.func is not a function"
