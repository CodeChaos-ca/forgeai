export const ERROR_CODES = {
  UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401, defaultMessage: 'Not authenticated' },
  FORBIDDEN: { code: 'FORBIDDEN', status: 403, defaultMessage: 'Not authorized for this resource' },
  NOT_FOUND: { code: 'NOT_FOUND', status: 404, defaultMessage: 'Resource not found' },
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 400, defaultMessage: 'Invalid input data' },
  RATE_LIMIT_EXCEEDED: { code: 'RATE_LIMIT_EXCEEDED', status: 429, defaultMessage: 'Too many requests' },
  INTERNAL_SERVER_ERROR: { code: 'INTERNAL_SERVER_ERROR', status: 500, defaultMessage: 'An unexpected error occurred' },
  INSUFFICIENT_CREDITS: { code: 'INSUFFICIENT_CREDITS', status: 402, defaultMessage: 'Insufficient credits for this operation' },
  FREE_TIER_LIMIT_REACHED: { code: 'FREE_TIER_LIMIT_REACHED', status: 402, defaultMessage: 'Free tier limit reached' }
} as const;
