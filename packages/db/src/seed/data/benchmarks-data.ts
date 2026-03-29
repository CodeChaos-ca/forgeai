export const benchmarkData = [
  ...Array.from({ length: 20 }).map((_, i) => ({
    name: `Benchmark Test Case ${i + 1}: ${['React component', 'API Route', 'Postgres Schema', 'State Management'][i % 4]}`,
    category: ['frontend', 'backend', 'database', 'system_design'][i % 4],
    difficulty: ['easy', 'medium', 'hard', 'expert'][i % 4],
    inputPrompt: `Build a highly scalable and resilient ${['React list', 'Hono API', 'Drizzle schema', 'Zustand store', 'Websocket server'][i % 5]} using modern standards. Do not use legacy patterns.`,
    expectedFeatures: {
      typeSafety: true,
      errorHandling: true,
      performanceOptimizations: (i % 2 === 0),
    },
    rubric: {
      "no_legacy_code": 20,
      "type_strictness": 20,
      "edge_cases_handled": 30,
      "code_cleanliness": 10,
      "meets_requirements": 20
    },
    maxScore: 100,
    isActive: true,
  }))
];
