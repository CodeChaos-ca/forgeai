export class CostSentinel {
  private dailyStats: { [date: string]: { totalRequests: number; totalCostUSD: number; blockedRequests: number } } = {};

  private getTodayKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  private initToday(): void {
    const today = this.getTodayKey();
    if (!this.dailyStats[today]) {
       this.dailyStats[today] = { totalRequests: 0, totalCostUSD: 0, blockedRequests: 0 };
    }
  }

  checkCost(provider: string, operation: string, estimatedTokens: number): { wouldCost: boolean; estimatedCostUSD: number; recommendation: string } {
    this.initToday();
    const today = this.getTodayKey();
    
    // The entire architecture maps to $0. If mapping finds > 0 mathematically, it blocks entirely.
    // Hardcoded absolute boundaries for mapping providers
    const paidProviders = ['openai', 'anthropic', 'aws_bedrock', 'azure_openai'];
    let estimatedCost = 0;

    if (paidProviders.includes(provider.toLowerCase())) {
        estimatedCost = (estimatedTokens / 1000) * 0.01; // Arbitrary 1 cent per 1k block assumption
    }

    const wouldCost = estimatedCost > 0;
    
    if (wouldCost) {
      return { wouldCost: true, estimatedCostUSD: estimatedCost, recommendation: `Switch to localai or ${provider}-free to prevent cost leakage.` };
    }

    this.dailyStats[today].totalRequests++;
    return { wouldCost: false, estimatedCostUSD: 0, recommendation: 'Proceed safe zero-cost bound.' };
  }

  blockIfPaid(provider: string, operation: string): void {
    this.initToday();
    const today = this.getTodayKey();

    const check = this.checkCost(provider, operation, 1000);
    if (check.wouldCost) {
      this.dailyStats[today].blockedRequests++;
      throw new Error(`CostSentinel Exception: '${operation}' on '${provider}' breaks zero-cost policy. Blocked automatically. Recommendation: ${check.recommendation}`);
    }
  }

  async getDailyReport(): Promise<{ totalRequests: number; totalCostUSD: number; blockedRequests: number }> {
    this.initToday();
    return this.dailyStats[this.getTodayKey()];
  }
}
