import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { VOTING_PERIOD, VOTING_DELAY, QUORUM_PERCENTAGE } from "../helper-hardhat-config"

const deployGovernorContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await get("GovernanceToken")
    // the "get" function that comes from "deployments" which literaly goes out and gets this deployments. Another way like ethers.getContract()? whats the dif?
    const timeLock = await get("TimeLock")
    log("Deploying Governor")

    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args: [
            governanceToken.address,
            timeLock.address,
            QUORUM_PERCENTAGE,
            VOTING_PERIOD,
            VOTING_DELAY,
        ],
        log: true,
    })
}

// should add the wait confirmations and the etherscan verification

export default deployGovernorContract
