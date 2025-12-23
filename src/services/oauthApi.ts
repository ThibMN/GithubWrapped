/**
 * Service pour communiquer avec le backend Vercel pour l'OAuth
 */

// L'URL de l'API Vercel - à configurer dans les variables d'environnement
const getApiUrl = (): string => {
  // En production, utiliser l'URL Vercel configurée
  if (import.meta.env.VITE_VERCEL_API_URL && import.meta.env.VITE_VERCEL_API_URL !== 'https://votre-app.vercel.app') {
    return import.meta.env.VITE_VERCEL_API_URL;
  }
  
  // En développement, essayer localhost si Vercel dev est lancé
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  
  // Fallback : utiliser l'URL par défaut (à configurer)
  return import.meta.env.VITE_VERCEL_API_URL || 'https://votre-app.vercel.app';
};

/**
 * Échange le code OAuth contre un token d'accès via le backend Vercel
 */
export const exchangeCodeForToken = async (code: string, state: string): Promise<string> => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/api/oauth-callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to exchange code for token');
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('No access token received');
    }

    return data.access_token;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`OAuth token exchange failed: ${message}`);
  }
};

/**
 * Récupère les informations utilisateur depuis le backend
 */
export const getUserFromBackend = async (token: string): Promise<any> => {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/api/github-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to fetch user: ${message}`);
  }
};

