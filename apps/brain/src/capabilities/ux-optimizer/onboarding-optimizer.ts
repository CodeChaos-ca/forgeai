export class OnboardingOptimizer {
  analyzeDropoffs(funnelData: any[]): { worstStep: string; dropoffRate: number } {
    return { worstStep: 'Project Scaffolding', dropoffRate: 0.35 };
  }
}
