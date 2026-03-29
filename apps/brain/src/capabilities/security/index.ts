export * from './vulnerability-scanner';
export * from './secret-scanner';
export * from './rate-limit-analyzer';
export * from './jwt-rotator';
export * from './ip-blocker';
export * from './user-code-scanner';

import { VulnerabilityScanner } from './vulnerability-scanner';
import { SecretScanner } from './secret-scanner';
import { RateLimitAnalyzer } from './rate-limit-analyzer';
import { JWTRotator } from './jwt-rotator';
import { IPBlocker } from './ip-blocker';
import { UserCodeScanner } from './user-code-scanner';

export const vulnScanner = new VulnerabilityScanner();
export const secretScanner = new SecretScanner();
export const rateLimits = new RateLimitAnalyzer();
export const globalJWT = new JWTRotator();
export const firewall = new IPBlocker();
export const codeScanner = new UserCodeScanner();
