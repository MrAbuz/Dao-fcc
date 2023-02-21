import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// @ts-ignore
import { ethers } from "hardhat"
import { ADDRESS_ZERO } from "../helper-hardhat-config"

// So the way this is gonna work is: the governor contract will be the proposer that gets introduced in the TimeLock constructor because people propose, vote and then if it passes,
// the governor contract proposes it to the Time lock contract, and executors of the Timelock constructor can be anyone. The timelock receives the proposal, and waits a specified time
// (MIN_DELAY) till people can execute it.
// TimeLock is like the president

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const timeLock = await ethers.getContract("TimeLock", deployer)
    const governor = await ethers.getContract("GovernorContract", deployer)

    log("Setting up roles...")
    // We're gonna get the bytecode of different roles (we can see the variables in the TimeLock Controller contract, the one we inherited in TimeLock.sol)
    // This are the 3 roles that we need to fix
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address) // The governor contract is the only one that can propose to the TimeLock (after there is a vote and it passes)
    await proposerTx.wait(1)
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO) // We're gonna give this to nobody, which means everybody
    await executorTx.wait(1)
    // Right now our deployer account owns our TimeLock controller and that's why we can grant the roles above.
    // But now that we've given all the decentralized access that we want, we're gonna revoke that role, and no1 will own the Timelock controller anymore
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)
    // Now after this, everything has to go through governance. Its impossible for anyone to do anything with the TimeLock without governance happening!
}

export default setupContracts
