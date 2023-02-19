import "hardhat-deploy"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import { HardhatUserConfig } from "hardhat/config" //first we need to import the hardhat config type

/** @type import('hardhat/config').HardhatUserConfig */
/*module.exports = {
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
}*/

//remember to add "export default config" in the end of this ts files (probably not all but so far it was all, and gives an error if you dont)
//we'll create a new config that is a little bit nicer
const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        localhost: {
            chainId: 31337,
        },
    },
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
}

export default config
