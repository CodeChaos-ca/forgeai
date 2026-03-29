export function codeGenerationPrompt(
  fileName: string,
  userRequest: string,
  existingCode?: string
): string {
  return `
TASK: Code Generation Mutation

TARGET FILE: ${fileName}

USER REQUEST:
${userRequest}

${existingCode ? `EXISTING CODE:\n\`\`\`\n${existingCode}\n\`\`\`\n` : `This is a new file.`}

INSTRUCTIONS:
1. Determine exactly what logic needs to be added, changed, or deleted to fulfill the USER REQUEST.
2. If this is an existing file, do not rewrite the entire file unless structurally necessary. Provide structural replacements. If full context is required for the user, output the complete file. 
3. Provide robust error handling and strict TypeScript types.
4. Output ONLY valid Markdown containing the code block. Format it strictly as follows:

\`\`\`typescript
// your implementation here
\`\`\`
`;
}
