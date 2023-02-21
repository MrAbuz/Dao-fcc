The process of the Governance mechanism is like:

- People have governance ERC-20 tokens.
- People submit proposals, they are voted in our Governor contract with the tokens, and if they pass, they are proposed to our TimeLock Contract.
- The Governor Contract is the only one that can propose to the TimeLock contract, and the TimeLock has no admin access. Everything has to go through governance.
- TimeLock receives those passed proposals, requires some time to pass (so that people that dont agree with the change can sell their tokens or act, or for security reasons), and after that time they can be executed in the TimeLock by anyone.
- Our Box contract gave the owner admins rights to the TimeLock contract, so any change or interactions with the onlyOwner functions of Box can only be made through governance, and so after a proposal passes in governance contract, and gets proposed to the timelock and it waits some time in the timelock, it will be executed to change something in the Box contract.

