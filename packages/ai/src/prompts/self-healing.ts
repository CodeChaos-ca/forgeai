export function selfHealingPrompt(
  failingComponent: string,
  errorTrace: string,
  currentCode: string
): string {
  return `
TASK: Autonomous Self-Healing Intervention

The following system component crashed repeatedly. You must diagnose and synthesize a structural fix.

COMPONENT NAME: ${failingComponent}

ERROR TRACE:
${errorTrace}

CURRENT SOURCE IMPLEMENTATION:
\`\`\`typescript
${currentCode}
\`\`\`

DIAGNOSIS INSTRUCTIONS:
1. Read the error trace backwards. Find the exact lexical violation or type mismatch in the implementation.
2. Cross-reference generic language behaviors (e.g., undefined maps in React, missing await clauses, mutating state loops).
3. Do not just patch the error. Fix the core structural flaw leading to the race condition or null pointer.

OUTPUT:
First provide a brief diagnosis (max 2 sentences).
Then provide the precise patched code replacement.

Diagnosis: ...

\`\`\`typescript
// Patched implementation
\`\`\`
`;
}
