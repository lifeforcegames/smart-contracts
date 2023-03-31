require("@nomicfoundation/hardhat-toolbox");

const mnemonic_dev = "make fiber supply goose garbage stick confirm analyst avoid liar first vibrant";

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
    networks: {
        hardhat: {
            accounts: {
                mnemonic: mnemonic_dev,
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
            url: "https://arbitrum-mainnet.infura.io/v3/b50e70f52289474bb110c0a4ac8edcd4",
            chainId: 42161,
            accounts: {
                mnemonic: mnemonic_dev,
            },
            metadataURI: "https://data.lifeforce.games",
        },

        arbitrum_goerli: {
            url: "https://arbitrum-goerli.infura.io/v3/b50e70f52289474bb110c0a4ac8edcd4",
            chainId: 421613,
            accounts: {
                mnemonic: mnemonic_dev,
            },
            metadataURI: "https://data.lifeforce.games",
        },
    },
    namedAccounts: {
        deployer: 0,
        tokenOwner: 1,
        user1: 2,
        user2: 3,
    },
};
