import { ESLint } from 'eslint';

interface ScoreBreakdown {
  completeness: number; // Max 20
  correctness: number;  // Max 25
  code_quality: number; // Max 15
  security: number;     // Max 15
  ux: number;           // Max 10
  performance: number;  // Max 10
  maintainability: number; // Max 5
}

interface JudgeResult {
  total: number;
  breakdown: ScoreBreakdown;
  issues: string[];
  suggestions: string[];
}

export class QualityJudge {
  
  async scoreOutput(code: string, context: any, intent: string): Promise<JudgeResult> {
    const issues: string[] = [];
    let score = {
      completeness: 20, 
      correctness: 25,  
      code_quality: 15, 
      security: 15,     
      ux: 10,           
      performance: 10,  
      maintainability: 5 
    };

    // 1. Placeholder & Skeleton checks
    const placeholderRegex = /TODO|FIXME|\.\.\.|placeholder|console\.log/ig;
    if (placeholderRegex.test(code)) {
      issues.push('Code contains unresolved placeholders or debug logs.');
      score.completeness -= 10;
      score.code_quality -= 5;
    }

    // 2. TypeScript/ESLint API check (Simulated strict rules check without writing to disk if possible)
    try {
      const eslint = new ESLint({ useEslintrc: false, overrideConfig: {
        parser: '@typescript-eslint/parser',
        rules: { 'no-eval': 'error', 'no-implied-eval': 'error', 'prefer-const': 'error' }
      }});
      
      const results = await eslint.lintText(code, { filePath: 'temp.ts' });
      for (const result of results) {
        if (result.errorCount > 0) {
          result.messages.forEach(m => issues.push(`ESLint [${m.ruleId}]: ${m.message}`));
          score.correctness = Math.max(0, score.correctness - (result.errorCount * 2));
        }
      }
    } catch (err: any) {
      issues.push(`Linter failure implying severe syntactic violation: ${err.message}`);
      score.correctness = 0;
    }

    // 3. Simple React Hooks validation (if applicable)
    if (code.includes('use') && !/^ *import.*from 'react'/m.test(code) && code.includes('export')) {
      issues.push('React hook used outside standard dependency context or without import.');
      score.correctness -= 5;
    }

    // 4. Insecure Regex validations
    const insecureRegexPatterns = [/dangerouslySetInnerHTML/, /innerHTML/, /eval\(/];
    for (const pat of insecureRegexPatterns) {
      if (pat.test(code)) {
        issues.push(`Highly insecure pattern detected: ${pat.source}`);
        score.security -= 15; // Instant failure
      }
    }

    // 5. Hardcoded secrets 
    if (/process\.env\.[A-Z_]+ *=/.test(code)) {
      issues.push('Do NOT mutate process environment variables dynamically.');
      score.security -= 5;
    }

    const totalScore = Math.max(0, Object.values(score).reduce((a, b) => a + b, 0));

    return {
      total: totalScore,
      breakdown: score,
      issues,
      suggestions: ["Refactor based on strict ESLint violations", "Remove any lingering inline comments labeled TODO"]
    };
  }
}
