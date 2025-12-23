# Guide de configuration GitHub OAuth

Ce guide explique comment configurer et utiliser GitHub OAuth avec GithubWrapped.

## 🔐 Pourquoi utiliser OAuth ?

L'authentification OAuth offre plusieurs avantages :
- **Limite API augmentée** : 5000 requêtes/heure (vs 60 sans authentification)
- **Accès aux données privées** : Repos privés, contributions privées, etc.
- **Expérience utilisateur améliorée** : Pas de limite de taux pour la plupart des utilisateurs

## ⚠️ Limitation actuelle

**Important** : GitHub OAuth nécessite un **backend sécurisé** pour échanger le code d'autorisation contre un token d'accès, car le `client_secret` ne doit **jamais** être exposé côté client.

Le projet actuel ne contient que la partie frontend de l'OAuth. Vous avez deux options :

### Option 1 : Utiliser un Personal Access Token (Solution simple)

Pour un usage personnel ou de test, vous pouvez utiliser un Personal Access Token :

1. Allez sur [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Cliquez sur "Generate new token (classic)"
3. Sélectionnez les scopes : `repo`, `read:user`, `read:org`
4. Copiez le token généré
5. Dans l'application, au lieu d'utiliser OAuth, vous pouvez manuellement entrer ce token (nécessite une modification du code)

### Option 2 : Configurer un backend/serverless (Solution recommandée)

Pour une solution complète et sécurisée, configurez un backend pour gérer l'échange OAuth.

## 🛠️ Configuration GitHub OAuth App

### Étape 1 : Créer une OAuth App

1. Allez sur [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Cliquez sur **"New OAuth App"**
3. Remplissez le formulaire :
   - **Application name** : `GithubWrapped`
   - **Homepage URL** : 
     - En développement : `http://localhost:5173/GithubWrapped`
     - En production : `https://votre-username.github.io/GithubWrapped`
   - **Authorization callback URL** :
     - En développement : `http://localhost:5173/GithubWrapped/auth/callback`
     - En production : `https://votre-username.github.io/GithubWrapped/auth/callback`
4. Cliquez sur **"Register application"**
5. **Important** : Copiez le **Client ID** (vous en aurez besoin)
6. **Générez un Client Secret** et copiez-le (vous ne pourrez plus le voir ensuite !)

### Étape 2 : Configurer les variables d'environnement

#### Pour le développement local

Créez un fichier `.env` à la racine du projet :

```env
VITE_GITHUB_CLIENT_ID=votre_client_id_ici
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/GithubWrapped/auth/callback
```

#### Pour la production (GitHub Pages)

1. Allez dans votre repository GitHub
2. **Settings > Secrets and variables > Actions**
3. Ajoutez les secrets suivants :
   - `VITE_GITHUB_CLIENT_ID` : Votre Client ID
   - `VITE_GITHUB_REDIRECT_URI` : `https://votre-username.github.io/GithubWrapped/auth/callback`

## 🔧 Implémentation du backend (Option 2)

### Solution avec Vercel Serverless Function

Exemple de fonction serverless pour Vercel :

**`api/oauth-callback.ts`** :

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { code } = req.query;
  const clientId = process.env.VITE_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.VITE_GITHUB_REDIRECT_URI;

  if (!code || !clientId || !clientSecret || !redirectUri) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code as string,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description });
    }

    // Rediriger vers la page principale avec le token
    // Attention : En production, le token doit être stocké de manière sécurisée
    res.redirect(`${redirectUri}?token=${data.access_token}`);
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Variables d'environnement Vercel** :
- `VITE_GITHUB_CLIENT_ID` : Votre Client ID
- `GITHUB_CLIENT_SECRET` : Votre Client Secret (ne jamais exposer côté client !)
- `VITE_GITHUB_REDIRECT_URI` : URL de callback

### Solution avec Netlify Function

Créer **`netlify/functions/oauth-callback.ts`** :

```typescript
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const { code } = event.queryStringParameters || {};
  const clientId = process.env.VITE_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.VITE_GITHUB_REDIRECT_URI;

  if (!code || !clientId || !clientSecret || !redirectUri) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing parameters' }),
    };
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error_description }),
      };
    }

    return {
      statusCode: 302,
      headers: {
        Location: `${redirectUri}?token=${data.access_token}`,
      },
    };
  } catch (error) {
    console.error('OAuth error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
```

### Modifier le code frontend pour utiliser le backend

Mettre à jour `src/hooks/useGitHubAuth.ts` :

```typescript
const handleOAuthCallback = useCallback(async (code: string, state: string) => {
  setIsLoading(true);
  setError(null);

  try {
    // Valider le state
    if (!validateOAuthCallback(code, state)) {
      throw new Error('Invalid OAuth state');
    }

    // Appeler votre backend/serverless function
    const response = await fetch('https://votre-domaine.com/api/oauth-callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Stocker le token
    storeAccessToken(data.access_token);
    
    // Récupérer les infos utilisateur
    const user = await getUser(undefined, data.access_token);
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
```

## 📝 Modification de l'URL de callback

Dans `src/services/authService.ts`, l'URL de callback est automatiquement générée, mais vous pouvez la modifier pour pointer vers votre backend :

```typescript
const GITHUB_OAUTH_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || 
  'https://votre-backend.com/oauth/callback';
```

Puis dans votre OAuth App GitHub, configurez la même URL dans "Authorization callback URL".

## 🔒 Sécurité

⚠️ **Important** :
- Ne jamais exposer le `client_secret` dans le code frontend
- Utiliser HTTPS en production
- Valider le `state` pour prévenir les attaques CSRF
- Stocker les tokens de manière sécurisée (sessionStorage pour ce projet, mais en production, considérer des cookies httpOnly)

## 🚀 Test

1. Cliquez sur "Se connecter avec GitHub" dans l'application
2. Autorisez l'application sur GitHub
3. Vous serez redirigé vers la callback avec le code
4. Le backend échangera le code contre un token
5. L'application utilisera le token pour les requêtes API

## 📚 Ressources

- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

