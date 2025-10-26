import { createVincentAbility } from '@lit-protocol/vincent-ability-sdk';
import { z } from 'zod';

const VAULT_MANAGER_ADDRESS = '0x5db8d6e05156e532a55e6e98e4bfc33df9cd8586';

const abilityParamsSchema = z.object({
  token0: z.string().describe('Token 0 address'),
  token1: z.string().describe('Token 1 address'),
  shares0: z.string().describe('Vault shares for token0'),
  shares1: z.string().describe('Vault shares for token1'),
  tickLower: z.number().int().default(-887220).describe('Lower tick'),
  tickUpper: z.number().int().default(887220).describe('Upper tick'),
});

const emptyPolicyMap = {
  policyByPackageName: {},
  policyByIpfsCid: {},
  cidToPackageName: new Map<string, string>(),
  packageNameToCid: new Map<string, string>(),
};

const precheckSuccessSchema = z.object({
  shares0Balance: z.string(),
  shares1Balance: z.string(),
  sufficientShares: z.boolean(),
});

const precheckFailSchema = z.object({
  reason: z.string(),
});

const executeSuccessSchema = z.object({
  txHash: z.string(),
  positionId: z.string(),
  lpValue: z.string(),
  shortValue: z.string(),
  blockNumber: z.number(),
});

const executeFailSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const vincentAbility = createVincentAbility({
  packageName: '@saucerhedge/open-vault-hedged-position-ability',
  abilityDescription: 'Opens hedged LP position using vault shares (redeems + opens LP + short)',
  abilityParamsSchema,
  supportedPolicies: emptyPolicyMap,
  precheckSuccessSchema,
  precheckFailSchema,
  executeSuccessSchema,
  executeFailSchema,

  precheck: async ({ abilityParams }, abilityContext: any) => {
    console.log('🔍 [PRECHECK] Open vault hedged position precheck');
    const { token0, token1, shares0, shares1 } = abilityParams;

    try {
      const ethers = abilityContext.ethers;
      const pkpWallet = abilityContext.pkpWallet;
      const delegatorAddress =
        abilityContext.delegation?.delegatorPkpInfo?.ethAddress ||
        abilityContext.delegation?.delegator;

      // Get vault addresses from VaultManager
      const vaultManagerContract = new ethers.Contract(
        VAULT_MANAGER_ADDRESS,
        ['function getVault(address token) view returns (address)'],
        pkpWallet
      );

      const [vault0, vault1] = await Promise.all([
        vaultManagerContract.getVault(token0),
        vaultManagerContract.getVault(token1),
      ]);

      // Check share balances
      const vault0Contract = new ethers.Contract(
        vault0,
        ['function balanceOf(address) view returns (uint256)'],
        pkpWallet
      );
      const vault1Contract = new ethers.Contract(
        vault1,
        ['function balanceOf(address) view returns (uint256)'],
        pkpWallet
      );

      const [balance0, balance1] = await Promise.all([
        vault0Contract.balanceOf(delegatorAddress),
        vault1Contract.balanceOf(delegatorAddress),
      ]);

      console.log('🎟️ Vault0 Shares Balance:', balance0.toString());
      console.log('🎟️ Vault1 Shares Balance:', balance1.toString());

      const shares0BN = ethers.BigNumber.from(shares0);
      const shares1BN = ethers.BigNumber.from(shares1);

      if (balance0.lt(shares0BN) || balance1.lt(shares1BN)) {
        return abilityContext.fail({
          reason: `Insufficient shares. Need ${shares0} vault0 and ${shares1} vault1`,
        });
      }

      return abilityContext.succeed({
        shares0Balance: balance0.toString(),
        shares1Balance: balance1.toString(),
        sufficientShares: true,
      });
    } catch (error: any) {
      return abilityContext.fail({
        reason: `Precheck failed: ${error.message}`,
      });
    }
  },

  execute: async ({ abilityParams }, abilityContext: any) => {
    console.log('⚡ [EXECUTE] Opening vault hedged position');
    const { token0, token1, shares0, shares1, tickLower, tickUpper } = abilityParams;

    try {
      const ethers = abilityContext.ethers;
      const pkpWallet = abilityContext.pkpWallet;

      if (!ethers || !pkpWallet) {
        return abilityContext.fail({
          error: 'Missing ethers or pkpWallet in context',
          code: 'MISSING_CONTEXT',
        });
      }

      console.log(`[EXECUTE] Opening hedged position with shares: ${shares0}, ${shares1}`);

      const vaultManagerContract = new ethers.Contract(
        VAULT_MANAGER_ADDRESS,
        [
          'function openHedgedPosition(address token0, address token1, uint256 shares0, uint256 shares1, int24 tickLower, int24 tickUpper) external returns (uint256 positionId)',
          'event HedgedPositionOpened(address indexed user, uint256 indexed positionId, uint256 lpValue, uint256 shortValue)',
        ],
        pkpWallet
      );

      console.log('🚀 Opening hedged position...');
      const tx = await vaultManagerContract.openHedgedPosition(
        token0,
        token1,
        shares0,
        shares1,
        tickLower,
        tickUpper,
        { gasLimit: 5_000_000 }
      );

      console.log('📡 TX sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ TX confirmed at block:', receipt.blockNumber);

      const event = receipt.events?.find((e: any) => e.event === 'HedgedPositionOpened');
      if (!event) {
        return abilityContext.fail({
          error: 'No HedgedPositionOpened event found',
          code: 'NO_EVENT_FOUND',
        });
      }

      const positionId = event.args?.positionId?.toString() || '0';
      const lpValue = event.args?.lpValue?.toString() || '0';
      const shortValue = event.args?.shortValue?.toString() || '0';

      console.log('🆔 Position ID:', positionId);
      console.log('💎 LP Value:', lpValue);
      console.log('📉 Short Value:', shortValue);

      return abilityContext.succeed({
        txHash: receipt.transactionHash,
        positionId,
        lpValue,
        shortValue,
        blockNumber: receipt.blockNumber,
      });
    } catch (error: any) {
      console.error('💥 Open position error:', error);
      return abilityContext.fail({
        error: error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN_ERROR',
      });
    }
  },
});
