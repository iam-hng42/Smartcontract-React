require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
const { subtask } = require("hardhat/config");
const { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } = require("hardhat/builtin-tasks/task-names");

// Use the compiler installed with npm. No second compiler download is needed.
subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD).setAction(async (args, hre, runSuper) => {
  if (args.solcVersion === "0.8.20") {
    return {
      compilerPath: require.resolve("solc/soljson.js"),
      isSolcJs: true,
      version: "0.8.20",
      longVersion: require("solc").version(),
    };
  }
  return runSuper();
});

const key = (process.env.PRIVATE_KEY || "").trim();
const networks = {};
// Local compile/test work without a private key or RPC URL.
if (process.env.SEPOLIA_RPC_URL && !process.env.SEPOLIA_RPC_URL.includes("YOUR_API_KEY")) {
  networks.sepolia = {
    url: process.env.SEPOLIA_RPC_URL.trim(),
    chainId: 11155111,
    accounts: key ? [key.startsWith("0x") ? key : `0x${key}`] : [],
    timeout: 120000,
  };
}

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: "paris" },
  },
  networks,
};
