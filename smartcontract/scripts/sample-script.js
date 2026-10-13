const hre = require("hardhat");
async function main() {
  if ((await hre.ethers.provider.getNetwork()).chainId !== 11155111) throw new Error("Use --network sepolia");
  const factory = await hre.ethers.getContractFactory("FirstSmartContract");
  const contract = await factory.deploy();
  console.log("Deployment tx:", contract.deployTransaction.hash);
  await contract.deployed();
  console.log("FirstSmartContract:", contract.address);
  console.log("Explorer: https://sepolia.etherscan.io/address/" + contract.address);
}
main().catch((error) => { console.error(error.reason || error.message); process.exitCode = 1; });
