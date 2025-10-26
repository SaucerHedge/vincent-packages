import { createVincentAbility } from '@lit-protocol/vincent-ability-sdk';
import { z } from 'zod';

const SAUCER_HEDGER_ADDRESS = '0xec13c047b446f63e4bbdd9dbe8fc129281afa1e9';

// Schemas
const abilityParamsSchema = z.object({
  token0: z.string().describe('Token 0 address (HBAR)'),
  token1: z.string().describe('Token 1 address (USDC)'),
  amount0: z.string().describe('Amount of token 0 in smallest unit'),
  amount1: z.string().describe('Amount of token 1 in smallest unit'),
  tickLower: z.number().int().default(-887220).describe('Lower tick bound'),
  tickUpper: z.number().int().default(887220).describe('Upper tick bound'),
});

const emptyPolicyMap = {
  policyByPackageName: {},
  policyByIpfsCid: {},
  cidToPackageName: new Map<string, string>(),
  packageNameToCid: new Map<string, string>(),
};

const precheckSuccessSchema = z.object({
  token0Balance: z.string(),
  token1Balance: z.string(),
  sufficientBalance: z.boolean(),
});

const precheckFailSchema = z.object({
  reason: z.string(),
});

const executeSuccessSchema = z.object({
  txHash: z.string(),
  positionId: z.string(),
  token0Amount: z.string(),
  token1Amount: z.string(),
  blockNumber: z.number(),
  lpValue: z.string().optional(),
  shortValue: z.string().optional(),
});

const executeFailSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const vincentAbility = createVincentAbility({
  packageName: '@saucerhedge/open-hedged-position-ability',
  abilityDescription: 'Opens hedged LP position (79% LP + 21% short hedge) on SaucerSwap V2',
  abilityParamsSchema,
  supportedPolicies: emptyPolicyMap,
  precheckSuccessSchema,
  precheckFailSchema,
  executeSuccessSchema,
  executeFailSchema,
  

  precheck: async ({ abilityParams }, abilityContext: any) => {
    console.log('🔍 [PRECHECK] Starting OpenHedgedPosition precheck');
    const { token0, token1, amount0, amount1 } = abilityParams;

    try {
      const ethers = abilityContext.ethers;
      const pkpWallet = abilityContext.pkpWallet;
      const delegatorAddress =
        abilityContext.delegation?.delegatorPkpInfo?.ethAddress ||
        abilityContext.delegation?.delegator;

      const token0Contract = new ethers.Contract(
        token0,
        ['function balanceOf(address) view returns (uint256)'],
        pkpWallet
      );

      const token1Contract = new ethers.Contract(
        token1,
        ['function balanceOf(address) view returns (uint256)'],
        pkpWallet
      );

      const [balance0, balance1] = await Promise.all([
        token0Contract.balanceOf(delegatorAddress),
        token1Contract.balanceOf(delegatorAddress),
      ]);

      console.log('💰 Token0 Balance:', balance0.toString());
      console.log('💰 Token1 Balance:', balance1.toString());

      const amount0BN = ethers.BigNumber.from(amount0);
      const amount1BN = ethers.BigNumber.from(amount1);

      if (balance0.lt(amount0BN) || balance1.lt(amount1BN)) {
        return abilityContext.fail({
          reason: `Insufficient balance. Need ${amount0} token0 and ${amount1} token1`,
        });
      }

      return abilityContext.succeed({
        token0Balance: balance0.toString(),
        token1Balance: balance1.toString(),
        sufficientBalance: true,
      });
    } catch (error: any) {
      return abilityContext.fail({
        reason: `Precheck failed: ${error.message}`,
      });
    }
  },

  execute: async ({ abilityParams }, abilityContext: any) => {
    console.log('⚡ [EXECUTE] Opening hedged position');
    const { token0, token1, amount0, amount1, tickLower, tickUpper } = abilityParams;

    try {
      const ethers = abilityContext.ethers;
      const pkpWallet = abilityContext.pkpWallet;

      if (!ethers || !pkpWallet) {
        console.error('💥 Missing ethers or pkpWallet');
        return abilityContext.fail({
          error: 'Missing ethers or pkpWallet in context',
          code: 'MISSING_CONTEXT',
        });
      }

      console.log(`[EXECUTE] Params:`, { token0, token1, amount0, amount1, tickLower, tickUpper });

      const token0Contract = new ethers.Contract(
        token0,
        ['function approve(address,uint256) returns (bool)'],
        pkpWallet
      );
      const token1Contract = new ethers.Contract(
        token1,
        ['function approve(address,uint256) returns (bool)'],
        pkpWallet
      );

      console.log('🔐 Approving tokens...');
      const approve0Tx = await token0Contract.approve(SAUCER_HEDGER_ADDRESS, amount0);
      const approve1Tx = await token1Contract.approve(SAUCER_HEDGER_ADDRESS, amount1);

      console.log('✅ Approval TXs sent');

      await approve0Tx.wait();
      await approve1Tx.wait();
      console.log('✅ Approvals confirmed');

      const saucerHedgerContract = new ethers.Contract(
        SAUCER_HEDGER_ADDRESS,
        [
          'function openHedgedLP(address,address,uint256,uint256,int24,int24) external payable returns (uint256)',
          'event HedgedPositionOpened(address indexed user, uint256 indexed positionId, uint256 tokenId, uint256 lpValue, uint256 shortValue)',
        ],
        pkpWallet
      );

      console.log('🚀 Calling openHedgedLP...');
      const tx = await saucerHedgerContract.openHedgedLP(
        token0,
        token1,
        amount0,
        amount1,
        tickLower,
        tickUpper,
        { value: 0, gasLimit: 5_000_000 }
      );

      console.log('📡 TX sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('✅ TX confirmed at block:', receipt.blockNumber);

      const event = receipt.events?.find((e: any) => e.event === 'HedgedPositionOpened');
      if (!event) {
        console.error('⚠️ HedgedPositionOpened event not found');
        return abilityContext.fail({
          error: 'No HedgedPositionOpened event found',
          code: 'NO_EVENT_FOUND',
        });
      }

      const positionId = event.args?.positionId?.toString() || '0';
      console.log('🆔 Position ID:', positionId);

      return abilityContext.succeed({
        txHash: receipt.transactionHash,
        positionId,
        token0Amount: amount0,
        token1Amount: amount1,
        blockNumber: receipt.blockNumber,
        lpValue: event.args?.lpValue?.toString(),
        shortValue: event.args?.shortValue?.toString(),
      });
    } catch (error: any) {
      console.error('💥 Uncaught error:', error);
      console.error('💥 Stack:', error?.stack);
      return abilityContext.fail({
        error: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN_ERROR',
      });
    }
  },
});
