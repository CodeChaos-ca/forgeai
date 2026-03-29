import { Google, generateState, generateCodeVerifier } from 'arctic';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google';

export const googleProvider = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

export async function generateGoogleAuthUrl() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  
  const url = await googleProvider.createAuthorizationURL(state, codeVerifier, {
    scopes: ['profile', 'email']
  });
  
  return { url: url.toString(), state, codeVerifier };
}

export async function handleGoogleCallback(code: string, codeVerifier: string) {
  const tokens = await googleProvider.validateAuthorizationCode(code, codeVerifier);
  return tokens; // Contains { accessToken, idToken }
}

export async function getGoogleUserProfile(accessToken: string) {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch user profile');
  
  const user = await response.json();
  return {
    id: user.sub,
    name: user.name,
    email: user.email,
    picture: user.picture,
    emailVerified: user.email_verified
  };
}
