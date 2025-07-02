
export interface PricingTier {
  tier1: number;
  tier2: number;
  tier3: number;
}

export interface PricingCategory {
  competitiveRetail: PricingTier;
  exclusivePricing: PricingTier;
  resellerNoRegret: PricingTier;
}

export const pricingMultipliers: PricingCategory = {
  competitiveRetail: {
    tier1: 1.0,    // Base price
    tier2: 0.95,   // 5% discount
    tier3: 0.90    // 10% discount
  },
  exclusivePricing: {
    tier1: 1.15,   // 15% premium
    tier2: 1.10,   // 10% premium
    tier3: 1.05    // 5% premium
  },
  resellerNoRegret: {
    tier1: 0.85,   // 15% discount
    tier2: 0.80,   // 20% discount
    tier3: 0.75    // 25% discount
  }
};

export const pricingCategoryLabels = {
  competitiveRetail: 'Competitive Retail Price',
  exclusivePricing: 'Exclusive Pricing',
  resellerNoRegret: 'Reseller No Regret Price'
};

export const tierLabels = {
  tier1: 'Tier 1',
  tier2: 'Tier 2',
  tier3: 'Tier 3'
};

export type PricingCategoryKey = keyof typeof pricingMultipliers;
export type TierKey = keyof PricingTier;
