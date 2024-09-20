// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721URIStorage, Ownable {

    uint256 private _tokenIds;
    uint256 private _listingFee = 0.01 ether;
    uint256 private _mintingFee = 0.05 ether;

    struct ListedNFT {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isListed;
    }

    // Mapping from token ID to its listing info
    mapping(uint256 => ListedNFT) public listings;
    // Mapping from token ID to its approval status
    mapping(uint256 => bool) public approvedNFTs;

    event NFTMinted(uint256 tokenId, address owner, string tokenURI);
    event NFTListed(uint256 tokenId, address seller, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);
    event NFTApproved(uint256 tokenId, bool approved);

    constructor(address initialOwner) ERC721("NFTMarketplace", "NFTM") Ownable(initialOwner) {}

    // Mint a new NFT, users can mint
    function mintNFT(string memory tokenURI) public payable returns (uint256) {
        require(msg.value >= _mintingFee, "Insufficient minting fee");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        emit NFTMinted(newTokenId, msg.sender, tokenURI);

        return newTokenId;
    }

    // Approve or reject an NFT, only contract owner can call this
    function approveNFT(uint256 tokenId, bool approved) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");
        approvedNFTs[tokenId] = approved;

        emit NFTApproved(tokenId, approved);
    }

    // List NFT for sale, only approved NFTs can be listed
    function listNFT(uint256 tokenId, uint256 price) public payable {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        require(price > 0, "Price must be greater than zero");
        require(msg.value == _listingFee, "Listing fee required");
        require(approvedNFTs[tokenId], "NFT is not approved for listing");

        listings[tokenId] = ListedNFT({
            tokenId: tokenId,
            seller: payable(msg.sender),
            price: price,
            isListed: true
        });

        emit NFTListed(tokenId, msg.sender, price);
    }

    // Buy an NFT
    function buyNFT(uint256 tokenId) public payable {
        ListedNFT memory listing = listings[tokenId];

        require(listing.isListed, "This NFT is not listed for sale");
        require(msg.value >= listing.price, "Insufficient payment");

        // Transfer payment to seller
        listing.seller.transfer(listing.price);
        // Transfer NFT to buyer
        _transfer(listing.seller, msg.sender, tokenId);
        // Remove from the listing
        listings[tokenId].isListed = false;

        emit NFTSold(tokenId, msg.sender, listing.price);
    }

    // Get listing fee
    function getListingFee() public view returns (uint256) {
        return _listingFee;
    }

    // Set listing fee, only contract owner can do this
    function setListingFee(uint256 newFee) public onlyOwner {
        _listingFee = newFee;
    }

    // Get minting fee
    function getMintingFee() public view returns (uint256) {
        return _mintingFee;
    }

    // Set minting fee, only contract owner can do this
    function setMintingFee(uint256 newFee) public onlyOwner {
        _mintingFee = newFee;
    }

    // Withdraw contract balance to the owner
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
