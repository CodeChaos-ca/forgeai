import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'fallback-refresh-secret-for-dev-only';

export function generateAccessToken(userId: string, role: string = 'user'): string {
  return jwt.sign(
    { sub: userId, role },
    JWT_SECRET,
    { expiresIn: '15m', algorithm: 'HS256' }
  );
}

export function generateRefreshToken(userId: string, expiresIn: string = '30d'): string {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    REFRESH_SECRET,
    { expiresIn, algorithm: 'HS256' }
  );
}

export function verifyAccessToken(token: string): { userId: string, role: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!payload.sub) return null;
    return { userId: payload.sub, role: payload.role as string };
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
    if (payload.type !== 'refresh' || !payload.sub) return null;
    return payload.sub;
  } catch (error) {
    return null;
  }
}
