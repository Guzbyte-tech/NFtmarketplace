import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre, { ethers } from "hardhat";


  describe("Nft Market Place", function () {

    const LISTING_FEE = ethers.parseEther("0.01");
    const MINTING_FEE = ethers.parseEther("0.05");
    const tokenURI = "http://localhost:8000/metadata/metadata.json"

    async function deployTeam47GangNFT() {
        const [ nftDeployer ] = await ethers.getSigners();
        const team47Gang = await ethers.getContractFactory("Team47gangNFT")
        const team47 = await team47Gang.deploy(nftDeployer.address);
        return { nftDeployer, team47 }
    }

    async function deployMarketPlace() {
        const [ marketOwner, seller, buyer ] = await ethers.getSigners();
        const nftMarket = await ethers.getContractFactory("NFTMarketplace");
        const nftMart = await nftMarket.deploy(marketOwner.address);
        return {nftMart, marketOwner, seller, buyer}
    }

    describe("Deployment", function(){
        it("Should set fees successfully.", async function(){
            const {nftMart, marketOwner, seller, buyer} = await loadFixture(deployMarketPlace);
            const listingFee = await nftMart.connect(seller).getListingFee();
            const mintingFee = await nftMart.connect(seller).getMintingFee();
            await expect(MINTING_FEE).to.equal(mintingFee);
            await expect(LISTING_FEE).to.equal(listingFee);
        });
    });


    describe("MINT NFT", function(){
        
        it("Should mint nft successfully.", async function(){
            const {nftMart, marketOwner, seller, buyer} = await loadFixture(deployMarketPlace);
            await nftMart.connect(seller).mintNFT(tokenURI, {value: MINTING_FEE})
            const tokenId = 1;
            const ownerOfToken = await nftMart.ownerOf(tokenId);
            await expect(ownerOfToken).to.equal(seller.address);  
        });

        it("Should fail if seller does not have enough minting fee.", async function (){
            const {nftMart, marketOwner, seller, buyer} = await loadFixture(deployMarketPlace);
            await expect(
                nftMart.connect(seller).mintNFT(tokenURI, { value: ethers.parseEther("0.01") })
            ).to.be.revertedWith("Insufficient minting fee");
        });
    });

    describe("LIST NFT",  function(){
        it("Should list an NFT successfully.", async function(){
            const {nftMart, marketOwner, seller, buyer} = await loadFixture(deployMarketPlace);
            await nftMart.connect(seller).mintNFT(tokenURI, {value: MINTING_FEE})
            const tokenId = 1;
            await nftMart.connect(seller).listNFT(1, ethers.parseEther("0.1"),{
                value: LISTING_FEE
            });
            const listing  = await nftMart.connect(seller).listings(1);
            expect(listing.price).to.equal(ethers.parseEther("0.1"));
            expect(listing.isListed).to.be.equal(true);
        });

        it("Should fail if user tries to claim an NFT not listed.", async function(){
            const {nftMart, marketOwner, seller, buyer} = await loadFixture(deployMarketPlace);
            await nftMart.connect(seller).mintNFT(tokenURI, {value: MINTING_FEE})
            const tokenId = 1;
            await nftMart.connect(seller).listNFT(1, ethers.parseEther("0.1"),{
                value: LISTING_FEE
            });
            expect(await nftMart.connect(seller).listings(0)).to.be.revertedWith("This NFT is not listed for sale");
            
        });

        it("Should fail if user did't meet up with listing fee.", async function(){
            const {nftMart, marketOwner, seller, buyer} = await loadFixture(deployMarketPlace);
            await nftMart.connect(seller).mintNFT(tokenURI, {value: MINTING_FEE})
            const tokenId = 1;
            expect(await nftMart.connect(seller).listNFT(1, ethers.parseEther("0.001"),{
                value: LISTING_FEE
            })).to.be.revertedWith("Insufficient payment");
        });
    });
  });