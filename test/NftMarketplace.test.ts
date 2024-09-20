import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre, { ethers } from "hardhat";


  describe("Lock", function () {

    async function deployTeam47GangNFT() {
        const [ nftDeployer ] = await ethers.getSigners();
        const team47Gang = await ethers.getContractFactory("Team47gangNFT")
        const team47 = await team47Gang.deploy(nftDeployer.address);

    }

  });