import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Team47GangNFTModule = buildModule("Team47GangNFTModule", (m) => {
  
    const deployer = "0x51816a1b29569fbB1a56825C375C254742a9c5e1";

    const Team47GangNFT = m.contract("Team47GangNFT", [deployer], {});

  return { Team47GangNFT };
});

export default Team47GangNFTModule;
