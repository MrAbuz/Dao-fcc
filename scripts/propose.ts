import {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
} from "../helper-hardhat-config"
// @ts-ignore
import { ethers, network } from "hardhat"

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
    // the type of args is "an array of anything". Nice
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")

    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args) //interesting! this is from ethers, we can find more info in the ethers documentation
    // this "interface.encodeFunctionData" allows us to encode the function parameters to use as calldata, so nice! is this the way to abi.encode in javascript?
    // this will be useful for MEV (we can also decode using the box.interface and we'd get the function call and the arguments)
    // we wanna call some specific box contract function with a certain argument, and we pass that as calldata

    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposal Description: \n ${proposalDescription}`) // \n to make a paragraph, print the rest in a line below
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )
    await proposeTx.wait(1)

    if (developmentChains.includes(network.name)) {
    }
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
