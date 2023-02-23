import {
    FUNC,
    NEW_STORE_VALUE,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    MIN_DELAY,
} from "../helper-hardhat-config"
// @ts-ignore
import { ethers, network } from "hardhat"
import { moveTime } from "../utils/move-time"
import { moveBlocks } from "../utils/move-blocks"

export async function queueAndExecute() {
    const args = [NEW_STORE_VALUE]
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args)
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
    // The description that we input in propose.ts gets hashed on chain, and thats what our queue and execute is gonna be looking for. So we need to hash it before inputing.

    const governor = await ethers.getContract("GovernorContract")
    console.log("Queueing...")
    const queueTx = await governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash)
    await queueTx.wait(1)

    // Now we have to wait the minDelay that we added to the TimeLock contract (time since its queued till its executed, so people have time to get out if they dont agree):

    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1)
        await moveBlocks(1)
    }

    console.log("Executing...")
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1)

    // Now, finally, let's see if the governance managed to update the value on our Box contract (which was what we proposed to do):
    // If the new value prints 77, we successfully coded a governance mechanism that can in a decentralized and fully on-chain way propose, vote and execute direct changes to a protocol.
    const boxNewValue = await box.retrieve()
    console.log(`New Box Value: ${boxNewValue.toString()}`)
}

queueAndExecute()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
