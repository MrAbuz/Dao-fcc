import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
// @ts-ignore
import { ethers } from "hardhat"

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    // @ts-ignore
    const { getNamedAccounts, deployments } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying Box...")
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
    })
    // should add the wait confirmations and the etherscan verification

    // Right now its the deployer that has deployed this "Box", not our TimeLock contract, so we want to give our TimeLock contract the ownership so that the onlyOwner functions can only
    // be called throught the governance process

    const timeLock = await ethers.getContract("TimeLock")
    const boxContract = await ethers.getContractAt("Box", box.address) // or getContract("Box") patrick said any would work, dunno why he did it like this
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)
    await transferOwnerTx.wait(1)
    log("YOU DUN IT!!!!!!!!!")
}

export default deployBox
