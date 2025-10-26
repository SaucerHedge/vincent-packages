import { ethers } from 'ethers';

export interface MockVincentContext {
  ethers: typeof ethers;
  pkpWallet: ethers.Wallet;
  delegation: {
    delegator: string;
  };
}

export interface MockAbilityContext {
  succeed: (data: any) => { success: true; result: any };
  fail: (data: any) => { success: false; result: any };
}

export interface MockPolicyContext {
  allow: (data: any) => { allowed: true; result: any };
  deny: (data: any) => { allowed: false; result: any };
}

export function createMockVincentContext(
  delegateePrivateKey: string,
  userPrivateKey: string,
  rpcUrl: string
): MockVincentContext {
  console.log('🔧 Creating mock Vincent context...');
  
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const pkpWallet = new ethers.Wallet(delegateePrivateKey, provider);
  const userWallet = new ethers.Wallet(userPrivateKey, provider);

  console.log('👤 PKP Wallet (Delegatee):', pkpWallet.address);
  console.log('🏠 User Wallet (Delegator):', userWallet.address);

  return {
    ethers,
    pkpWallet,
    delegation: {
      delegator: userWallet.address,
    },
  };
}

export function createMockAbilityContext(): MockAbilityContext {
  return {
    succeed: (data: any) => {
      console.log('✅ [MOCK] Ability succeeded:', data);
      return { success: true, result: data };
    },
    fail: (data: any) => {
      console.log('❌ [MOCK] Ability failed:', data);
      return { success: false, result: data };
    },
  };
}

export function createMockPolicyContext(): MockPolicyContext {
  return {
    allow: (data: any) => {
      console.log('✅ [MOCK] Policy allowed:', data);
      return { allowed: true, result: data };
    },
    deny: (data: any) => {
      console.log('❌ [MOCK] Policy denied:', data);
      return { allowed: false, result: data };
    },
  };
}
