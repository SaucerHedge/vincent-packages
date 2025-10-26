#!/usr/bin/env tsx

import { testConfig, validateTestConfig } from '../utils/test-config.js';
import { createMockPolicyContext } from '../utils/mock-vincent-context.js';
import { vincentPolicy as maxPositionSizePolicy } from '../../packages/max-position-size-policy/dist/lib/vincent-policy.js';

async function testMaxPositionSizePolicy() {
  console.log('🧪 Testing MaxPositionSizePolicy');
  console.log('=' .repeat(50));

  // Validate config
  validateTestConfig();

  const policyContext = createMockPolicyContext();

  // Test 1: Normal position (should pass)
  console.log('\n✅ Test 1: Normal position (should ALLOW)');
  const normalParams = {
    abilityParams: {
      token0: testConfig.HBAR_TOKEN_ADDRESS,
      token1: testConfig.USDC_TOKEN_ADDRESS,
      amount0: testConfig.TEST_AMOUNTS.HBAR,
      amount1: testConfig.TEST_AMOUNTS.USDC,
      tickLower: -887220,
      tickUpper: 887220,
    },
    userParams: {
      maxPositionUSD: '10000', // $10,000 limit
    },
  };

  console.log('📝 Normal Position:');
  console.log('  HBAR:', parseInt(normalParams.abilityParams.amount0) / 1e8);
  console.log('  USDC:', parseInt(normalParams.abilityParams.amount1) / 1e6);
  console.log('  Max allowed: $10,000');

  try {
    const normalPrecheck = await maxPositionSizePolicy.precheck(
      normalParams,
      policyContext
    );
    console.log('📊 Normal Precheck Result:', normalPrecheck);

    const normalEval = await maxPositionSizePolicy.evaluate(
      normalParams,
      policyContext
    );
    console.log('📊 Normal Evaluate Result:', normalEval);
  } catch (error) {
    console.error('💥 Normal test error:', error);
  }

  // Test 2: Large position (should fail)
  console.log('\n❌ Test 2: Large position (should DENY)');
  const largeParams = {
    abilityParams: {
      token0: testConfig.HBAR_TOKEN_ADDRESS,
      token1: testConfig.USDC_TOKEN_ADDRESS,
      amount0: testConfig.LARGE_TEST_AMOUNTS.HBAR,
      amount1: testConfig.LARGE_TEST_AMOUNTS.USDC,
      tickLower: -887220,
      tickUpper: 887220,
    },
    userParams: {
      maxPositionUSD: '10000', // $10,000 limit
    },
  };

  console.log('📝 Large Position:');
  console.log('  HBAR:', parseInt(largeParams.abilityParams.amount0) / 1e8);
  console.log('  USDC:', parseInt(largeParams.abilityParams.amount1) / 1e6);
  console.log('  Max allowed: $10,000');

  try {
    const largePrecheck = await maxPositionSizePolicy.precheck(
      largeParams,
      policyContext
    );
    console.log('📊 Large Precheck Result:', largePrecheck);

    const largeEval = await maxPositionSizePolicy.evaluate(
      largeParams,
      policyContext
    );
    console.log('📊 Large Evaluate Result:', largeEval);
  } catch (error) {
    console.error('💥 Large test error:', error);
  }

  console.log('\n✅ Policy test completed');
}

// Run the test
testMaxPositionSizePolicy().catch(console.error);
