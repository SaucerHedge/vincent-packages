import { createVincentAbility } from '@lit-protocol/vincent-ability-sdk';
import { z } from 'zod';

const VAULT_MANAGER_ADDRESS = '0x5db8d6e05156e532a55e6e98e4bfc33df9cd8586';

const abilityParamsSchema = z.object({
  positionId: z.string().describe('Position ID to query'),
});

const emptyPolicyMap = {
  policyByPackageName: {},
  policyByIpfsCid: {},
  cidToPackageName: new Map<string, string>(),
  packageNameToCid: new Map<string, string>(),
};

const precheckSuccessSchema = z.object({
  positionExists: z.boolean(),
});

const precheckFailSchema = z.object({
  reason: z.string(),
});

const executeSuccessSchema = z.object({
  positionId: z.string(),
  owner: z.string(),
  lpValue: z.string(),
  shortValue: z.string(),
  feesEarned: z.string(),
  netIL: z.string(),
  isActive: z.boolean(),
});

const executeFailSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const vincentAbility = createVincentAbility({
  packageName: '@saucerhedge/get-position-status-ability',
  abilityDescription: 'Gets current status of a hedged position (read-only)',
  abilityParamsSchema,
  supportedPolicies: emptyPolicyMap,
  precheckSuccessSchema,
  precheckFailSchema,
  executeSuccessSchema,
  executeFailSchema,

  precheck: async ({ abilityParams }, abilityContext: any) => {
    console.log('🔍 [PRECHECK] Get position status precheck');
    const { positionId } = abilityParams;

    try {
      const ethers = abilityContext.ethers;
      const pkpWallet = abilityContext.pkpWallet;

      const vaultManagerContract = new ethers.Contract(
        VAULT_MANAGER_ADDRESS,
        ['function positions(uint256) view returns (address owner, bool isActive)'],
        pkpWallet
      );

      const position = await vaultManagerContract.positions(positionId);
      const isActive = position.isActive || false;

      console.log('📊 Position exists:', isActive);

      return abilityContext.succeed({
        positionExists: isActive,
      });
    } catch (error: any) {
      return abilityContext.fail({
        reason: `Precheck failed: ${error.message}`,
      });
    }
  },

  execute: async ({ abilityParams }, abilityContext: any) => {
    console.log('⚡ [EXECUTE] Getting position status');
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
          'function getPositionStatus(uint256 positionId) view returns (address owner, uint256 lpValue, uint256 shortValue, uint256 feesEarned, int256 netIL, bool isActive)',
        ],
        pkpWallet
      );

      console.log('📊 Fetching position status...');
      const status = await vaultManagerContract.getPositionStatus(positionId);

      console.log('✅ Position fetched');

      return abilityContext.succeed({
        positionId,
        owner: status.owner,
        lpValue: status.lpValue.toString(),
        shortValue: status.shortValue.toString(),
        feesEarned: status.feesEarned.toString(),
        netIL: status.netIL.toString(),
        isActive: status.isActive,
      });
    } catch (error: any) {
      console.error('💥 Get status error:', error);
      return abilityContext.fail({
        error: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN_ERROR',
      });
    }
  },
});
