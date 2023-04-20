// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract LFGCosmeticsV2 is
	UUPSUpgradeable,
	ERC721EnumerableUpgradeable,
	AccessControlUpgradeable
{
	using CountersUpgradeable for CountersUpgradeable.Counter;

	CountersUpgradeable.Counter private _tokenIdCounter;

	bytes32 public constant MINTER_AUTHORITY_ROLE = keccak256("MINTER_AUTHORITY_ROLE");
	bytes32 public constant UPGRADE_AUTHORITY_ROLE = keccak256("UPGRADE_AUTHORITY_ROLE");
    bytes32 public constant STARDUST_AUTHORITY_ROLE = keccak256("STARDUST_AUTHORITY_ROLE");

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function initialize() public initializer {
		__ERC721_init("LFG Cosmetics", "LFGc");
		__ERC721Enumerable_init();

		// set up roles
		_setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
		_setupRole(MINTER_AUTHORITY_ROLE, _msgSender());
		_setupRole(UPGRADE_AUTHORITY_ROLE, _msgSender());
	}

	function _baseURI() internal pure override returns (string memory) {
		return "https://dataV2.lifeforce.games/";
	}

	function safeMint(address to) public onlyRole(MINTER_AUTHORITY_ROLE) {
		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(to, tokenId);
	}

	/*************************************************************************************************
	                                            Overrides
	 *************************************************************************************************/
	function supportsInterface(
		bytes4 interfaceId
	) public view override(AccessControlUpgradeable, ERC721EnumerableUpgradeable) returns (bool) {
		return super.supportsInterface(interfaceId);
	}

	/*************************************************************************************************
	                                            UUPS
	 *************************************************************************************************/
	function _authorizeUpgrade(
		address newImplementation
	) internal override onlyRole(UPGRADE_AUTHORITY_ROLE) {}

    // function mintWithStardust(
    //     address[] memory to,
    //     uint256[] memory tokenId
    // ) external virtual override onlyRole(STARDUST_AUTHORITY_ROLE) {
    //     require(
    //         tokenId.length == to.length,
    //         "MockExternalStardustERC721: tokenId and to length mismatch"
    //     );
    //     for (uint256 i = 0; i < tokenId.length; i++) {
    //         _safeMint(to[i], tokenId[i]);
    //     }
    // }
    /**
     * Proof of Custody interfaces
     */
    // function burnWithStardust(
    //     uint256[] memory tokenId,
    //     StardustCommon.signature[] memory sig
    // ) external virtual override onlyRole(STARDUST_AUTHORITY_ROLE) {
    //     require(
    //         tokenId.length == sig.length,
    //         "MockExternalStardustERC721: tokenId and sig length mismatch"
    //     );
    //     for (uint256 i = 0; i < tokenId.length; ++i) {
    //         _burnWithStardust(tokenId[i], sig[i]);
    //     }
    // }

    // function transferWithStardust(
    //     address[] memory to,
    //     uint256[] memory tokenId,
    //     StardustCommon.signature[] memory sig
    // ) external virtual override onlyRole(STARDUST_AUTHORITY_ROLE) {
    //     require(
    //         to.length == tokenId.length && tokenId.length == sig.length,
    //         "MockExternalStardustERC721: length mismatch"
    //     );
    //     for (uint256 i = 0; i < tokenId.length; ++i) {
    //         _transferWithStardust(to[i], tokenId[i], sig[i]);
    //     }
    // }

	/**
	 * @dev This empty reserved space is put in place to allow future versions to add new
	 * variables without shifting down storage in the inheritance chain.
	 * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
	 */
	uint256[50] private __gap;
}