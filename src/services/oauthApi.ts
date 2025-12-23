/**
 * Service pour communiquer avec le backend Vercel pour l'OAuth
 */

// L'URL de l'API Vercel - à configurer dans les variables d'environnement
const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_VERCEL_API_URL;
  
  // En développement, essayer localhost si Vercel dev est lancé
  if (import.meta.env.DEV) {
    return apiUrl || 'http://localhost:3000';
  }
  
  // En production, l'URL Vercel est obligatoire
  if (!apiUrl || apiUrl === 'https://votre-app.vercel.app') {
    console.error('❌ VITE_VERCEL_API_URL non configuré !');
    console.error('💡 Ajoutez VITE_VERCEL_API_URL dans les secrets GitHub (Settings > Secrets > Actions)');
    throw new Error('Configuration manquante: VITE_VERCEL_API_URL n\'est pas défini. Veuillez configurer votre URL Vercel dans les secrets GitHub.');
  }
  
  // S'assurer que l'URL ne se termine pas par un slash
  return apiUrl.replace(/\/$/, '');
};

/**
 * Échange le code OAuth contre un token d'accès via le backend Vercel
 */
export const exchangeCodeForToken = async (code: string, state: string): Promise<string> => {
  try {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/api/oauth-callback`;
    
    console.log('🔗 Appel du backend Vercel:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error('❌ Erreur backend Vercel:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('No access token received from backend');
    }

    console.log('✅ Token reçu avec succès');
    return data.access_token;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Configuration manquante')) {
      throw error; // Re-lancer l'erreur de configuration telle quelle
    }
    
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    // Détecter les erreurs de réseau
    if (message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('CORS')) {
      const apiUrl = import.meta.env.VITE_VERCEL_API_URL || 'non configuré';
      throw new Error(
        `Impossible de contacter le backend Vercel.\n` +
        `URL configurée: ${apiUrl}\n` +
        `Vérifiez que:\n` +
        `1. VITE_VERCEL_API_URL est bien configuré dans les secrets GitHub\n` +
        `2. Le backend Vercel est déployé et accessible\n` +
        `3. L'URL est correcte (sans slash à la fin)`
      );
    }
    
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

