import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function pour gérer le callback OAuth GitHub
 * 
 * Cette fonction échange le code d'autorisation contre un token d'accès GitHub
 * 
 * Endpoint: /api/oauth-callback
 * Method: POST
 * Body: { code: string, state: string }
 */

// Headers CORS pour autoriser les requêtes depuis GitHub Pages
const setCorsHeaders = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://thibmn.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Définir les headers CORS pour toutes les réponses
  setCorsHeaders(res);

  // Gérer les requêtes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Seulement accepter les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state: _state } = req.body;

  // Vérifier les paramètres requis
  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  // Note: Le state est validé côté frontend pour la protection CSRF
  // On le reçoit ici mais la validation est déjà faite avant l'appel à cette fonction

  const clientId = process.env.VITE_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.VITE_GITHUB_REDIRECT_URI;

  // Vérifier les variables d'environnement
  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing environment variables:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRedirectUri: !!redirectUri,
    });
    return res.status(500).json({ 
      error: 'Server configuration error. Please contact the administrator.' 
    });
  }

  try {
    // Échanger le code contre un token d'accès
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    // Vérifier les erreurs de l'API GitHub
    if (tokenData.error) {
      console.error('GitHub OAuth error:', tokenData);
      return res.status(400).json({ 
        error: tokenData.error_description || tokenData.error,
        error_code: tokenData.error,
      });
    }

    // Vérifier que le token a été reçu
    if (!tokenData.access_token) {
      console.error('No access token in response:', tokenData);
      return res.status(500).json({ error: 'Failed to obtain access token' });
    }

    // Retourner le token avec les headers CORS déjà définis
    return res.status(200).json({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type || 'bearer',
      scope: tokenData.scope,
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ 
      error: 'Internal server error',
      message: errorMessage,
    });
  }
}
