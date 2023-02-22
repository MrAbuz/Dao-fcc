import {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
} from "../helper-hardhat-config"
// @ts-ignore
import { ethers, network } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"
import * as fs from "fs"

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
    // the type of args is "an array of anything". Nice
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")

    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args) //interesting! this is from ethers, we can find more info in the ethers documentation
    // this "interface.encodeFunctionData" allows us to encode the function parameters to use as calldata, so nice! is this the way to abi.encode in javascript?
    // this will be useful for MEV (we can also decode using the box.interface and we'd get the function call and the arguments)
    // we wanna make a proposal to call some specific box contract function with a certain argument, and for that we pass that as calldata

    console.log(`Proposing "${functionToCall}" on ${box.address} with ${args}`)
    console.log(`Proposal Description: \n ${proposalDescription}`) // \n to make a paragraph, print the rest in a line below
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )
    const proposeReceipt = await proposeTx.wait(1)

    // Now, there's a voting delay (time for proposal till we start vote) of 1 block (check helper-hardhat-config),so if we're in hardhat we're gonna move 2 blocks so we can start voting
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1)
    }

    // We need the proposal ID which is emited from the event when we call propose():
    const proposalId = proposeReceipt.events[0].args.proposalId
    // We want a place to store the proposals, so we can use them in the other scripts like "queue-and-execute.ts, vote.ts". So we created proposals.json, makes sense
    // From what I can see now if I want to store a value and access it with other files, I create a json
    // So first we read all the current proposals
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8")) //yarn add --dev fs. first we check if there are proposals and get them
    // We already started the proposals.json with {"31337": []}, so we just need to push. think in other repo we did logic to actually create the [] but its the same, makes sense
    proposals[network.config.chainId!.toString()].push(proposalId.toString()) // then we save this proposals (! means "yes there will be a chainId" didnt understand 100% this !)
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals)) //and then we'll write it back
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
// Looks like with this "box.interface.encodeFunctionData" you just say the name of the function and not "store(uint256 newValue)" because as it is
// starting with "box", it will probably look in the abi for the name of that function and automatically add the full signature to the encoding.
// and this .then().catch() is a "pretty typical setup for any script you work with hardhat"

/*
    function propose(
        // to start a proposal
        address[] memory targets, -> addresses of the contract that our proposal wants to interact with, in this case the box contract address
        uint256[] memory values,  -> eth we're sending. we'll not be sending anything in this case
        bytes[] memory calldatas, -> encoded parameters of the functions we wanna call
        string memory description -> written description of the proposal
    ) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

*/
