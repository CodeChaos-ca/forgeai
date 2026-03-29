import { MicrosoftEntraId, generateState, generateCodeVerifier } from 'arctic';

const MS_TENANT = process.env.MS_TENANT || 'common';
const MS_CLIENT_ID = process.env.MS_CLIENT_ID || '';
const MS_CLIENT_SECRET = process.env.MS_CLIENT_SECRET || '';
const MS_REDIRECT_URI = process.env.MS_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/microsoft';

export const microsoftProvider = new MicrosoftEntraId(
  MS_TENANT,
  MS_CLIENT_ID,
  MS_CLIENT_SECRET,
  MS_REDIRECT_URI
);

export async function generateMicrosoftAuthUrl() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  
  const url = await microsoftProvider.createAuthorizationURL(state, codeVerifier, {
    scopes: ['openid', 'profile', 'email', 'User.Read']
  });
  
  return { url: url.toString(), state, codeVerifier };
}

export async function handleMicrosoftCallback(code: string, codeVerifier: string) {
  const tokens = await microsoftProvider.validateAuthorizationCode(code, codeVerifier);
  return tokens;
}

export async function getMicrosoftUserProfile(accessToken: string) {
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!response.ok) throw new Error('Failed to fetch Microsoft profile');
  
  const user = await response.json();
  
  return {
    id: user.id,
    name: user.displayName,
    email: user.userPrincipalName || user.mail,
    picture: null, // Additional endpoint hit required for MS graph picture, typically handled dynamically
    emailVerified: true // Assumed verified if MS returned it from Entra ID
  };
}
