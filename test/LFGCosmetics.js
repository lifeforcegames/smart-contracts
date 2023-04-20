const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { upgrades } = require("hardhat");

describe("LFGCosmetics", function () {
    async function deployFixture() {
        const LFGCosmetics = await ethers.getContractFactory("LFGCosmetics");
        const contract = await upgrades.deployProxy(LFGCosmetics, { kind: "uups" });
        await contract.deployed();

        // roles
        const DEFAULT_ADMIN_ROLE = ethers.utils.hexZeroPad("0x00", 32);
        const MINTER_AUTHORITY_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_AUTHORITY_ROLE"));
        const UPGRADE_AUTHORITY_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("UPGRADE_AUTHORITY_ROLE"));

        // Contracts are deployed using the first signer/account by default
        const [owner, minter, upgrader, account4] = await ethers.getSigners();

        return {
            contract,
            owner,
            minter,
            upgrader,
            account4,
            DEFAULT_ADMIN_ROLE,
            MINTER_AUTHORITY_ROLE,
            UPGRADE_AUTHORITY_ROLE,
        };
    }

    describe("Roles", function () {
        it("Should set the right roles to start", async function () {
            const { contract, owner, minter, DEFAULT_ADMIN_ROLE, MINTER_AUTHORITY_ROLE, UPGRADE_AUTHORITY_ROLE } =
                await loadFixture(deployFixture);

            // check initial roles
            expect(await contract.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.equal(true);
            expect(await contract.hasRole(MINTER_AUTHORITY_ROLE, owner.address)).to.equal(true);
            expect(await contract.hasRole(UPGRADE_AUTHORITY_ROLE, owner.address)).to.equal(true);

            // check minter role, granting and revoking
            expect(await contract.hasRole(MINTER_AUTHORITY_ROLE, minter.address)).to.equal(false);
            await contract.grantRole(MINTER_AUTHORITY_ROLE, minter.address);
            expect(await contract.hasRole(MINTER_AUTHORITY_ROLE, minter.address)).to.equal(true);
            await contract.revokeRole(MINTER_AUTHORITY_ROLE, minter.address);
            expect(await contract.hasRole(MINTER_AUTHORITY_ROLE, minter.address)).to.equal(false);

            // check upgrade role and renouncing
            expect(await contract.hasRole(UPGRADE_AUTHORITY_ROLE, minter.address)).to.equal(false);
            await contract.grantRole(UPGRADE_AUTHORITY_ROLE, minter.address);
            expect(await contract.hasRole(UPGRADE_AUTHORITY_ROLE, minter.address)).to.equal(true);
            await contract.connect(minter).renounceRole(UPGRADE_AUTHORITY_ROLE, minter.address);
            expect(await contract.hasRole(UPGRADE_AUTHORITY_ROLE, minter.address)).to.equal(false);
        });
    });

    describe("Minting", function () {
        it("Only an account with the minter role should be able to mint", async function () {
            const { contract, owner, minter, DEFAULT_ADMIN_ROLE, MINTER_AUTHORITY_ROLE, UPGRADE_AUTHORITY_ROLE } =
                await loadFixture(deployFixture);

            // non role test
            await expect(contract.connect(minter).safeMint(minter.address)).to.be.reverted;

            await contract.grantRole(MINTER_AUTHORITY_ROLE, minter.address);

            // role approved test
            await contract.safeMint(minter.address);

            expect(await contract.ownerOf(0)).to.equal(minter.address);
        });
    });

    describe("Upgrades", function () {
        it("Should be able to upgrade", async function () {
            const {
                contract,
                owner,
                minter,
                upgrader,
                DEFAULT_ADMIN_ROLE,
                MINTER_AUTHORITY_ROLE,
                UPGRADE_AUTHORITY_ROLE,
            } = await loadFixture(deployFixture);

            await contract.grantRole(MINTER_AUTHORITY_ROLE, minter.address);
            await contract.grantRole(UPGRADE_AUTHORITY_ROLE, upgrader.address);

            await contract.safeMint(minter.address);

            let value = await contract.tokenURI(0);
            expect(value.toString()).to.equal("https://data.lifeforce.games/0");

            /// upgrade
            const LFGCosmeticsV2 = await ethers.getContractFactory("LFGCosmeticsV2");
            const upgraded = await upgrades.upgradeProxy(contract.address, LFGCosmeticsV2);

            expect(contract.address).to.equal(upgraded.address);

            // check the uri of the new contract
            value = await upgraded.tokenURI(0);
            expect(value.toString()).to.equal("https://dataV2.lifeforce.games/0");

            // mint should still work
            await upgraded.safeMint(minter.address);
            value = await upgraded.tokenURI(1);
            expect(value.toString()).to.equal("https://dataV2.lifeforce.games/1");
        });
    });
});
