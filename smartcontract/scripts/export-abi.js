const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
async function main() {
  const artifact = await hre.artifacts.readArtifact("DominionDAO");
  const target = path.resolve(__dirname, "../../web3-app/src/abis/DominionDAO.json");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify({ contractName: artifact.contractName, abi: artifact.abi }, null, 2) + "\n");
  console.log("ABI exported to web3-app/src/abis/DominionDAO.json");
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
