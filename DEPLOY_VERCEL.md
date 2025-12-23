# Guide de déploiement sur Vercel

Ce guide explique comment déployer le backend OAuth sur Vercel et connecter votre application frontend.

## 🚀 Déploiement du backend Vercel

### Étape 1 : Préparer le projet

1. **Installer les dépendances Vercel** (optionnel, pour tester localement) :
```bash
npm install -D @vercel/node
```

2. **Vérifier que les fichiers API sont créés** :
   - `api/oauth-callback.ts` - Gère l'échange code → token
   - `api/github-user.ts` - Récupère les infos utilisateur
   - `vercel.json` - Configuration Vercel

### Étape 2 : Déployer sur Vercel

#### Option A : Via l'interface Vercel (Recommandé)

1. **Créer un compte Vercel** : [vercel.com](https://vercel.com)
2. **Installer Vercel CLI** (optionnel) :
```bash
npm i -g vercel
```

3. **Connecter votre repository GitHub à Vercel** :
   - Allez sur [vercel.com/new](https://vercel.com/new)
   - Importez votre repository `GithubWrapped`
   - Vercel détectera automatiquement les fonctions dans `api/`

#### Option B : Via CLI

```bash
# Se connecter à Vercel
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

### Étape 3 : Configurer les variables d'environnement sur Vercel

1. **Dans le dashboard Vercel** :
   - Allez sur votre projet
   - **Settings > Environment Variables**

2. **Ajouter les variables suivantes** :
   ```
   VITE_GITHUB_CLIENT_ID=votre_client_id_github
   GITHUB_CLIENT_SECRET=votre_client_secret_github  (IMPORTANT: jamais exposé côté client)
   VITE_GITHUB_REDIRECT_URI=https://votre-username.github.io/GithubWrapped/auth/callback
   ```

3. **Redeployer** pour que les variables soient prises en compte :
   - Dans le dashboard Vercel : **Deployments > ... > Redeploy**

### Étape 4 : Configurer le frontend

1. **Mettre à jour les variables d'environnement du frontend** :
   
   **Local (`.env`)** :
   ```env
   VITE_GITHUB_CLIENT_ID=votre_client_id_github
   VITE_GITHUB_REDIRECT_URI=http://localhost:5173/GithubWrapped/auth/callback
   VITE_VERCEL_API_URL=http://localhost:3000  # Pour tester localement avec Vercel Dev
   ```

   **Production (GitHub Secrets)** :
   - `VITE_GITHUB_CLIENT_ID` : Votre Client ID
   - `VITE_GITHUB_REDIRECT_URI` : `https://votre-username.github.io/GithubWrapped/auth/callback`
   - `VITE_VERCEL_API_URL` : `https://votre-app.vercel.app` (l'URL de votre déploiement Vercel)

2. **Mettre à jour l'OAuth App GitHub** :
   - Assurez-vous que l'**Authorization callback URL** pointe vers votre frontend (GitHub Pages)
   - Pas vers Vercel ! Le callback va d'abord au frontend, qui appelle ensuite l'API Vercel

## 🔄 Flux OAuth complet

1. **Utilisateur clique sur "Se connecter avec GitHub"**
   - Frontend redirige vers `github.com/login/oauth/authorize`

2. **GitHub redirige vers** : `https://votre-username.github.io/GithubWrapped/auth/callback?code=XXX&state=YYY`

3. **Le composant `AuthCallback`** :
   - Récupère `code` et `state`
   - Appelle `/api/oauth-callback` sur Vercel avec le code
   - Vercel échange le code contre un token (avec le client_secret)
   - Vercel retourne le token au frontend

4. **Frontend stocke le token** dans `sessionStorage`

5. **Les requêtes API suivantes** utilisent le token pour authentifier les requêtes GitHub

## 🧪 Tester localement

### Avec Vercel Dev

1. **Installer Vercel CLI** :
```bash
npm i -g vercel
```

2. **Lancer Vercel en mode dev** :
```bash
vercel dev
```

3. **Configurer `.env.local`** (créé automatiquement par Vercel) :
```env
VITE_GITHUB_CLIENT_ID=votre_client_id
GITHUB_CLIENT_SECRET=votre_client_secret
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/GithubWrapped/auth/callback
```

4. **Lancer le frontend** :
```bash
npm run dev
```

5. **Tester le flux OAuth** :
   - Les fonctions API seront disponibles sur `http://localhost:3000/api/*`
   - Le frontend devra pointer vers `http://localhost:3000` dans `VITE_VERCEL_API_URL`

## 📝 Notes importantes

### Sécurité

- ✅ Le `GITHUB_CLIENT_SECRET` est uniquement stocké sur Vercel (jamais exposé)
- ✅ Les tokens sont stockés dans `sessionStorage` (expire à la fermeture du navigateur)
- ✅ Le `state` est validé pour prévenir les attaques CSRF
- ⚠️ En production, considérer des cookies httpOnly pour plus de sécurité

### URLs importantes

- **Frontend** : `https://votre-username.github.io/GithubWrapped`
- **Backend Vercel** : `https://votre-app.vercel.app`
- **OAuth Callback** : Pointe vers le frontend (pas Vercel)
- **OAuth Redirect URI** : `https://votre-username.github.io/GithubWrapped/auth/callback`

### Dépannage

1. **Erreur 500 sur `/api/oauth-callback`** :
   - Vérifier que `GITHUB_CLIENT_SECRET` est configuré sur Vercel
   - Vérifier les logs Vercel dans le dashboard

2. **Token non reçu** :
   - Vérifier que `VITE_VERCEL_API_URL` est correctement configuré
   - Vérifier la console navigateur pour les erreurs CORS

3. **CORS errors** :
   - Vercel gère automatiquement les CORS pour les fonctions serverless
   - Si problème, ajouter les headers dans `vercel.json`

## 🔗 Ressources

- [Vercel Functions Documentation](https://vercel.com/docs/functions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)

