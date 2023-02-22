import { network } from "hardhat"

export async function moveBlocks(amount: number) {
    console.log("Moving blocks...")
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
    }
}

// This one below is the one we are using in javascript
// Included a "sleep" thing and some different synthax:

/*function sleep(timeInMs) {
    return new Promise((resolve) => setTimeout(resolve, timeInMs))
}

async function moveBlocks(amount, sleepAmount = 0) {
    console.log("Moving blocks...")
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
        if (sleepAmount) {
            console.log(`Sleeping for ${sleepAmount}`)
            await sleep(sleepAmount)
        }
    }
    console.log(`Moved ${amount} blocks`)
}

module.exports = {
    moveBlocks,
    sleep,
}
*/
