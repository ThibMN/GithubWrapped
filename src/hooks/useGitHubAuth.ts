import { useState, useCallback } from 'react';
import { getUser } from '../services/githubApi';
import { getGitHubOAuthUrl, storeAccessToken, validateOAuthCallback } from '../services/authService';
import { exchangeCodeForToken } from '../services/oauthApi';
import { useAuth } from '../context/AuthContext';

export const useGitHubAuth = () => {
  const { setUser, setUsername } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithOAuth = useCallback(() => {
    const oauthUrl = getGitHubOAuthUrl();
    window.location.href = oauthUrl;
  }, []);

  const loginWithUsername = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await getUser(username);
      setUser(user);
      setUsername(user.login);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setUsername]);

  const handleOAuthCallback = useCallback(async (code: string, state: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Valider le state OAuth pour prévenir les attaques CSRF
      if (!validateOAuthCallback(code, state)) {
        throw new Error('Invalid OAuth state. Please try again.');
      }

      // Échanger le code contre un token d'accès via le backend Vercel
      const accessToken = await exchangeCodeForToken(code, state);
      
      // Stocker le token
      storeAccessToken(accessToken);

      // Récupérer les informations utilisateur
      // Le token est maintenant stocké, getUser() l'utilisera automatiquement
      const user = await getUser(undefined);

      setUser(user);
      setUsername(user.login);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion OAuth';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setUsername]);

  return {
    loginWithOAuth,
    loginWithUsername,
    handleOAuthCallback,
    isLoading,
    error,
  };
};

