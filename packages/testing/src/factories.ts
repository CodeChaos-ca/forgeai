import { faker } from '@faker-js/faker';

// Factory pattern for generating strictly-typed simulated data objects mappings to ForgeAI

export function buildUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    passwordHash: faker.string.alphanumeric(60),
    role: 'user',
    plan: 'free',
    hasOnboarded: true,
    emailVerified: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function buildMemoryEpisode(overrides = {}) {
  return {
    id: faker.string.uuid(),
    projectId: faker.string.uuid(),
    episodeType: 'success',
    triggerEvent: faker.hacker.phrase(),
    contextState: { localCache: true },
    actionTaken: 'Executed file replacement operation.',
    resolution: 'Successfully bypassed error condition.',
    embedding: new Array(1536).fill(0).map(() => faker.number.float({ min: -1, max: 1 })),
    qualityScore: faker.number.int({ min: 10, max: 100 }),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function buildProjectFile(overrides = {}) {
  return {
    id: faker.string.uuid(),
    projectId: faker.string.uuid(),
    filePath: `src/components/${faker.system.fileName()}.tsx`,
    fileName: faker.system.fileName(),
    fileExtension: 'tsx',
    content: 'export default function Component() { return null; }',
    contentHash: faker.git.commitSha(),
    sizeBytes: faker.number.int({ min: 100, max: 5000 }),
    language: 'typescript',
    isGenerated: true,
    versionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
