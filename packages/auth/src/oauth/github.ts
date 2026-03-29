import { GitHub, generateState } from 'arctic';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/github';

export const githubProvider = new GitHub(
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI
);

export async function generateGithubAuthUrl() {
  const state = generateState();
  
  const url = await githubProvider.createAuthorizationURL(state, {
    scopes: ['read:user', 'user:email']
  });
  
  return { url: url.toString(), state };
}

export async function handleGithubCallback(code: string) {
  const tokens = await githubProvider.validateAuthorizationCode(code);
  return tokens; // Contains { accessToken }
}

export async function getGithubUserProfile(accessToken: string) {
  const userResponse = await fetch('https://api.github.com/user', {
    headers: { 
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': '@forgeai/auth'
    }
  });
  
  if (!userResponse.ok) throw new Error('Failed to fetch standard profile');
  const user = await userResponse.json();

  // GitHub hides primary emails often, query the /emails endpoint explicitly
  const emailResponse = await fetch('https://api.github.com/user/emails', {
    headers: { 
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': '@forgeai/auth'
    }
  });
  
  const emails = emailResponse.ok ? await emailResponse.json() : [];
  const primaryEmail = emails.find((e: any) => e.primary) || emails[0] || null;

  return {
    id: String(user.id),
    name: user.name || user.login,
    email: primaryEmail ? primaryEmail.email : null,
    picture: user.avatar_url,
    emailVerified: primaryEmail ? primaryEmail.verified : false,
  };
}
