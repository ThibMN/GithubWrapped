const GITHUB_OAUTH_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
const GITHUB_OAUTH_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || 
  `${window.location.origin}${window.location.pathname}auth/callback`;

export const getGitHubOAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: GITHUB_OAUTH_CLIENT_ID,
    redirect_uri: GITHUB_OAUTH_REDIRECT_URI,
    scope: 'repo read:user read:org',
    state: generateState(),
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

const generateState = (): string => {
  const state = Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('oauth_state', state);
  return state;
};

export const validateOAuthCallback = (_code: string, state: string): boolean => {
  const storedState = sessionStorage.getItem('oauth_state');
  if (storedState !== state) {
    return false;
  }
  sessionStorage.removeItem('oauth_state');
  return true;
};

export const storeAccessToken = (token: string): void => {
  sessionStorage.setItem('github_token', token);
};

export const getAccessToken = (): string | null => {
  return sessionStorage.getItem('github_token');
};

export const clearAccessToken = (): void => {
  sessionStorage.removeItem('github_token');
};

export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};

