import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
dotenv.config();

const private_key = process.env.PRIVATE_KEY || "";
if (!process.env.PRIVATE_KEY) {
  throw new Error('Environment variable PRIVATE_KEY is required but not set.');
}

if (!process.env.SEPOLIA_RPC_URL) {
  throw new Error('Environment variable SEPOLIA_RPC_URL is required but not set.');
}

if (!process.env.ETHERSCAN_API_KEY) {
  throw new Error('Environment variable ETHERSCAN_API_KEY is required but not set.');
}


const config: HardhatUserConfig = {
  solidity: "0.8.24",
  
  networks: {
    "sepolia": {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    "lisk-sepolia":{
      url: process.env.LISK_SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  
  etherscan: {
    apiKey: {
      "lisk-sepolia": "123",
      "sepolia": process.env.ETHERSCAN_API_KEY,
    },
    customChains: [
      {
        network: "lisk-sepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com/",
        },
      },
    ],
  },

};

export default config;