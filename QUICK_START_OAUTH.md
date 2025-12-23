# 🚀 Guide rapide : Déployer OAuth sur Vercel

Guide rapide pour déployer le backend OAuth sur Vercel en 5 minutes.

## 📋 Prérequis

- Compte GitHub (pour OAuth App)
- Compte Vercel (gratuit) : [vercel.com](https://vercel.com)

## ⚡ Déploiement rapide

### 1. Créer l'OAuth App GitHub

1. Allez sur [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Cliquez sur **"New OAuth App"**
3. Remplissez :
   - **Application name** : `GithubWrapped`
   - **Homepage URL** : `https://votre-username.github.io/GithubWrapped`
   - **Authorization callback URL** : `https://votre-username.github.io/GithubWrapped/auth/callback`
4. **Copiez le Client ID** et **générez/copiez le Client Secret**

### 2. Déployer sur Vercel

#### Option A : Via GitHub (Recommandé)

1. **Push votre code** sur GitHub (si pas déjà fait)
2. Allez sur [vercel.com/new](https://vercel.com/new)
3. **Importez votre repository** `GithubWrapped`
4. Vercel détectera automatiquement le projet et les fonctions dans `api/`
5. Cliquez sur **"Deploy"**

#### Option B : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### 3. Configurer les variables d'environnement Vercel

Dans le **dashboard Vercel** de votre projet :

1. Allez dans **Settings > Environment Variables**
2. Ajoutez les variables suivantes :

```
VITE_GITHUB_CLIENT_ID = votre_client_id_github
GITHUB_CLIENT_SECRET = votre_client_secret_github
VITE_GITHUB_REDIRECT_URI = https://votre-username.github.io/GithubWrapped/auth/callback
```

3. **Redeployez** : **Deployments > ... > Redeploy**

### 4. Configurer le frontend

#### Variables d'environnement locales (`.env`)

```env
VITE_GITHUB_CLIENT_ID=votre_client_id_github
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/GithubWrapped/auth/callback
VITE_VERCEL_API_URL=http://localhost:3000
```

#### Variables d'environnement production (GitHub Secrets)

Dans **GitHub > Settings > Secrets and variables > Actions**, ajoutez :

```
VITE_GITHUB_CLIENT_ID = votre_client_id_github
VITE_GITHUB_REDIRECT_URI = https://votre-username.github.io/GithubWrapped/auth/callback
VITE_VERCEL_API_URL = https://votre-projet-vercel.vercel.app
```

**Important** : Remplacez `votre-projet-vercel.vercel.app` par l'URL réelle de votre déploiement Vercel (visible dans le dashboard Vercel).

### 5. Tester

1. Ouvrez votre application déployée
2. Cliquez sur **"Se connecter avec GitHub"**
3. Autorisez l'application
4. Vous devriez être redirigé et connecté automatiquement !

## 🔧 Structure créée

```
api/
├── oauth-callback.ts    # Échange code → token
└── github-user.ts       # Récupère infos utilisateur (optionnel)

vercel.json              # Configuration Vercel

src/services/
└── oauthApi.ts          # Service frontend pour appeler l'API Vercel
```

## 🐛 Dépannage

**Erreur 500 sur `/api/oauth-callback`** :
- Vérifiez que `GITHUB_CLIENT_SECRET` est bien configuré sur Vercel
- Vérifiez les logs dans Vercel Dashboard > Functions

**Token non reçu** :
- Vérifiez que `VITE_VERCEL_API_URL` est correctement configuré
- Vérifiez la console navigateur pour les erreurs CORS

**CORS errors** :
- Vercel gère automatiquement les CORS pour les fonctions serverless
- Si problème persiste, vérifiez que l'URL Vercel est correcte

## 📚 Documentation complète

Pour plus de détails, consultez [`DEPLOY_VERCEL.md`](DEPLOY_VERCEL.md).

