#!/usr/bin/env node

const ethers = require('ethers');
const { loadABI, loadDeployedAddresses } = require('./utils');

const HEDERA_RPC_URL = 'https://testnet.hashio.io/api';
const DEPLOYER_PRIVATE_KEY = '';

// Test wallets to fund
const DELEGATEE_ADDRESS = '0x868e5f01F834bF3Fa4370f9Ca2c760950c8b2b2a';
const DELEGATOR_ADDRESS = '0x2727c17F663BB47C8eC41C68770736e4476CAbD5';

// Amounts to mint (with decimals)
const MOCK_HBAR_AMOUNT = ethers.utils.parseUnits('1000', 8); // 1000 mHBAR (8 decimals)
const MOCK_USDC_AMOUNT = ethers.utils.parseUnits('10000', 6); // 10000 mUSDC (6 decimals)

async function mintTokens(wallet, tokenAddress, tokenName, recipientAddress, amount) {
  console.log(`\n💰 Minting ${tokenName} to ${recipientAddress}...`);
  
  try {
    // Load ABI (both tokens have same interface)
    const abi = [
      'function mint(address to, uint256 amount)',
      'function balanceOf(address account) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
    ];
    
    const contract = new ethers.Contract(tokenAddress, abi, wallet);
    
    // Mint tokens
    const tx = await contract.mint(recipientAddress, amount, {
      gasLimit: 200000,
    });
    
    console.log(`   TX sent: ${tx.hash}`);
    await tx.wait();
    
    // Check balance
    const balance = await contract.balanceOf(recipientAddress);
    const decimals = await contract.decimals();
    const symbol = await contract.symbol();
    
    console.log(`✅ Minted successfully!`);
    console.log(`   New balance: ${ethers.utils.formatUnits(balance, decimals)} ${symbol}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to mint ${tokenName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🎯 Mock Token Minting Script');
  console.log('=============================\n');
  
  // Load deployed addresses
  const addresses = loadDeployedAddresses();
  if (!addresses) {
    console.error('❌ No deployed addresses found. Run deployment script first!');
    process.exit(1);
  }
  
  console.log('📋 Deployed Token Addresses:');
  console.log(`   MockHBAR: ${addresses.mockHBAR}`);
  console.log(`   MockUSDC: ${addresses.mockUSDC}\n`);
  
  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(HEDERA_RPC_URL);
  const wallet = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
  
  console.log('👤 Minter address:', wallet.address);
  
  // Mint to Delegatee (PKP Wallet)
  console.log('\n📦 Funding Delegatee (PKP Wallet)...');
  await mintTokens(wallet, addresses.mockHBAR, 'MockHBAR', DELEGATEE_ADDRESS, MOCK_HBAR_AMOUNT);
  await mintTokens(wallet, addresses.mockUSDC, 'MockUSDC', DELEGATEE_ADDRESS, MOCK_USDC_AMOUNT);
  
  // Mint to Delegator (User Wallet)
  console.log('\n📦 Funding Delegator (User Wallet)...');
  await mintTokens(wallet, addresses.mockHBAR, 'MockHBAR', DELEGATOR_ADDRESS, MOCK_HBAR_AMOUNT);
  await mintTokens(wallet, addresses.mockUSDC, 'MockUSDC', DELEGATOR_ADDRESS, MOCK_USDC_AMOUNT);
  
  console.log('\n✅ All wallets funded successfully!');
  console.log('\n💡 Update your .env file with these addresses:');
  console.log(`HBAR_TOKEN_ADDRESS=${addresses.mockHBAR}`);
  console.log(`USDC_TOKEN_ADDRESS=${addresses.mockUSDC}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Minting failed:', error);
    process.exit(1);
  });
