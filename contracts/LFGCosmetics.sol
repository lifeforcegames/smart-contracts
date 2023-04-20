// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "hardhat/console.sol";

contract LFGCosmetics is
	UUPSUpgradeable,
	ERC721EnumerableUpgradeable,
	AccessControlUpgradeable
{
	using CountersUpgradeable for CountersUpgradeable.Counter;

	CountersUpgradeable.Counter private _tokenIdCounter;

	bytes32 public constant MINTER_AUTHORITY_ROLE = keccak256("MINTER_AUTHORITY_ROLE");
	bytes32 public constant UPGRADE_AUTHORITY_ROLE = keccak256("UPGRADE_AUTHORITY_ROLE");

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function initialize() public initializer {
		__ERC721_init("LFG Cosmetics", "LFGc");
		__ERC721Enumerable_init();
        __UUPSUpgradeable_init();

		// set up roles
		_setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_AUTHORITY_ROLE, _msgSender());
		_setupRole(UPGRADE_AUTHORITY_ROLE, _msgSender());
        
	}

	function _baseURI() internal pure override returns (string memory) {
		return "https://data.lifeforce.games/";
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

	/**
	 * @dev This empty reserved space is put in place to allow future versions to add new
	 * variables without shifting down storage in the inheritance chain.
	 * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
	 */
	uint256[50] private __gap;
}