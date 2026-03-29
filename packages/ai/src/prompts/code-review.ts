export function codeReviewPrompt(
  diff: string,
  authorNotes: string
): string {
  return `
TASK: Senior Engineering Code Review

DIFF PROPOSAL:
\`\`\`diff
${diff}
\`\`\`

AUTHOR NOTES:
${authorNotes || "No specific context provided."}

INSTRUCTIONS:
Perform an unforgiving, high-standard senior-level review of this code. 
Examine for:
1. Security vulnerabilities (Injection, CSRF, insecure closures, loose validation).
2. Performance regressions (O(n^2) loops, memory leaks, unindexed query patterns).
3. Architectural divergence.

If the code passes cleanly, output exactly: "APPROVE: Code meets standards."

If there are issues, list them aggressively in order of severity. Provide code snippets directly resolving the problem. 

Output format: Use Markdown.
`;
}
