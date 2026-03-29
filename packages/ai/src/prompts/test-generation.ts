export function testGenerationPrompt(
  fileName: string,
  sourceCode: string,
  testFramework: string = 'Vitest'
): string {
  return `
TASK: Automated Test Generation

TARGET SOURCE FILE: ${fileName}
FRAMEWORK: ${testFramework}

SOURCE CODE TO TEST:
\`\`\`
${sourceCode}
\`\`\`

INSTRUCTIONS:
1. Carefully analyze the business logic, branching conditionals, and edge cases in the target source code.
2. Write a comprehensive test suite that achieves near 100% path coverage.
3. Utilize ${testFramework}'s semantic testing syntax (e.g., describe, it, expect).
4. Do not test framework internals, only test our business logic. Address boundary limits, null values, and asynchronous rejections.
5. Provide the output in a clean code block.

\`\`\`typescript
// Generated ${testFramework} spec file
\`\`\`
`;
}
