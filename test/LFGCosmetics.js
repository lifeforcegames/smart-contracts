const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("LFGCosmetics", function () {
    async function deployFixture() {
        const LFGCosmetics = await ethers.getContractFactory("LFGCosmetics");
        const contract = await upgrades.deployProxy(LFGCosmetics);
        await contract.deployed();

        // Contracts are deployed using the first signer/account by default
        const [owner, account2, account3, account4] = await ethers.getSigners();

        return { contract, owner, account2, account3, account4 };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { contract, owner, account2 } = await loadFixture(deployFixture);

            expect(await contract.owner()).to.equal(owner.address);
        });
    });

    describe("Upgrades", function () {
        it("Should be able to upgrade", async function () {
            const { contract, owner, account2 } = await loadFixture(deployFixture);

            await contract.safeMint(account2.address);

            let value = await contract.tokenURI(0);
            expect(value.toString()).to.equal("https://data.lifeforce.games/0");

            /// upgrade
            const LFGCosmeticsV2 = await ethers.getContractFactory("LFGCosmeticsV2");
            const upgraded = await upgrades.upgradeProxy(contract.address, LFGCosmeticsV2);

            // check the uri of the new contract
            value = await upgraded.tokenURI(0);
            expect(value.toString()).to.equal("https://dataV2.lifeforce.games/0");

            // check owner
            expect(await upgraded.owner()).to.equal(owner.address);

            // mint should still work
            await upgraded.safeMint(account2.address);
            value = await upgraded.tokenURI(1);
            expect(value.toString()).to.equal("https://dataV2.lifeforce.games/1");
        });
    });

    describe("Ownership", function () {
        it("Should be able to transfer ownership", async function () {
            const { contract, owner, account2, account3 } = await loadFixture(deployFixture);

            expect(await contract.owner()).to.equal(owner.address);

            // transfer ownership to new user
            await contract.transferOwnership(account3.address);

            expect(await contract.owner()).to.equal(account3.address);
        });
    });

    describe("Minting", function () {
        it("Only the owner should be able to mint", async function () {
            const { contract, owner, account2 } = await loadFixture(deployFixture);

            // non-owner test
            await expect(contract.connect(account2).safeMint(account2.address)).to.be.revertedWith(
                "Ownable: caller is not the owner",
            );

            // owner test
            await contract.safeMint(account2.address);

            expect(await contract.ownerOf(0)).to.equal(account2.address);
        });
    });
});
