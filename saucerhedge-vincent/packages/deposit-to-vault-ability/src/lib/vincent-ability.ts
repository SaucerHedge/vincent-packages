import { createVincentAbility } from '@lit-protocol/vincent-ability-sdk';
import { z } from 'zod';

const VAULT_MANAGER_ADDRESS = '0x5db8d6e05156e532a55e6e98e4bfc33df9cd8586';

const abilityParamsSchema = z.object({
  token: z.string().describe('Token address (USDC or HBAR)'),
  amount: z.string().describe('Amount to deposit in smallest unit'),
});

const emptyPolicyMap = {
  policyByPackageName: {},
  policyByIpfsCid: {},
  cidToPackageName: new Map<string, string>(),
  packageNameToCid: new Map<string, string>(),
};

const precheckSuccessSchema = z.object({
  tokenBalance: z.string(),
  tokenAllowance: z.string(),
  sufficientBalance: z.boolean(),
});

const precheckFailSchema = z.object({
  reason: z.string(),
});

const executeSuccessSchema = z.object({
  txHash: z.string(),
  sharesReceived: z.string(),
  vaultAddress: z.string(),
  blockNumber: z.number(),
});

const executeFailSchema = z.object({
  error: z.string(),
  code: z.string(),
});

export const vincentAbility = createVincentAbility({
  packageName: '@saucerhedge/deposit-to-vault-ability',
  abilityDescription: 'Deposits tokens to SaucerHedge multi-asset vaults',
  abilityParamsSchema,
  supportedPolicies: emptyPolicyMap,
  precheckSuccessSchema,
  precheckFailSchema,
  executeSuccessSchema,
  executeFailSchema,

  precheck: async ({ abilityParams }, abilityContext: any) => {
    console.log('🔍 [PRECHECK] Deposit to Vault precheck');
    const { token, amount } = abilityParams;

    try {
      const ethers = abilityContext.ethers;
      const pkpWallet = abilityContext.pkpWallet;
      const delegatorAddress =
        abilityContext.delegation?.delegatorPkpInfo?.ethAddress ||
        abilityContext.delegation?.delegator;

      const tokenContract = new ethers.Contract(
        token,
        [
          'function balanceOf(address) view returns (uint256)',
          'function allowance(address,address) view returns (uint256)',
        ],
        pkpWallet
      );

      const [balance, allowance] = await Promise.all([
        tokenContract.balanceOf(delegatorAddress),
        tokenContract.allowance(delegatorAddress, VAULT_MANAGER_ADDRESS),
      ]);

      console.log('💰 Token Balance:', balance.toString());
      console.log('✅ Token Allowance:', allowance.toString());

      const amountBN = ethers.BigNumber.from(amount);

      if (balance.lt(amountBN)) {
        return abilityContext.fail({
          reason: `Insufficient balance. Have ${balance.toString()}, need ${amount}`,
        });
      }

      return abilityContext.succeed({
        tokenBalance: balance.toString(),
        tokenAllowance: allowance.toString(),
        sufficientBalance: true,
      });
    } catch (error: any) {
      return abilityContext.fail({
        reason: `Precheck failed: ${error.message}`,
      });
    }
  },

  execute: async ({ abilityParams }, abilityContext: any) => {
    console.log('⚡ [EXECUTE] Depositing to vault');
    const { token, amount } = abilityParams;

    try {
      const ethers = abilityContext.ethers;
      const pkpWallet = abilityContext.pkpWallet;

      if (!ethers || !pkpWallet) {
        return abilityContext.fail({
          error: 'Missing ethers or pkpWallet in context',
          code: 'MISSING_CONTEXT',
        });
      }

      console.log(`[EXECUTE] Depositing ${amount} of token ${token}`);

      // Check if vault exists, if not create it
      const vaultManagerContract = new ethers.Contract(
        VAULT_MANAGER_ADDRESS,
        [
          'function getVault(address token) view returns (address)',
          'function deposit(address token, uint256 amount) external returns (uint256 shares)',
          'event Deposit(address indexed user, address indexed token, uint256 amount, uint256 shares)',
        ],
        pkpWallet
      );

      let vaultAddress = await vaultManagerContract.getVault(token);
      console.log('📍 Vault address for token:', vaultAddress);

      if (vaultAddress === ethers.constants.AddressZero) {
        console.log('⚠️ No vault exists for this token!');
        return abilityContext.fail({
          error: 'No vault exists for this token. Please create vault first.',
          code: 'VAULT_NOT_FOUND',
        });
      }

      // Approve token
      const tokenContract = new ethers.Contract(
        token,
        [
          'function approve(address,uint256) returns (bool)',
          'function allowance(address,address) view returns (uint256)',
        ],
        pkpWallet
      );

      console.log('🔐 Approving token...');
      const approveTx = await tokenContract.approve(VAULT_MANAGER_ADDRESS, amount);
      const approveReceipt = await approveTx.wait();
      console.log('✅ Token approved, TX:', approveReceipt.transactionHash);

      // Verify allowance
      const allowance = await tokenContract.allowance(pkpWallet.address, VAULT_MANAGER_ADDRESS);
      console.log('✅ Current allowance:', allowance.toString());

      if (allowance.lt(ethers.BigNumber.from(amount))) {
        return abilityContext.fail({
          error: `Insufficient allowance. Have ${allowance.toString()}, need ${amount}`,
          code: 'INSUFFICIENT_ALLOWANCE',
        });
      }

      // Deposit to vault
      console.log('🏦 Depositing to vault...');
      const tx = await vaultManagerContract.deposit(token, amount, { gasLimit: 3_000_000 });

      console.log('📡 TX sent:', tx.hash);
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        console.error('❌ Transaction reverted');
        return abilityContext.fail({
          error: 'Transaction reverted',
          code: 'TX_REVERTED',
        });
      }

      console.log('✅ TX confirmed at block:', receipt.blockNumber);

      const event = receipt.events?.find((e: any) => e.event === 'Deposit');
      if (!event) {
        console.warn('⚠️ No Deposit event found, trying to get shares from logs');
        // If no decoded event, return success with basic info
        return abilityContext.succeed({
          txHash: receipt.transactionHash,
          sharesReceived: '0',
          vaultAddress,
          blockNumber: receipt.blockNumber,
        });
      }

      const sharesReceived = event.args?.shares?.toString() || '0';

      console.log('🎟️ Shares received:', sharesReceived);

      return abilityContext.succeed({
        txHash: receipt.transactionHash,
        sharesReceived,
        vaultAddress,
        blockNumber: receipt.blockNumber,
      });
    } catch (error: any) {
      console.error('💥 Deposit error:', error);
      console.error('💥 Error reason:', error.reason);
      console.error('💥 Error code:', error.code);
      return abilityContext.fail({
        error: error?.reason || error?.message || 'Unknown error',
        code: error?.code || 'UNKNOWN_ERROR',
      });
    }
  },
});
