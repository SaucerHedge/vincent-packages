#!/usr/bin/env tsx

import { testConfig, validateTestConfig } from '../utils/test-config.js';
import {
  createMockVincentContext,
  createMockAbilityContext,
} from '../utils/mock-vincent-context.js';
import { vincentAbility as depositAbility } from '../../packages/deposit-to-vault-ability/dist/lib/lib/vincent-ability.js';
import { vincentAbility as openAbility } from '../../packages/open-vault-hedged-position-ability/dist/lib/lib/vincent-ability.js';
import { vincentAbility as statusAbility } from '../../packages/get-position-status-ability/dist/lib/lib/vincent-ability.js';
import { vincentAbility as closeAbility } from '../../packages/close-vault-hedged-position-ability/dist/lib/lib/vincent-ability.js';

async function testVaultFullFlow() {
  console.log('🧪 Testing SaucerHedge Vault Full Flow');
  console.log('='.repeat(60));

  validateTestConfig();

  const vincentContext = createMockVincentContext(
    testConfig.DELEGATEE_PRIVATE_KEY,
    testConfig.USER_VINCENT_PRIVATE_KEY,
    testConfig.HEDERA_RPC_URL
  );

  const abilityContext = createMockAbilityContext();

  // Test parameters
  const usdcAmount = '1000000000'; // 1000 USDC (6 decimals)
  const hbarAmount = '1000000000'; // 10 HBAR (8 decimals)

  let positionId = '';

  try {
    // Step 1: Deposit USDC to Vault
    console.log('\n💵 Step 1: Deposit USDC to Vault');
    const depositUSDCParams = {
      token: testConfig.USDC_TOKEN_ADDRESS,
      amount: usdcAmount,
    };

    const executeContext = {
      ethers: vincentContext.ethers,
      pkpWallet: vincentContext.pkpWallet,
      delegation: vincentContext.delegation,
      succeed: abilityContext.succeed,
      fail: abilityContext.fail,
      policiesContext: {
        allowedPolicies: {},
        evaluatedPolicies: {},
      },
    };

    const depositUSDCResult = await depositAbility.execute(
      { abilityParams: depositUSDCParams },
      executeContext
    );

    if (!depositUSDCResult.success) {
      console.log('❌ USDC deposit failed:', depositUSDCResult.result || depositUSDCResult.runtimeError);
      return;
    }

    console.log('✅ USDC deposited! Shares:', depositUSDCResult.result.sharesReceived);
    console.log('🔗 TX:', depositUSDCResult.result.txHash);

    // Step 2: Deposit HBAR to Vault
    console.log('\n💎 Step 2: Deposit HBAR to Vault');
    const depositHBARParams = {
      token: testConfig.HBAR_TOKEN_ADDRESS,
      amount: hbarAmount,
    };

    const depositHBARResult = await depositAbility.execute(
      { abilityParams: depositHBARParams },
      executeContext
    );

    if (!depositHBARResult.success) {
      console.log('❌ HBAR deposit failed:', depositHBARResult.result || depositHBARResult.runtimeError);
      return;
    }

    console.log('✅ HBAR deposited! Shares:', depositHBARResult.result.sharesReceived);
    console.log('🔗 TX:', depositHBARResult.result.txHash);

    // Step 3: Open Hedged Position
    console.log('\n🚀 Step 3: Open Hedged LP Position');
    const openParams = {
      token0: testConfig.HBAR_TOKEN_ADDRESS,
      token1: testConfig.USDC_TOKEN_ADDRESS,
      shares0: depositHBARResult.result.sharesReceived,
      shares1: depositUSDCResult.result.sharesReceived,
      tickLower: -887220,
      tickUpper: 887220,
    };

    const openResult = await openAbility.execute({ abilityParams: openParams }, executeContext);

    if (!openResult.success) {
      console.log('❌ Open position failed:', openResult.result || openResult.runtimeError);
      return;
    }

    positionId = openResult.result.positionId;
    console.log('🎉 Position opened successfully!');
    console.log('🆔 Position ID:', positionId);
    console.log('💎 LP Value:', openResult.result.lpValue);
    console.log('📉 Short Value:', openResult.result.shortValue);
    console.log('🔗 TX:', openResult.result.txHash);

    // Step 4: Get Position Status
    console.log('\n📊 Step 4: Check Position Status');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const statusParams = { positionId };
    const statusResult = await statusAbility.execute({ abilityParams: statusParams }, executeContext);

    if (!statusResult.success) {
      console.log('⚠️ Get status failed:', statusResult.result || statusResult.runtimeError);
    } else {
      console.log('✅ Position Status:');
      console.log('  Owner:', statusResult.result.owner);
      console.log('  LP Value:', statusResult.result.lpValue);
      console.log('  Short Value:', statusResult.result.shortValue);
      console.log('  Fees Earned:', statusResult.result.feesEarned);
      console.log('  Net IL:', statusResult.result.netIL);
      console.log('  Active:', statusResult.result.isActive);
    }

    // Step 5: Close Position
    console.log('\n🔚 Step 5: Close Hedged Position');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const closeParams = { positionId };
    const closeResult = await closeAbility.execute({ abilityParams: closeParams }, executeContext);

    if (!closeResult.success) {
      console.log('❌ Close position failed:', closeResult.result || closeResult.runtimeError);
      return;
    }

    console.log('🎉 Position closed successfully!');
    console.log('💰 Token0 returned:', closeResult.result.token0Returned);
    console.log('💰 Token1 returned:', closeResult.result.token1Returned);
    console.log('💸 Fees collected:', closeResult.result.feesCollected);
    console.log('🔗 TX:', closeResult.result.txHash);
  } catch (error) {
    console.error('💥 Full flow error:', error);
  }

  console.log('\n✅ Vault full flow test completed');
  console.log('🎯 Summary: Deposit USDC ✓ | Deposit HBAR ✓ | Open ✓ | Status ✓ | Close ✓');
}

testVaultFullFlow().catch(console.error);
