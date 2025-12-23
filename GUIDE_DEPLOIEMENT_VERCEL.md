# 🚀 Guide complet : Déployer GithubWrapped sur Vercel

Guide étape par étape pour déployer le backend OAuth sur Vercel et configurer toutes les variables d'environnement.

## 📋 Étape 1 : Préparer l'OAuth App GitHub

### 1.1 Créer l'OAuth App

1. Allez sur [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Cliquez sur **"New OAuth App"**
3. Remplissez le formulaire :

   **Application name** :
   ```
   GithubWrapped
   ```

   **Homepage URL** :
   ```
   https://votre-username.github.io/GithubWrapped
   ```
   *(Remplacez `votre-username` par votre nom d'utilisateur GitHub)*

   **Authorization callback URL** :
   ```
   https://votre-username.github.io/GithubWrapped/auth/callback
   ```
   *(Même URL que la homepage + `/auth/callback`)*

4. Cliquez sur **"Register application"**

### 1.2 Récupérer les identifiants

Après la création, vous verrez :

1. **Client ID** : Un long identifiant (ex: `Iv1.a1b2c3d4e5f6g7h8`)
   - **📋 COPIEZ-LE** - Vous en aurez besoin
   
2. **Client Secret** : Cliquez sur **"Generate a new client secret"**
   - **📋 COPIEZ-LE IMMÉDIATEMENT** - Vous ne pourrez plus le voir après !
   - Si vous le perdez, il faudra en créer un nouveau

**⚠️ IMPORTANT** : Gardez ces deux valeurs précieusement (dans un gestionnaire de mots de passe par exemple).

---

## 📦 Étape 2 : Préparer le repository

### 2.1 Vérifier que tout est commité

```bash
# Vérifier le statut
git status

# Si des fichiers ne sont pas commités, les ajouter
git add .

# Commit (si nécessaire)
git commit -m "Add Vercel backend for OAuth"
```

### 2.2 Pousser sur GitHub

```bash
git push origin main
```

*(Assurez-vous que votre code est bien sur GitHub avant de continuer)*

---

## 🚀 Étape 3 : Déployer sur Vercel

### 3.1 Créer un compte Vercel (si nécessaire)

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"** (recommandé)
4. Autorisez Vercel à accéder à vos repositories

### 3.2 Importer le projet

1. Une fois connecté, cliquez sur **"Add New..." > "Project"**
2. Vous verrez la liste de vos repositories GitHub
3. Trouvez **"GithubWrapped"** et cliquez sur **"Import"**

### 3.3 Configurer le projet

Sur la page de configuration :

1. **Framework Preset** : Vercel devrait détecter automatiquement ou vous pouvez laisser "Other"
2. **Root Directory** : Laisser par défaut (`.`)
3. **Build Command** : Laisser vide (Vercel n'a pas besoin de builder le backend)
4. **Output Directory** : Laisser vide
5. **Install Command** : Laisser `npm install` (par défaut)

### 3.4 Ajouter les variables d'environnement (CRUCIAL)

**NE CLIQUEZ PAS ENCORE SUR "DEPLOY" !**

Avant de déployer, ajoutez les variables d'environnement :

1. Dans la section **"Environment Variables"**, cliquez pour ajouter :

   **Variable 1** :
   - **Name** : `VITE_GITHUB_CLIENT_ID`
   - **Value** : Votre Client ID GitHub (copié à l'étape 1.2)
   - **Environments** : ✅ Production ✅ Preview ✅ Development (cocher les 3)

   **Variable 2** :
   - **Name** : `GITHUB_CLIENT_SECRET`
   - **Value** : Votre Client Secret GitHub (copié à l'étape 1.2)
   - **Environments** : ✅ Production ✅ Preview ✅ Development (cocher les 3)
   - **⚠️ C'EST LE SECRET - NE LE PARTAGEZ JAMAIS !**

   **Variable 3** :
   - **Name** : `VITE_GITHUB_REDIRECT_URI`
   - **Value** : `https://votre-username.github.io/GithubWrapped/auth/callback`
   - **Environments** : ✅ Production ✅ Preview ✅ Development (cocher les 3)
   - *(Remplacez `votre-username` par votre nom d'utilisateur)*

2. Cliquez sur **"Add"** pour chaque variable

### 3.5 Déployer

1. Vérifiez que toutes les variables sont bien ajoutées
2. Cliquez sur **"Deploy"**
3. Attendez 1-2 minutes que Vercel build et déploie

### 3.6 Récupérer l'URL de votre déploiement

Une fois le déploiement terminé :

1. Vercel affichera une URL comme : `https://githubwrapped-xxxxx.vercel.app`
2. **📋 COPIEZ CETTE URL** - C'est votre `VITE_VERCEL_API_URL`
3. Vous pouvez aussi la voir dans **Settings > Domains**

---

## 🔧 Étape 4 : Configurer le frontend (GitHub Secrets)

Maintenant, il faut configurer le frontend pour qu'il sache où se trouve votre backend Vercel.

### 4.1 Ajouter les secrets GitHub

1. Allez dans votre repository GitHub
2. **Settings > Secrets and variables > Actions**
3. Cliquez sur **"New repository secret"**

Ajoutez ces secrets :

**Secret 1** :
- **Name** : `VITE_GITHUB_CLIENT_ID`
- **Secret** : Votre Client ID GitHub (le même que dans Vercel)

**Secret 2** :
- **Name** : `VITE_GITHUB_REDIRECT_URI`
- **Secret** : `https://votre-username.github.io/GithubWrapped/auth/callback`

**Secret 3** :
- **Name** : `VITE_VERCEL_API_URL`
- **Secret** : L'URL de votre déploiement Vercel (ex: `https://githubwrapped-xxxxx.vercel.app`)
- **⚠️ IMPORTANT** : Pas de slash (`/`) à la fin de l'URL !

### 4.2 Redéployer le frontend

1. Faites un commit vide pour déclencher le déploiement :
   ```bash
   git commit --allow-empty -m "Trigger deployment with Vercel API URL"
   git push
   ```

2. Ou allez dans **Actions** sur GitHub et relancez le workflow manuellement

---

## 🧪 Étape 5 : Tester

### 5.1 Tester le backend Vercel

1. Ouvrez votre navigateur
2. Allez sur votre déploiement Vercel : `https://votre-app.vercel.app/api/oauth-callback`
3. Vous devriez voir une erreur "Method not allowed" (normal - c'est une route POST)
   - Si vous voyez cette erreur, c'est que la fonction est bien déployée ✅

### 5.2 Tester le flux OAuth complet

1. Allez sur votre site GitHub Pages : `https://votre-username.github.io/GithubWrapped`
2. Cliquez sur **"Se connecter avec GitHub"**
3. Autorisez l'application sur GitHub
4. Vous devriez être redirigé et connecté automatiquement ✅

---

## 🐛 Dépannage

### Problème : Erreur 500 sur `/api/oauth-callback`

**Cause** : Variables d'environnement manquantes ou incorrectes sur Vercel

**Solution** :
1. Allez dans **Vercel Dashboard > Votre projet > Settings > Environment Variables**
2. Vérifiez que les 3 variables sont bien présentes
3. Vérifiez que les valeurs sont correctes
4. **Redeployez** : **Deployments > ... > Redeploy**

### Problème : "Failed to exchange code for token"

**Cause** : L'URL Vercel n'est pas correctement configurée dans le frontend

**Solution** :
1. Vérifiez que `VITE_VERCEL_API_URL` est bien dans les secrets GitHub
2. Vérifiez que l'URL est correcte (sans `/` à la fin)
3. Redéployez le frontend

### Problème : Erreur CORS

**Cause** : Problème de configuration CORS (rare avec Vercel)

**Solution** : Vercel gère automatiquement les CORS. Si problème persiste, vérifiez que l'URL Vercel est bien HTTPS.

### Vérifier les logs Vercel

1. Allez dans **Vercel Dashboard > Votre projet > Functions**
2. Cliquez sur une fonction (ex: `api/oauth-callback`)
3. Regardez les logs pour voir les erreurs détaillées

---

## 📝 Récapitulatif des variables

### Sur Vercel (Dashboard > Environment Variables)

```
VITE_GITHUB_CLIENT_ID = votre_client_id
GITHUB_CLIENT_SECRET = votre_client_secret
VITE_GITHUB_REDIRECT_URI = https://votre-username.github.io/GithubWrapped/auth/callback
```

### Sur GitHub (Secrets > Actions)

```
VITE_GITHUB_CLIENT_ID = votre_client_id
VITE_GITHUB_REDIRECT_URI = https://votre-username.github.io/GithubWrapped/auth/callback
VITE_VERCEL_API_URL = https://votre-app.vercel.app
```

### Local (fichier `.env` - optionnel, pour dev local)

```env
VITE_GITHUB_CLIENT_ID=votre_client_id
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/GithubWrapped/auth/callback
VITE_VERCEL_API_URL=http://localhost:3000
```

*(Pour tester localement avec `vercel dev`)*

---

## ✅ Checklist de vérification

Avant de tester, vérifiez :

- [ ] OAuth App GitHub créée avec les bonnes URLs
- [ ] Client ID et Client Secret copiés
- [ ] Projet déployé sur Vercel
- [ ] 3 variables d'environnement ajoutées sur Vercel
- [ ] URL Vercel récupérée (ex: `https://xxx.vercel.app`)
- [ ] 3 secrets ajoutés sur GitHub (y compris `VITE_VERCEL_API_URL`)
- [ ] Frontend redéployé avec les nouveaux secrets
- [ ] Test du flux OAuth effectué

---

## 🎉 C'est fait !

Une fois tout configuré, votre application utilisera OAuth avec le backend Vercel sécurisé, et vous aurez accès à 5000 requêtes/heure au lieu de 60 !

**Note** : Si vous changez les variables d'environnement sur Vercel, n'oubliez pas de **redeployer** pour que les changements prennent effet.

