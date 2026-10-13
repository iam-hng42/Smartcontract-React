const { ethers } = require("hardhat");
async function main() {
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 11155111) throw new Error("Wrong network: expected Sepolia 11155111");
  const [wallet] = await ethers.getSigners();
  if (!wallet) throw new Error("PRIVATE_KEY is missing in smartcontract/.env");
  const balance = await wallet.getBalance();
  console.log("Network: Ethereum Sepolia (11155111)");
  console.log("Wallet:", wallet.address);
  console.log("Balance:", ethers.utils.formatEther(balance), "Sepolia ETH");
  if (balance.isZero()) throw new Error("Get faucet ETH before deploying.");
  console.log("RPC and wallet are ready. Gas sufficiency is checked when deploying.");
}
main().catch((error) => { console.error(error.reason || error.message); process.exitCode = 1; });
