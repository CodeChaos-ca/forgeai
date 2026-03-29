export const CREDIT_RULES = {
  ROLLOVER_MONTHS: 3,
  PURCHASE_PACKS: [
    { credits: 100, priceCents: 1000 },
    { credits: 300, priceCents: 2500 },
    { credits: 1000, priceCents: 7000 }
  ],
  DISCUSS_MODE_COST: 0,
  REGRESSION_REFUND_AUTO: true
} as const;

export const CREDIT_COSTS = {
  CODE_GENERATION: 1,
  COMPLEX_REASONING: 2,
  DEPLOYMENT: 5,
  AGENTIC_SEARCH: 1
} as const;
