import { IntentClassification } from './perception';

export type QualityScore = {
  total: number;
  breakdown: { completeness: number; correctness: number; codeQuality: number; security: number; userExperience: number; performance: number; maintainability: number };
  issues: Array<{ criterion: string; severity: 'error' | 'warning' | 'info'; message: string; file?: string; line?: number }>;
  suggestions: string[];
};

export class QualityJudge {
  async scoreOutput(code: Array<{ path: string; content: string }>, context: any, intent: IntentClassification): Promise<QualityScore> {
    let completeness = 100;
    let correctness = 100;
    let codeQuality = 100;
    let security = 100;
    let ux = 100;
    let performance = 100;
    let maintainability = 100;

    const issues: QualityScore['issues'] = [];
    const suggestions: string[] = [];

    for (const file of code) {
      const content = file.content;
      const isReact = file.path.endsWith('.tsx') || file.path.endsWith('.jsx');
      const isApi = file.path.includes('/api/') || file.path.includes('route.ts');

      // COMPLETENESS
      const placeholderCount = (content.match(/\/\/\s*(TODO|FIXME|HACK|implement|placeholder)/gi) || []).length;
      if (placeholderCount > 0) {
        let penalty = Math.min(100, placeholderCount * 20);
        completeness -= penalty;
        issues.push({ criterion: 'Completeness', severity: 'error', message: `Found ${placeholderCount} placeholders.`, file: file.path });
      }

      if (isReact) {
        if (!/(Skeleton|Spinner|isLoading)/i.test(content)) { completeness -= 15; issues.push({ criterion: 'Completeness', severity: 'warning', message: 'Missing loading state pattern.', file: file.path }); }
        if (!/(ErrorBoundary|error|isError)/i.test(content)) { completeness -= 15; issues.push({ criterion: 'Completeness', severity: 'warning', message: 'Missing error state handling.', file: file.path }); }
      }
      if (isApi && !/zod/i.test(content)) { completeness -= 20; issues.push({ criterion: 'Completeness', severity: 'error', message: 'API missing Zod schema validation.', file: file.path }); }

      // CORRECTNESS
      const anyCount = (content.match(/:\s*any[\s>,;]/g) || []).length;
      if (anyCount > 0) { correctness -= anyCount * 5; issues.push({ criterion: 'Correctness', severity: 'warning', message: `Found ${anyCount} usages of 'any' type.`, file: file.path }); }
      
      if (isApi && !/({success.*data}|{success.*error})/is.test(content)) { correctness -= 15; issues.push({ criterion: 'Correctness', severity: 'warning', message: 'API response lacks standard envelope formatting.', file: file.path }); }
      
      if (/\$[a-zA-Z0-9_]+/.test(content) && /(SELECT|INSERT|UPDATE|DELETE)/i.test(content) && !/sql`/i.test(content)) {
         correctness -= 25; issues.push({ criterion: 'Correctness', severity: 'error', message: 'Potential SQL interpolation detected outside Drizzle/SQL bounds.', file: file.path });
      }

      // CODE QUALITY
      const lines = content.split('\n');
      if (lines.length > 300) { codeQuality -= 10; issues.push({ criterion: 'Code Quality', severity: 'info', message: 'File exceeds 300 lines.', file: file.path }); }
      
      const logCount = (content.match(/console\.log/g) || []).length;
      if (logCount > 0) { codeQuality -= logCount * 5; issues.push({ criterion: 'Code Quality', severity: 'info', message: `Found ${logCount} console.log statements.`, file: file.path }); }

      // SECURITY
      const dangerouslySet = (content.match(/dangerouslySetInnerHTML/g) || []).length;
      if (dangerouslySet > 0) { security -= dangerouslySet * 30; issues.push({ criterion: 'Security', severity: 'error', message: 'dangerouslySetInnerHTML detected natively.', file: file.path }); }
      
      if (/eval\(|new Function\(/.test(content)) { security -= 50; issues.push({ criterion: 'Security', severity: 'error', message: 'eval() or new Function() detected natively.', file: file.path }); }
      
      if (/(sk_|pk_|key_|password=)[a-zA-Z0-9]{10,}/.test(content)) { security -= 40; issues.push({ criterion: 'Security', severity: 'error', message: 'Hardcoded secrets pattern detected natively.', file: file.path }); }

      if (isApi && !/(requireAuth|withAuth|session|jwt)/i.test(content) && /(POST|PUT|DELETE|PATCH)/i.test(content)) {
         security -= 20; issues.push({ criterion: 'Security', severity: 'error', message: 'Mutation API lacks explicitly declared Auth bounds.', file: file.path });
      }

      // USER EXPERIENCE
      if (isReact) {
        if (!/(sm:|md:|lg:|xl:)/.test(content)) { ux -= 15; issues.push({ criterion: 'UX', severity: 'info', message: 'No responsive tailwind classes found.', file: file.path }); }
        if (!/dark:/.test(content)) { ux -= 10; issues.push({ criterion: 'UX', severity: 'info', message: 'Dark mode support missing.', file: file.path }); }
        if (/<button/i.test(content) && !/disabled/i.test(content)) { ux -= 10; issues.push({ criterion: 'UX', severity: 'warning', message: 'Button element lacks disabled loading state.', file: file.path }); }
      }

      // PERFORMANCE
      if (/SELECT\s+\*\s+FROM/i.test(content)) { performance -= 20; issues.push({ criterion: 'Performance', severity: 'warning', message: 'SELECT * detected. Map columns explicitly.', file: file.path }); }
      if (/<img/i.test(content)) { performance -= 10; issues.push({ criterion: 'Performance', severity: 'warning', message: 'Raw <img> tag used instead of next/image.', file: file.path }); }

      // MAINTAINABILITY
      if (!/@forgeai\/shared/i.test(content) && content.includes('interface')) { maintainability -= 0; } else { maintainability += 10; }
    }

    // Floors
    completeness = Math.max(0, completeness);
    correctness = Math.max(0, correctness);
    codeQuality = Math.max(0, codeQuality);
    security = Math.max(0, security);
    ux = Math.max(0, ux);
    performance = Math.max(0, performance);
    maintainability = Math.max(0, maintainability);

    if (issues.length > 0) suggestions.push('Review all strict formatting criteria logged.');

    const total = 
      (completeness * 0.20) + 
      (correctness * 0.25) + 
      (codeQuality * 0.15) + 
      (security * 0.15) + 
      (ux * 0.10) + 
      (performance * 0.10) + 
      (maintainability * 0.05);

    return {
      total: Math.max(0, Math.min(100, Math.round(total))),
      breakdown: { completeness, correctness, codeQuality, security, userExperience: ux, performance, maintainability },
      issues,
      suggestions
    };
  }
}
