# 🔧 Dépannage OAuth

## Erreur : "OAuth token exchange failed: Failed to fetch"

Cette erreur signifie que le frontend ne peut pas contacter le backend Vercel. Voici comment résoudre le problème :

### ✅ Checklist de vérification

#### 1. Vérifier que le backend Vercel est déployé

1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Vérifiez que votre projet est bien déployé
3. Ouvrez l'URL de déploiement (ex: `https://votre-app.vercel.app`)
4. Testez l'endpoint : `https://votre-app.vercel.app/api/oauth-callback` avec une requête POST
   - Vous devriez voir une erreur "Method not allowed" (normal pour GET)
   - Si vous voyez "404 Not Found", le backend n'est pas déployé

#### 2. Vérifier les secrets GitHub

Allez dans **GitHub > Votre repository > Settings > Secrets and variables > Actions**

Vérifiez que ces 3 secrets sont bien présents :

```
✅ VITE_GITHUB_CLIENT_ID
✅ VITE_GITHUB_REDIRECT_URI  
✅ VITE_VERCEL_API_URL  ← CRUCIAL !
```

**⚠️ IMPORTANT pour `VITE_VERCEL_API_URL`** :
- L'URL doit être **sans slash à la fin** : `https://votre-app.vercel.app` ✅
- **Pas** : `https://votre-app.vercel.app/` ❌
- C'est l'URL de votre déploiement Vercel (visible dans le dashboard Vercel)

#### 3. Vérifier les variables d'environnement Vercel

Allez dans **Vercel Dashboard > Votre projet > Settings > Environment Variables**

Vérifiez que ces 3 variables sont présentes :

```
✅ VITE_GITHUB_CLIENT_ID
✅ GITHUB_CLIENT_SECRET
✅ VITE_GITHUB_REDIRECT_URI
```

**⚠️ IMPORTANT** : 
- `GITHUB_CLIENT_SECRET` doit être présent (c'est le secret, jamais exposé côté frontend)
- Après avoir modifié les variables, **redeployez** le projet Vercel

#### 4. Redéployer après modifications

**Après avoir ajouté/modifié les secrets GitHub** :
1. Allez dans **Actions** sur GitHub
2. Relancez le workflow manuellement ou faites un commit vide :
   ```bash
   git commit --allow-empty -m "Trigger deployment"
   git push
   ```

**Après avoir modifié les variables Vercel** :
1. Allez dans **Deployments** sur Vercel
2. Cliquez sur **"..."** à côté du dernier déploiement
3. Sélectionnez **"Redeploy"**

#### 5. Vérifier la console du navigateur

Ouvrez les **Outils de développement** (F12) > **Console** et cherchez :

- `🔗 Appel du backend Vercel: https://...` - L'URL utilisée
- `❌ Erreur backend Vercel: ...` - Le message d'erreur détaillé

### 🔍 Diagnostic pas à pas

#### Test 1 : L'URL Vercel est-elle accessible ?

Ouvrez dans votre navigateur :
```
https://votre-app.vercel.app/api/oauth-callback
```

**Attendu** : Une erreur JSON `{"error":"Method not allowed"}` ou similaire
- ✅ Si vous voyez ça → Le backend est accessible
- ❌ Si vous voyez "404" ou une erreur réseau → Le backend n'est pas déployé

#### Test 2 : Les secrets sont-ils bien dans le build ?

1. Ouvrez votre site GitHub Pages
2. Ouvrez la console (F12)
3. Tapez : `import.meta.env.VITE_VERCEL_API_URL`
4. **Attendu** : L'URL de votre backend Vercel
   - ✅ Si vous voyez l'URL → Les secrets sont correctement configurés
   - ❌ Si vous voyez `undefined` → `VITE_VERCEL_API_URL` n'est pas dans les secrets GitHub

#### Test 3 : Les variables Vercel sont-elles correctes ?

Vérifiez les logs Vercel :
1. Allez dans **Vercel Dashboard > Votre projet > Functions > api/oauth-callback**
2. Cliquez sur un appel récent
3. Regardez les logs

**Erreurs possibles** :
- `Missing environment variables` → Ajoutez les variables dans Vercel
- `Invalid client_id` → Vérifiez `VITE_GITHUB_CLIENT_ID` sur Vercel
- `Invalid client_secret` → Vérifiez `GITHUB_CLIENT_SECRET` sur Vercel

### 🐛 Erreurs courantes et solutions

#### "Failed to fetch" ou "NetworkError"

**Cause** : Le frontend ne peut pas contacter le backend

**Solutions** :
1. Vérifiez que `VITE_VERCEL_API_URL` est bien dans les secrets GitHub
2. Vérifiez que l'URL est correcte (sans slash à la fin)
3. Vérifiez que le backend Vercel est déployé
4. Redéployez le frontend après avoir ajouté le secret

#### "Configuration manquante: VITE_VERCEL_API_URL n'est pas défini"

**Cause** : Le secret `VITE_VERCEL_API_URL` n'est pas dans GitHub Secrets

**Solution** :
1. Allez dans **GitHub > Settings > Secrets > Actions**
2. Ajoutez `VITE_VERCEL_API_URL` avec la valeur : `https://votre-app.vercel.app`
3. Redéployez le frontend

#### "HTTP 500: Internal Server Error"

**Cause** : Erreur côté backend Vercel

**Solutions** :
1. Vérifiez les logs Vercel (Functions > api/oauth-callback)
2. Vérifiez que toutes les variables d'environnement sont présentes sur Vercel
3. Vérifiez que `GITHUB_CLIENT_SECRET` est correct

#### "Invalid OAuth state"

**Cause** : Le paramètre `state` ne correspond pas (protection CSRF)

**Solution** : Réessayez la connexion OAuth (le state est régénéré à chaque tentative)

### 📝 Formulaire de vérification rapide

Cochez chaque point :

- [ ] Backend Vercel déployé et accessible
- [ ] `VITE_VERCEL_API_URL` présent dans les secrets GitHub
- [ ] `VITE_VERCEL_API_URL` sans slash à la fin
- [ ] `VITE_GITHUB_CLIENT_ID` présent dans les secrets GitHub
- [ ] `VITE_GITHUB_REDIRECT_URI` présent dans les secrets GitHub
- [ ] `VITE_GITHUB_CLIENT_ID` présent sur Vercel
- [ ] `GITHUB_CLIENT_SECRET` présent sur Vercel
- [ ] `VITE_GITHUB_REDIRECT_URI` présent sur Vercel
- [ ] Frontend redéployé après modification des secrets
- [ ] Backend Vercel redéployé après modification des variables

### 💡 Astuce

Si vous testez en local :
1. Créez un fichier `.env` :
   ```env
   VITE_GITHUB_CLIENT_ID=votre_client_id
   VITE_GITHUB_REDIRECT_URI=http://localhost:5173/GithubWrapped/auth/callback
   VITE_VERCEL_API_URL=https://votre-app.vercel.app
   ```
2. Lancez `npm run dev`
3. L'app utilisera ces variables pour tester localement

---

Si le problème persiste après avoir vérifié tous ces points, consultez les logs détaillés dans la console du navigateur et les logs Vercel pour identifier l'erreur précise.

