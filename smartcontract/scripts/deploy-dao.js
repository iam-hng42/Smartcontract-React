const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
async function main() {
  const network = await hre.ethers.provider.getNetwork();
  if (network.chainId !== 11155111) throw new Error("Use --network sepolia");
  const [wallet] = await hre.ethers.getSigners();
  if (!wallet) throw new Error("PRIVATE_KEY is missing");
  console.log("Deployer:", wallet.address);
  const factory = await hre.ethers.getContractFactory("DominionDAO");
  const dao = await factory.deploy();
  console.log("Deployment tx:", dao.deployTransaction.hash);
  const receipt = await dao.deployTransaction.wait(1);
  const artifact = await hre.artifacts.readArtifact("DominionDAO");
  const front = path.resolve(__dirname, "../../web3-app");
  fs.mkdirSync(path.join(front, "src/abis"), { recursive: true });
  fs.writeFileSync(path.join(front, "src/abis/DominionDAO.json"), JSON.stringify({ contractName: artifact.contractName, abi: artifact.abi }, null, 2) + "\n");
  const envPath = path.join(front, ".env.local");
  if (fs.existsSync(envPath)) fs.copyFileSync(envPath, envPath + ".backup-" + Date.now());
  fs.writeFileSync(envPath, "REACT_APP_CONTRACT_ADDRESS=" + dao.address + "\n");
  const dir = path.resolve(__dirname, "../deployments");
  fs.mkdirSync(dir, { recursive: true });
  const record = { network: "sepolia", chainId: 11155111, address: dao.address, deployer: wallet.address,
    transactionHash: receipt.transactionHash, blockNumber: receipt.blockNumber, createdAt: new Date().toISOString() };
  fs.writeFileSync(path.join(dir, `sepolia-${Date.now()}.json`), JSON.stringify(record, null, 2));
  console.log("DominionDAO:", dao.address);
  console.log("Explorer: https://sepolia.etherscan.io/address/" + dao.address);
  console.log("ABI and web3-app/.env.local updated. Restart React if it is running.");
  console.log("Share only this contract address and ABI with your group. Never share your private key.");
}
main().catch((error) => { console.error(error.reason || error.message); process.exitCode = 1; });
