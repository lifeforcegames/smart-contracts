const { ethers, upgrades } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deployIfDifferent, log } = deployments;
    const namedAccounts = await getNamedAccounts();
    const chainId = await getChainId();

    const { deploy } = deployments;
    const { deployer } = namedAccounts;

    const LFGCosmetics = await ethers.getContractFactory("LFGCosmetics");
    const contract = await upgrades.deployProxy(LFGCosmetics, { kind: "uups" });
    await contract.deployed();

    console.log("LFGCosmetics deployed to: ", contract.address, " on chain ", chainId);
};
module.exports.tags = ["deploy"];
