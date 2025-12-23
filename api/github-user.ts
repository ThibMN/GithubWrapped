import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function pour récupérer les informations utilisateur GitHub
 * 
 * Cette fonction permet de récupérer les infos utilisateur de manière sécurisée
 * en passant le token via le backend plutôt que directement depuis le frontend
 * 
 * Endpoint: /api/github-user
 * Method: GET
 * Headers: { Authorization: 'Bearer <token>' }
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Seulement accepter les requêtes GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Récupérer le token depuis le header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Récupérer les informations utilisateur depuis GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userResponse.ok) {
      if (userResponse.status === 401) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    return res.status(200).json(userData);
  } catch (error) {
    console.error('GitHub user fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ 
      error: 'Failed to fetch user information',
      message: errorMessage,
    });
  }
}

