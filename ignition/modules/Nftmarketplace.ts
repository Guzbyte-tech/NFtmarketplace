import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const NftmarketplaceModule = buildModule("NftmarketplaceModule", (m) => {
  
  const GTKContractAddress ="0x4b3c0dF2Fd4f32b38120dCCc89a4E96f2B215959";
  const deployer = "0x51816a1b29569fbB1a56825C375C254742a9c5e1";

  const nftmarketplace = m.contract("NFTMarketplace", [deployer], {});

  return { nftmarketplace };
});

export default NftmarketplaceModule;
