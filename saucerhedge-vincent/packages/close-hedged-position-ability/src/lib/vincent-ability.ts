import { createVincentAbility } from '@lit-protocol/vincent-ability-sdk';
import { z } from 'zod';

const SAUCER_HEDGER_ADDRESS = '0xec13c047b446f63e4bbdd9dbe8fc129281afa1e9';

const abilityParamsSchema = z.object({
  positionId: z.string().describe('Position ID to close'),
});

const precheckSuccessSchema = z.object({
  positionId: z.string(),
  active: z.boolean(),
  token0: z.string(),
  token1: z.string(),
});

const precheckFailSchema = z.object({
  reason: z.string(),
});

const executeSuccessSchema = z.object({
  txHash: z.string(),
  positionId: z.string(),
  blockNumber: z.number(),
  status: z.string(),
});

const executeFailSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const vincentAbility = createVincentAbility({
  packageName: '@saucerhedge/close-hedged-position-ability',
  abilityDescription: 'Closes hedged position and returns funds to user',
  abilityParamsSchema,
  supportedPolicies: {} as any,
  
  precheckSuccessSchema,
  precheckFailSchema,
  executeSuccessSchema,
  executeFailSchema,

  precheck: async ({ abilityParams }, abilityContext: any) => {
    console.log('🔍 [PRECHECK] Checking position status');
    const { positionId } = abilityParams;

    try {
      const ethers = (abilityContext as any).ethers;
      const pkpWallet = (abilityContext as any).pkpWallet;
      const delegatorAddress = (abilityContext.delegation as any).delegatorPkpInfo?.ethAddress || 
                               (abilityContext.delegation as any).delegator;

      const saucerHedgerContract = new ethers.Contract(
        SAUCER_HEDGER_ADDRESS,
        [
          'function getPosition(address,uint256) view returns (tuple(uint256 tokenId, uint256 leverageId, uint128 liquidity, address token0, address token1, uint256 amount0, uint256 amount1, uint256 shortAmount, int24 tickLower, int24 tickUpper, bool active))',
        ],
        pkpWallet
      );

      const position = await saucerHedgerContract.getPosition(
        delegatorAddress,
        positionId
      );

      if (!position.active) {
        return abilityContext.fail({
          reason: `Position ${positionId} is not active`,
        });
      }

      console.log('✅ Position is active');
      return abilityContext.succeed({
        positionId,
        active: position.active,
        token0: position.token0,
        token1: position.token1,
      });
    } catch (error: any) {
      return abilityContext.fail({
        reason: `Position not found: ${error.message}`,
      });
    }
  },

  execute: async ({ abilityParams }, abilityContext: any) => {
    console.log('⚡ [EXECUTE] Closing position');
    const { positionId } = abilityParams;

    try {
      const ethers = (abilityContext as any).ethers;
      const pkpWallet = (abilityContext as any).pkpWallet;

      const saucerHedgerContract = new ethers.Contract(
        SAUCER_HEDGER_ADDRESS,
        [
          'function closeHedgedLP(uint256) external',
          'event HedgedPositionClosed(address indexed user, uint256 indexed positionId)',
        ],
        pkpWallet
      );

      console.log('🚀 Closing position...');
      const tx = await saucerHedgerContract.closeHedgedLP(positionId, {
        gasLimit: 5000000,
      });

      console.log('📡 TX sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ TX confirmed at block:', receipt.blockNumber);

      return abilityContext.succeed({
        txHash: receipt.transactionHash,
        positionId,
        blockNumber: receipt.blockNumber,
        status: 'closed',
      });
    } catch (error: any) {
      console.error('💥 Error:', error);
      return abilityContext.fail({
        error: error.message || 'Unknown error',
        code: error.code || 'UNKNOWN_ERROR',
      });
    }
  },
});
