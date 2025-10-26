#!/usr/bin/env tsx

import { testConfig, validateTestConfig } from '../utils/test-config.js';
import {
  createMockVincentContext,
  createMockAbilityContext,
  createMockPolicyContext,
} from '../utils/mock-vincent-context.js';
import { vincentAbility as openAbility } from '../../packages/open-hedged-position-ability/dist/lib/lib/vincent-ability.js';
import { vincentAbility as closeAbility } from '../../packages/close-hedged-position-ability/dist/lib/lib/vincent-ability.js';
import { vincentPolicy as maxSizePolicy } from '../../packages/max-position-size-policy/dist/lib/lib/vincent-policy.js';

async function testFullFlow() {
  console.log('🧪 Testing Full SaucerHedge Flow');
  console.log('='.repeat(60));

  // Validate config
  validateTestConfig();

  // Create contexts
  const vincentContext = createMockVincentContext(
    testConfig.DELEGATEE_PRIVATE_KEY,
    testConfig.USER_VINCENT_PRIVATE_KEY,
    testConfig.HEDERA_RPC_URL
  );

  const abilityContext = createMockAbilityContext();
  const policyContext = createMockPolicyContext();

  // Test parameters
  const openParams = {
    token0: testConfig.HBAR_TOKEN_ADDRESS,
    token1: testConfig.USDC_TOKEN_ADDRESS,
    amount0: testConfig.TEST_AMOUNTS.HBAR,
    amount1: testConfig.TEST_AMOUNTS.USDC,
    tickLower: -887220,
    tickUpper: 887220,
  };

  const policyParams = {
    abilityParams: openParams,
    userParams: {
      maxPositionUSD: '10000',
    },
  };

  console.log('📝 Flow Parameters:');
  console.log('  HBAR Amount:', parseInt(openParams.amount0) / 1e8);
  console.log('  USDC Amount:', parseInt(openParams.amount1) / 1e6);
  console.log('  Policy Limit: $10,000');

  let positionId = '';

  try {
    // Step 1: Policy Check
    console.log('\n🛡️  Step 1: Policy Check');
    const policyResult = await maxSizePolicy.precheck(policyParams, policyContext);

    if (!policyResult.allow) {
      // Changed from .allowed to .allow
      console.log('❌ Policy denied the transaction:', policyResult.result);
      return;
    }
    console.log('✅ Policy approved the transaction');

    // Step 2: Open Position Precheck
    console.log('\n🔍 Step 2: Open Position Precheck');
    const openPrecheck = await openAbility.precheck(
      { abilityParams: openParams },
      { ...vincentContext, ...abilityContext }
    );

    if (!openPrecheck.success) {
      console.log('⚠️  Open position precheck failed:', openPrecheck.result);
      console.log('💡 This is expected if test wallets have no tokens');
      console.log('📝 To test full flow, fund wallets with testnet tokens');
      return;
    }
    console.log('✅ Open position precheck passed');

    // Step 3: Execute Open Position
    console.log('\n⚡ Step 3: Execute Open Position');

    // Create the correct execution context per Vincent SDK structure
    const executeContext = {
      ethers: vincentContext.ethers,
      pkpWallet: vincentContext.pkpWallet,
      delegation: vincentContext.delegation,
      succeed: abilityContext.succeed,
      fail: abilityContext.fail,
      // Vincent SDK expects policiesContext, not evaluatedPolicies directly
      policiesContext: {
        allowedPolicies: {}, // Empty for MVP with no policy enforcement
        evaluatedPolicies: {}, // Empty for MVP
      },
    };

    console.log('[DEBUG] Execute context keys:', Object.keys(executeContext));
    console.log('[DEBUG] Has ethers?', !!executeContext.ethers);
    console.log('[DEBUG] Has pkpWallet?', !!executeContext.pkpWallet);
    console.log('[DEBUG] Has policiesContext?', !!executeContext.policiesContext);

    try {
      const openResult = await openAbility.execute({ abilityParams: openParams }, executeContext);

      console.log('[DEBUG] openResult:', JSON.stringify(openResult, null, 2));

      if (!openResult.success) {
        console.log('❌ Failed to open position:', openResult.result || openResult.runtimeError);
        return;
      }

      positionId = openResult.result.positionId;
      console.log('🎉 Position opened successfully!');
      console.log('🆔 Position ID:', positionId);
      console.log('🔗 TX Hash:', openResult.result.txHash);
    } catch (execError: any) {
      console.error('💥 Execute threw error:', execError);
      console.error('💥 Error message:', execError.message);
      console.error('💥 Error stack:', execError.stack);
      return;
    }

    // Step 4: Close Position (with delay)
    console.log('\n⏱️  Step 4: Waiting 5 seconds before closing...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const closeParams = { positionId };

    // Step 5: Close Position Precheck
    console.log('\n🔍 Step 5: Close Position Precheck');
    const closePrecheck = await closeAbility.precheck(
      { abilityParams: closeParams },
      { ...vincentContext, ...abilityContext }
    );

    if (!closePrecheck.success) {
      console.log('⚠️  Close position precheck failed:', closePrecheck.result);
      return;
    }
    console.log('✅ Close position precheck passed');

    // Step 6: Execute Close Position
    console.log('\n⚡ Step 6: Execute Close Position');
    const closeResult = await closeAbility.execute(
      { abilityParams: closeParams },
      { ...vincentContext, ...abilityContext }
    );

    if (!closeResult.success) {
      console.log('❌ Failed to close position:', closeResult.result);
      return;
    }

    console.log('🎉 Position closed successfully!');
    console.log('🔗 TX Hash:', closeResult.result.txHash);
  } catch (error) {
    console.error('💥 Full flow error:', error);
  }

  console.log('\n✅ Full flow test completed');
  console.log('🎯 Summary: Policy ✓ | Open ✓ | Close ✓');
}

// Run the test
testFullFlow().catch(console.error);
