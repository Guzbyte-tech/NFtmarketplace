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

    // Mapping from token ID to its listedNFT
    mapping(uint256 => ListedNFT) public listings;

    event NFTMinted(uint256 tokenId, address owner, string tokenURI);
    event NFTListed(uint256 tokenId, address seller, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);

    constructor(
        address initialOwner
    ) ERC721("NFTMarketplace", "NFTM") Ownable(initialOwner) {}

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

    // List NFT for sale
    function listNFT(uint256 tokenId, uint256 price) public payable {
        require(
            ownerOf(tokenId) == msg.sender,
            "You are not the owner of this NFT"
        );
        require(price > 0, "Price must be greater than zero");
        require(msg.value == _listingFee, "Listing fee required");

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

        listing.seller.transfer(listing.price);
        _transfer(listing.seller, msg.sender, tokenId);
        listings[tokenId].isListed = false;

        emit NFTSold(tokenId, msg.sender, listing.price);
    }


    function getListingFee() public view returns (uint256) {
        return _listingFee;
    }

    function setListingFee(uint256 newFee) public onlyOwner {
        _listingFee = newFee;
    }

    function getMintingFee() public view returns (uint256) {
        return _mintingFee;
    }

    function setMintingFee(uint256 newFee) public onlyOwner {
        _mintingFee = newFee;
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
