export function impactAnalysisPrompt(
  proposedChangeDiff: string,
  dependencyGraphContext: string
): string {
  return `
TASK: Systemic Impact Analysis

PROPOSED MUTATION:
\`\`\`diff
${proposedChangeDiff}
\`\`\`

PROJECT DEPENDENCY TOPOLOGY:
${dependencyGraphContext}

INSTRUCTIONS:
You are preparing a zero-downtime integration deployment. Analyze the impact of the proposed diff against the known dependency topology.
List out structurally:
1. Modules directly affected requiring recompilation.
2. Downstream components that might break (e.g., prop type interface changes, database query schema mismatches).
3. Data persistence risks (e.g., does this change require a database migration? Will it orphan existing rows?).
4. Provide a boolean GO/NO-GO assessment at the end based on algorithmic confidence. 

Output format: Return structured JSON only.
{
  "directImpact": string[],
  "downstreamRisks": string[],
  "dataPersistenceRisks": string[],
  "go": boolean,
  "reasoning": string 
}
`;
}
