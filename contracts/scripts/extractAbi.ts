import * as fs from "fs";
import * as path from "path";

const artifactPath = path.join(__dirname, "../artifacts/contracts/TipPost.sol/TipPost.json");
const abiOutput = path.join(__dirname, "../../frontend/src/abi/TipPost.json");

// Read artifact
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

// Create output directory if needed
fs.mkdirSync(path.dirname(abiOutput), { recursive: true });

// Write ABI
fs.writeFileSync(abiOutput, JSON.stringify(artifact.abi, null, 2));
console.log("ABI extracted to frontend/src/abi/TipPost.json");
