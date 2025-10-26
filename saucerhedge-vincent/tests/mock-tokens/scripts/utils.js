const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

// Load ABI
function loadABI(contractName) {
  const abiPath = path.join(__dirname, '../abis', `${contractName}.abi`);
  return JSON.parse(fs.readFileSync(abiPath, 'utf8'));
}

// Load Bytecode
function loadBytecode(contractName) {
  const binPath = path.join(__dirname, '../abis', `${contractName}.bin`);
  return '0x' + fs.readFileSync(binPath, 'utf8').trim();
}

// Save deployed addresses
function saveDeployedAddresses(addresses) {
  const outputPath = path.join(__dirname, '../deployed-addresses.json');
  fs.writeFileSync(outputPath, JSON.stringify(addresses, null, 2));
  console.log('📝 Saved deployed addresses to:', outputPath);
}

// Load deployed addresses
function loadDeployedAddresses() {
  const filePath = path.join(__dirname, '../deployed-addresses.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
}

module.exports = {
  loadABI,
  loadBytecode,
  saveDeployedAddresses,
  loadDeployedAddresses,
};
