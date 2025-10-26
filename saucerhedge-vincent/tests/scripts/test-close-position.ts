import { testConfig, validateTestConfig } from '../utils/test-config.js';
import { 
  createMockVincentContext, 
  createMockAbilityContext 
} from '../utils/mock-vincent-context.js';
import { vincentAbility as closeHedgedPositionAbility } from '../../packages/close-hedged-position-ability/dist/lib/vincent-ability.js';

async function testClosePosition() {
  console.log('🧪 Testing CloseHedgedPositionAbility');
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

  // Test parameters (you'll need a real position ID from opening a position)
  const testParams = {
    positionId: '0', // Replace with actual position ID
  };

  console.log('📝 Test Parameters:');
  console.log('  Position ID:', testParams.positionId);

  try {
    // Test 1: Precheck
    console.log('\n🔍 Testing precheck...');
    const precheckResult = await closeHedgedPositionAbility.precheck(
      { abilityParams: testParams },
      { ...vincentContext, ...abilityContext }
    );
    
    console.log('📊 Precheck Result:', precheckResult);

    if (!precheckResult.success) {
      console.log('⚠️  Precheck failed - position not found or not active');
      console.log('💡 Open a position first, then use its ID for this test');
      return;
    }

    // Test 2: Execute (only if precheck passed)
    console.log('\n⚡ Testing execution...');
    const executeResult = await closeHedgedPositionAbility.execute(
      { abilityParams: testParams },
      { ...vincentContext, ...abilityContext }
    );
    
    console.log('📊 Execute Result:', executeResult);

    if (executeResult.success) {
      console.log('🎉 Position closed successfully!');
      console.log('🔗 TX Hash:', executeResult.result.txHash);
    } else {
      console.log('❌ Execution failed:', executeResult.result);
    }

  } catch (error) {
    console.error('💥 Test error:', error);
  }

  console.log('\n✅ ClosePosition test completed');
}

// Run the test
testClosePosition().catch(console.error);
