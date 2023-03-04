require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths:{
    artifacts:'./src/artifacts'
  },
  networks:{
    goerli:{
      url: process.env.RPC_URL,
      accounts: [process.env.ACCOUNT]
    },hardhat:{
      chainId:1337,
    }
  }
};
