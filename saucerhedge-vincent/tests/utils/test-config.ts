import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

export const testConfig = {
  // RPC
  HEDERA_RPC_URL: process.env.HEDERA_RPC_URL || 'https://testnet.hashio.io/api',
  
  // Private Keys (use test accounts with small amounts)
  DELEGATEE_PRIVATE_KEY: process.env.DELEGATEE_PRIVATE_KEY || '',
  USER_VINCENT_PRIVATE_KEY: process.env.USER_VINCENT_PRIVATE_KEY || '',
  
  // Contract Addresses
  SAUCER_HEDGER_CONTRACT: '0xec13c047b446f63e4bbdd9dbe8fc129281afa1e9',
  HBAR_TOKEN_ADDRESS: process.env.HBAR_TOKEN_ADDRESS ,
  USDC_TOKEN_ADDRESS: process.env.USDC_TOKEN_ADDRESS ,
  
  // Test Parameters
  TEST_AMOUNTS: {
  HBAR: '10000000',    // 0.1 HBAR (was 1 HBAR)
  USDC: '100000',      // 0.1 USDC (was 1 USDC)
},

LARGE_TEST_AMOUNTS: {
  HBAR: '100000000',   // 1 HBAR (was 5 HBAR)
  USDC: '1000000',     // 1 USDC (was 2 USDC)
}

};

export function validateTestConfig() {
  console.log('🔍 Validating test configuration...');
  
  const required = [
    'DELEGATEE_PRIVATE_KEY',
    'USER_VINCENT_PRIVATE_KEY',
    'HEDERA_RPC_URL'
  ];
  
  const missing = required.filter(key => !testConfig[key as keyof typeof testConfig]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('📝 Create .env file with:');
    console.error('DELEGATEE_PRIVATE_KEY=your_delegatee_private_key');
    console.error('USER_VINCENT_PRIVATE_KEY=your_user_private_key');
    console.error('HEDERA_RPC_URL=https://testnet.hashio.io/api');
    process.exit(1);
  }
  
  console.log('✅ Configuration valid');
}
