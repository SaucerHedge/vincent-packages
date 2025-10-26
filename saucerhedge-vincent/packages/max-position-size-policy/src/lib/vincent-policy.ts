import { createVincentPolicy } from '@lit-protocol/vincent-ability-sdk';
import { z } from 'zod';

const abilityParamsSchema = z.object({
  token0: z.string(),
  token1: z.string(),
  amount0: z.string(),
  amount1: z.string(),
  tickLower: z.number(),
  tickUpper: z.number(),
});

const userParamsSchema = z.object({
  maxPositionUSD: z.string().default('10000').describe('Maximum position size in USD'),
});

const precheckAllowResultSchema = z.object({
  positionValue: z.string(),
  maxAllowed: z.string(),
  approved: z.boolean(),
});

const precheckDenyResultSchema = z.object({
  reason: z.string(),
  requestedValue: z.string(),
  maxAllowed: z.string(),
});

const evalAllowResultSchema = precheckAllowResultSchema;
const evalDenyResultSchema = precheckDenyResultSchema;

export const vincentPolicy: any = createVincentPolicy({
  packageName: '@saucerhedge/max-position-size-policy',
  // Removed policyDescription - not in SDK 2.3.1
  abilityParamsSchema,
  userParamsSchema,
  
  precheckAllowResultSchema,
  precheckDenyResultSchema,
  evalAllowResultSchema,
  evalDenyResultSchema,

  precheck: async ({ abilityParams, userParams }, policyContext: any) => {
    console.log('🛡️ [POLICY] Checking position size');
    const { amount0, amount1 } = abilityParams;
    const { maxPositionUSD } = userParams;

    const hbarPrice = 0.12;
    const usdcPrice = 1.0;

    const amount0Readable = parseFloat(amount0) / 1e8;
    const amount1Readable = parseFloat(amount1) / 1e6;

    const totalValue = (amount0Readable * hbarPrice) + (amount1Readable * usdcPrice);
    const maxAllowed = parseFloat(maxPositionUSD);

    console.log(`💰 Position value: $${totalValue.toFixed(2)}`);
    console.log(`🎯 Max allowed: $${maxAllowed.toFixed(2)}`);

    if (totalValue > maxAllowed) {
      console.log('❌ Position exceeds limit');
      return policyContext.deny({
        reason: `Position $${totalValue.toFixed(2)} exceeds max $${maxAllowed.toFixed(2)}`,
        requestedValue: totalValue.toFixed(2),
        maxAllowed: maxAllowed.toFixed(2),
      });
    }

    console.log('✅ Position approved');
    return policyContext.allow({
      positionValue: totalValue.toFixed(2),
      maxAllowed: maxAllowed.toFixed(2),
      approved: true,
    });
  },

  evaluate: async ({ abilityParams, userParams }, policyContext: any) => {
    const { amount0, amount1 } = abilityParams;
    const { maxPositionUSD } = userParams;

    const hbarPrice = 0.12;
    const usdcPrice = 1.0;

    const amount0Readable = parseFloat(amount0) / 1e8;
    const amount1Readable = parseFloat(amount1) / 1e6;

    const totalValue = (amount0Readable * hbarPrice) + (amount1Readable * usdcPrice);
    const maxAllowed = parseFloat(maxPositionUSD);

    if (totalValue > maxAllowed) {
      return policyContext.deny({
        reason: `Position $${totalValue.toFixed(2)} exceeds max $${maxAllowed.toFixed(2)}`,
        requestedValue: totalValue.toFixed(2),
        maxAllowed: maxAllowed.toFixed(2),
      });
    }

    return policyContext.allow({
      positionValue: totalValue.toFixed(2),
      maxAllowed: maxAllowed.toFixed(2),
      approved: true,
    });
  },
});
