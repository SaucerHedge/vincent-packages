import { testConfig, validateTestConfig } from '../utils/test-config.js';
import { 
  createMockVincentContext, 
  createMockAbilityContext 
} from '../utils/mock-vincent-context.js';
import { vincentAbility as openHedgedPositionAbility } from '../../packages/open-hedged-position-ability/dist/lib/vincent-ability.js';

async function testOpenPosition() {
  console.log('🧪 Testing OpenHedgedPositionAbility');
  console.log('=' .repeat(50));

  // Validate config
  validateTestConfig();

  // Create mock context
  const vincentContext = createMockVincentContext(
    testConfig.DELEGATEE_PRIVATE_KEY,
    testConfig.USER_VINCENT_PRIVATE_KEY,
    testConfig.HEDERA_RPC_URL
  );
  
  const abilityContext = createMockAbilityContext();

  // Test parameters
  const testParams = {
    token0: testConfig.HBAR_TOKEN_ADDRESS,
    token1: testConfig.USDC_TOKEN_ADDRESS,
    amount0: testConfig.TEST_AMOUNTS.HBAR,
    amount1: testConfig.TEST_AMOUNTS.USDC,
    tickLower: -887220,
    tickUpper: 887220,
  };

  console.log('📝 Test Parameters:');
  console.log('  Token0 (HBAR):', testParams.token0);
  console.log('  Token1 (USDC):', testParams.token1);
  console.log('  Amount0:', testParams.amount0, '(1 HBAR)');
  console.log('  Amount1:', testParams.amount1, '(100 USDC)');
  console.log('  Tick Range:', testParams.tickLower, 'to', testParams.tickUpper);

  try {
    // Test 1: Precheck
    console.log('\n🔍 Testing precheck...');
    const precheckResult = await openHedgedPositionAbility.precheck(
      { abilityParams: testParams },
      { ...vincentContext, ...abilityContext }
    );
    
    console.log('📊 Precheck Result:', precheckResult);

    if (!precheckResult.success) {
      console.log('⚠️  Precheck failed (expected if no tokens in wallet)');
      console.log('💡 To test execution, fund the user wallet with test tokens');
      return;
    }

    // Test 2: Execute (only if precheck passed)
    console.log('\n⚡ Testing execution...');
    const executeResult = await openHedgedPositionAbility.execute(
      { abilityParams: testParams },
      { ...vincentContext, ...abilityContext }
    );
    
    console.log('📊 Execute Result:', executeResult);

    if (executeResult.success) {
      console.log('🎉 Position opened successfully!');
      console.log('🆔 Position ID:', executeResult.result.positionId);
      console.log('🔗 TX Hash:', executeResult.result.txHash);
    } else {
      console.log('❌ Execution failed:', executeResult.result);
    }

  } catch (error) {
    console.error('💥 Test error:', error);
  }

  console.log('\n✅ OpenPosition test completed');
}

// Run the test
testOpenPosition().catch(console.error);
