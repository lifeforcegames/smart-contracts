require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-deploy");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.18",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000,
            },
        },
    },
    etherscan: {
        //apiKey: process.env.ETHERSCAN_API_KEY,
    },
    networks: {
        hardhat: {
            accounts: {
                mnemonic: process.env.MNEMONIC,
            },
            chainId: 1337,
            //allowUnlimitedContractSize: true,
            mining: {
                auto: true,
                interval: 12000,
            },
            metadataURI: "http://localhost:3030/",
        },

        arbitrum: {
            url: "https://arb-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
            chainId: 42161,
            accounts: {
                mnemonic: process.env.MNEMONIC,
            },
            metadataURI: "https://data.lifeforce.games",
        },

        arbitrum_goerli: {
            url: "https://arb-goerli.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
            chainId: 421613,
            accounts: {
                mnemonic: process.env.MNEMONIC,
            },
            metadataURI: "https://data-test.lifeforce.games",
        },
    },
    namedAccounts: {
        deployer: 0,
        tokenOwner: 1,
        user1: 2,
        user2: 3,
    },
};
