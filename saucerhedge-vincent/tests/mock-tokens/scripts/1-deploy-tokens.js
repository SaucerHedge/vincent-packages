#!/usr/bin/env node

const ethers = require('ethers');
const { loadABI, loadBytecode, saveDeployedAddresses } = require('./utils');

const HEDERA_RPC_URL = 'https://testnet.hashio.io/api';
const DEPLOYER_PRIVATE_KEY = '0x8412616778261ee7cd57ac5669ea2cee34a1ca4bc072f9cecf11197ab442f371';

async function deployToken(wallet, contractName, initialSupply) {
  console.log(`\n🚀 Deploying ${contractName}...`);
  
  try {
    // Load contract artifacts
    const abi = loadABI(`contracts_${contractName}_sol_${contractName}`);
    const bytecode = loadBytecode(`contracts_${contractName}_sol_${contractName}`);
    
    // Create contract factory
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
    // Deploy contract
    console.log(`   Deploying with initial supply: ${initialSupply}...`);
    const contract = await factory.deploy(initialSupply, {
      gasLimit: 3000000,
    });
    
    await contract.deployed();
    
    console.log(`✅ ${contractName} deployed at: ${contract.address}`);
    console.log(`   Transaction hash: ${contract.deployTransaction.hash}`);
    
    return {
      address: contract.address,
      txHash: contract.deployTransaction.hash,
    };
  } catch (error) {
    console.error(`❌ Failed to deploy ${contractName}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🎯 Mock Token Deployment Script');
  console.log('================================\n');
  
  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(HEDERA_RPC_URL);
  const wallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
  
  console.log('👤 Deployer address:', wallet.address);
  
  const balance = await wallet.getBalance();
  console.log('💰 Deployer balance:', ethers.utils.formatEther(balance), 'HBAR\n');
  
  if (balance.lt(ethers.utils.parseEther('5'))) {
    console.log('⚠️  Low balance! Get testnet HBAR from: https://portal.hedera.com/faucet');
    console.log('');
  }
  
  // Deploy MockHBAR (1 billion initial supply, 8 decimals)
  const mockHBAR = await deployToken(wallet, 'MockHBAR', 1000000000);
  
  // Deploy MockUSDC (1 billion initial supply, 6 decimals)
  const mockUSDC = await deployToken(wallet, 'MockUSDC', 1000000000);
  
  // Save addresses
  const addresses = {
    mockHBAR: mockHBAR.address,
    mockUSDC: mockUSDC.address,
    deployer: wallet.address,
    deployedAt: new Date().toISOString(),
  };
  
  saveDeployedAddresses(addresses);
  
  console.log('\n✅ All tokens deployed successfully!');
  console.log('📋 Addresses:');
  console.log(`   MockHBAR: ${mockHBAR.address}`);
  console.log(`   MockUSDC: ${mockUSDC.address}`);
  console.log('\n💡 Next step: Run `node tests/mock-tokens/scripts/2-mint-tokens.js` to fund test wallets');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Deployment failed:', error);
    process.exit(1);
  });
