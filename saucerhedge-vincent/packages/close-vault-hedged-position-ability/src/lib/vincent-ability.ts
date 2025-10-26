import { createVincentAbility } from '@lit-protocol/vincent-ability-sdk';
import { z } from 'zod';

const VAULT_MANAGER_ADDRESS = '0x5db8d6e05156e532a55e6e98e4bfc33df9cd8586';

const abilityParamsSchema = z.object({
  positionId: z.string().describe('Position ID to close'),
});

const emptyPolicyMap = {
  policyByPackageName: {},
  policyByIpfsCid: {},
  cidToPackageName: new Map<string, string>(),
  packageNameToCid: new Map<string, string>(),
};

const precheckSuccessSchema = z.object({
  positionExists: z.boolean(),
  isOwner: z.boolean(),
});

const precheckFailSchema = z.object({
  reason: z.string(),
});

const executeSuccessSchema = z.object({
  txHash: z.string(),
  positionId: z.string(),
  token0Returned: z.string(),
  token1Returned: z.string(),
  feesCollected: z.string(),
  blockNumber: z.number(),
});

const executeFailSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const vincentAbility = createVincentAbility({
  packageName: '@saucerhedge/close-vault-hedged-position-ability',
  abilityDescription: 'Closes hedged position (closes short + removes LP + returns tokens)',
  abilityParamsSchema,
  supportedPolicies: emptyPolicyMap,
  precheckSuccessSchema,
  precheckFailSchema,
  executeSuccessSchema,
  executeFailSchema,

  precheck: async ({ abilityParams }, abilityContext: any) => {
    console.log('🔍 [PRECHECK] Close position precheck');
    const { positionId } = abilityParams;

    try {
      const ethers = abilityContext.ethers;
      const pkpWallet = abilityContext.pkpWallet;
      const delegatorAddress =
        abilityContext.delegation?.delegatorPkpInfo?.ethAddress ||
        abilityContext.delegation?.delegator;

      const vaultManagerContract = new ethers.Contract(
        VAULT_MANAGER_ADDRESS,
        ['function positions(uint256) view returns (address owner, bool isActive)'],
        pkpWallet
      );

      const position = await vaultManagerContract.positions(positionId);
      const owner = position.owner;
      const isActive = position.isActive || false;

      console.log('👤 Position owner:', owner);
      console.log('✅ Is active:', isActive);
      console.log('🔑 Is owner:', owner.toLowerCase() === delegatorAddress.toLowerCase());

      if (!isActive) {
        return abilityContext.fail({
          reason: 'Position is not active',
        });
      }

      if (owner.toLowerCase() !== delegatorAddress.toLowerCase()) {
        return abilityContext.fail({
          reason: 'Not position owner',
        });
      }

      return abilityContext.succeed({
        positionExists: isActive,
        isOwner: true,
      });
    } catch (error: any) {
      return abilityContext.fail({
        reason: `Precheck failed: ${error.message}`,
      });
    }
  },

  execute: async ({ abilityParams }, abilityContext: any) => {
    console.log('⚡ [EXECUTE] Closing hedged position');
    const { positionId } = abilityParams;

    try {
      const ethers = abilityContext.ethers;
      const pkpWallet = abilityContext.pkpWallet;

      if (!ethers || !pkpWallet) {
        return abilityContext.fail({
          error: 'Missing ethers or pkpWallet in context',
          code: 'MISSING_CONTEXT',
        });
      }

      const vaultManagerContract = new ethers.Contract(
        VAULT_MANAGER_ADDRESS,
        [
          'function closeHedgedPosition(uint256 positionId) external returns (uint256 token0Amount, uint256 token1Amount, uint256 feesCollected)',
          'event HedgedPositionClosed(address indexed user, uint256 indexed positionId, uint256 token0Returned, uint256 token1Returned, uint256 feesCollected)',
        ],
        pkpWallet
      );

      console.log('🚀 Closing position...');
      const tx = await vaultManagerContract.closeHedgedPosition(positionId, { gasLimit: 5_000_000 });

      console.log('📡 TX sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ TX confirmed at block:', receipt.blockNumber);

      const event = receipt.events?.find((e: any) => e.event === 'HedgedPositionClosed');
      if (!event) {
        return abilityContext.fail({
          error: 'No HedgedPositionClosed event found',
          code: 'NO_EVENT_FOUND',
        });
      }

      const token0Returned = event.args?.token0Returned?.toString() || '0';
      const token1Returned = event.args?.token1Returned?.toString() || '0';
      const feesCollected = event.args?.feesCollected?.toString() || '0';

      console.log('💰 Token0 returned:', token0Returned);
      console.log('💰 Token1 returned:', token1Returned);
      console.log('💸 Fees collected:', feesCollected);

      return abilityContext.succeed({
        txHash: receipt.transactionHash,
        positionId,
        token0Returned,
        token1Returned,
        feesCollected,
        blockNumber: receipt.blockNumber,
      });
    } catch (error: any) {
      console.error('💥 Close position error:', error);
      return abilityContext.fail({
        error: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN_ERROR',
      });
    }
  },
});
