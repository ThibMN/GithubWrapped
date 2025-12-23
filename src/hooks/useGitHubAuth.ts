import { useState, useCallback } from 'react';
import { getUser } from '../services/githubApi';
import { getGitHubOAuthUrl } from '../services/authService';
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

  const handleOAuthCallback = useCallback(async (_code: string, _state: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Dans une vraie application, vous feriez un appel à votre backend
      // pour échanger le code contre un token. Pour GitHub Pages, on peut
      // utiliser un service proxy ou demander à l'utilisateur de créer un token personnel.
      // Pour l'instant, on simule la récupération du token.
      
      // Note: GitHub OAuth nécessite un backend pour échanger le code contre un token
      // car le client_secret ne doit pas être exposé. Pour GitHub Pages, on peut:
      // 1. Utiliser un service proxy (comme Vercel serverless function)
      // 2. Demander à l'utilisateur de créer un Personal Access Token
      
      throw new Error('OAuth callback nécessite un backend. Utilisez un Personal Access Token ou configurez un proxy.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion OAuth';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    loginWithOAuth,
    loginWithUsername,
    handleOAuthCallback,
    isLoading,
    error,
  };
};

