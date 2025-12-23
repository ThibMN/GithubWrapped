# GithubWrapped 🎵

Un récapitulatif de votre année sur GitHub, inspiré de Spotify Wrapped. Découvrez vos statistiques de développement de manière élégante et visuelle.

![GithubWrapped](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646cff?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fonctionnalités

### 🎨 Interface moderne
- **Design sobre** inspiré de Spotify Wrapped avec une palette de couleurs élégante
- **Animations fluides** avec Framer Motion
- **Décorations de fond animées** avec effets de parallaxe au survol
- **Design responsive** optimisé pour mobile, tablette et desktop
- **Affichage progressif** des statistiques, étape par étape, pour une expérience immersive

### 📊 Statistiques détaillées

#### Statistiques annuelles
- **Total de commits** sur l'année
- **Lignes de code ajoutées et supprimées** (avec graphique d'évolution mensuelle)
- **Jours actifs** avec pourcentage d'activité
- **Langages de programmation** utilisés avec icônes et pourcentages (diagramme circulaire)
- **Repos les plus actifs** classés par nombre de commits
- **Pull Requests** (total et mergées)
- **Issues** (total et fermées)
- **Mois le plus actif** de l'année

#### Statistiques mensuelles
- Toutes les statistiques ci-dessus, filtrées pour un mois spécifique
- Graphiques d'évolution adaptés au mois

### 🚀 Expérience utilisateur

- **Affichage progressif** : Les statistiques s'affichent progressivement, comme dans Spotify Wrapped, avec un délai de 10 secondes entre chaque slide
- **Terminal de progression** : Un mini-terminal affiche les logs de récupération des données en temps réel
  - Visible sur desktop (coin inférieur droit)
  - Visible sur mobile uniquement pendant le chargement (dans la zone de contenu)
- **Navigation intuitive** : Boutons "Précédent" / "Suivant" pour naviguer entre les slides, avec indicateur de progression
- **Chargement en arrière-plan** : Les statistiques de base s'affichent immédiatement, tandis que les données complémentaires continuent de charger

### 🔐 Authentification

Deux modes d'authentification sont disponibles :

1. **Nom d'utilisateur GitHub**
   - Accès aux données publiques uniquement
   - Aucune configuration requise
   - Limite API : 60 requêtes/heure

2. **OAuth GitHub** (recommandé)
   - Accès à toutes vos données (privées incluses)
   - Limite API augmentée : 5000 requêtes/heure
   - Nécessite la configuration OAuth (voir ci-dessous)

### ⚡ Optimisations

- **Gestion du rate limiting** : Affichage d'avertissements clairs lorsque la limite API est atteinte
- **Gestion d'erreurs robuste** : Error boundaries et messages d'erreur informatifs
- **Performance** : Chargement progressif des données pour une expérience fluide
- **Responsive design** : Interface adaptée à tous les écrans avec optimisations spécifiques mobile

## 🛠️ Technologies

- **React 18** + **TypeScript** - Framework et typage
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Animations et transitions
- **Recharts** - Bibliothèque de graphiques React
- **React Router** - Routage
- **date-fns** - Manipulation de dates
- **GitHub REST API** - Récupération des données
- **GitHub Actions** - Déploiement automatique

## 📦 Installation

### Prérequis

- **Node.js** 20+ 
- **npm** ou **yarn**

### Setup local

1. **Cloner le repository** :
```bash
git clone https://github.com/votre-username/GithubWrapped.git
cd GithubWrapped
```

2. **Installer les dépendances** :
```bash
npm install
```

3. **Configurer les variables d'environnement** :
   
   Créer un fichier `.env` à la racine du projet :
```env
VITE_GITHUB_CLIENT_ID=votre_client_id_github
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/GithubWrapped/auth/callback
```

4. **Lancer le serveur de développement** :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173/GithubWrapped`

## 🔐 Configuration OAuth GitHub

Le projet inclut un **backend Vercel** prêt à être déployé pour gérer l'authentification OAuth de manière sécurisée.

### 📚 Guides de déploiement

- **🚀 [GUIDE_DEPLOIEMENT_VERCEL.md](GUIDE_DEPLOIEMENT_VERCEL.md)** - Guide complet étape par étape (RECOMMANDÉ)
- **⚡ [QUICK_START_OAUTH.md](QUICK_START_OAUTH.md)** - Guide rapide en 5 minutes

### 🔑 Résumé rapide

1. **Créer une OAuth App GitHub** (voir guide détaillé)
2. **Déployer sur Vercel** : Le dossier `api/` contient les fonctions serverless
3. **Configurer les variables d'environnement** sur Vercel et GitHub Secrets
4. **C'est tout !** Le flux OAuth fonctionnera automatiquement

### 📋 Variables nécessaires

**Sur Vercel** :
- `VITE_GITHUB_CLIENT_ID` : Votre Client ID GitHub
- `GITHUB_CLIENT_SECRET` : Votre Client Secret (secret, jamais exposé)
- `VITE_GITHUB_REDIRECT_URI` : URL de callback

**Sur GitHub Secrets** :
- `VITE_GITHUB_CLIENT_ID` : Votre Client ID
- `VITE_GITHUB_REDIRECT_URI` : URL de callback
- `VITE_VERCEL_API_URL` : URL de votre déploiement Vercel

## 🚢 Déploiement sur GitHub Pages

Le projet est configuré pour se déployer automatiquement via GitHub Actions.

### Configuration initiale

1. **Activer GitHub Pages** :
   - Aller dans les **Settings** du repository
   - Section **Pages** dans le menu de gauche
   - Sous **Source**, sélectionner **GitHub Actions**

2. **Configurer les secrets GitHub** :
   
   Aller dans **Settings > Secrets and variables > Actions** et ajouter :
   
   - `VITE_GITHUB_CLIENT_ID` : Votre Client ID GitHub OAuth
   - `VITE_GITHUB_REDIRECT_URI` : L'URL de callback de production
     - Exemple : `https://votre-username.github.io/GithubWrapped/auth/callback`

### Déploiement automatique

À chaque push sur la branche `main`, le workflow GitHub Actions :

1. ✅ Installe les dépendances
2. ✅ Lance le build TypeScript
3. ✅ Build le projet avec Vite
4. ✅ Déploie automatiquement sur GitHub Pages

L'application sera accessible à : `https://votre-username.github.io/GithubWrapped`

### Workflow GitHub Actions

Le workflow est situé dans `.github/workflows/deploy.yml` et utilise :
- Node.js 20
- Actions/checkout
- Actions/setup-node
- Actions/deploy-pages

## 📝 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le serveur de développement Vite |
| `npm run build` | Build le projet pour la production |
| `npm run preview` | Prévisualise le build de production localement |
| `npm run lint` | Lance le linter ESLint |

## 🎨 Structure du projet

```
GithubWrapped/
├── src/
│   ├── components/           # Composants React
│   │   ├── Auth/            # Authentification (AuthSelector, OAuthButton)
│   │   ├── Layout/          # Layout (Footer, BackgroundDecoration, ErrorBoundary, etc.)
│   │   ├── Loading/         # Composants de chargement (Spinner)
│   │   ├── Stats/           # Statistiques et graphiques
│   │   │   ├── YearlyStats.tsx
│   │   │   ├── MonthlyStats.tsx
│   │   │   ├── StatsDisplay.tsx
│   │   │   ├── ProgressiveStatsDisplay.tsx  # Affichage progressif
│   │   │   ├── StatsSlide.tsx
│   │   │   ├── CodeLinesChart.tsx
│   │   │   ├── LanguagesChart.tsx
│   │   │   └── ContributionsHeatmap.tsx
│   │   └── Terminal/        # Terminal (MiniTerminal, Terminal, etc.)
│   ├── context/             # Contextes React (AuthContext, StatsContext)
│   ├── hooks/               # Hooks personnalisés
│   │   ├── useGitHubAuth.ts
│   │   └── useGitHubStats.ts
│   ├── services/            # Services API GitHub
│   │   ├── githubApi.ts     # REST API
│   │   ├── githubGraphQL.ts # GraphQL API (à venir)
│   │   └── authService.ts   # Service d'authentification
│   ├── types/               # Types TypeScript
│   │   └── github.ts
│   ├── utils/               # Utilitaires
│   │   ├── dateUtils.ts
│   │   ├── statsCalculations.ts
│   │   ├── languageColors.ts
│   │   ├── rateLimitHandler.ts
│   │   └── terminalCommands.ts
│   ├── styles/              # Styles globaux
│   │   └── globals.css
│   ├── App.tsx              # Composant principal
│   └── main.tsx             # Point d'entrée
├── public/                  # Fichiers statiques
│   └── favicon.svg
├── .github/
│   └── workflows/           # GitHub Actions
│       └── deploy.yml
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎯 Fonctionnalités détaillées

### Affichage progressif des statistiques

L'application affiche les statistiques de manière progressive, étape par étape :

1. **Commits** - Nombre total de commits
2. **Lignes ajoutées** - Total de lignes de code ajoutées
3. **Lignes supprimées** - Total de lignes de code supprimées
4. **Jours actifs** - Nombre de jours avec activité
5. **Langages** - Répartition des langages avec diagramme circulaire
6. **Repos** - Top 5 des repos les plus actifs
7. **Graphiques** - Évolution mensuelle des lignes de code
8. **Pull Requests & Issues** - Statistiques de contributions
9. **Vue complète** - Récapitulatif complet de l'année

Chaque slide s'affiche automatiquement après 10 secondes, ou peut être naviguée manuellement avec les boutons "Précédent" / "Suivant".

### Terminal de progression

Un mini-terminal affiche les logs en temps réel :

- **Sur desktop** : Terminal fixe en bas à droite de l'écran
- **Sur mobile** : Terminal affiché uniquement pendant le chargement, dans la zone de contenu

Le terminal affiche :
- Chaque requête API effectuée
- La progression (ex: "Récupération des repos (5/10)")
- Les messages de succès/erreur
- L'état de traitement

### Graphiques et visualisations

- **Graphique des lignes de code** : Courbe d'évolution mensuelle avec séparation des lignes ajoutées/supprimées
- **Diagramme des langages** : Diagramme circulaire avec icônes des langages et couleurs officielles
- **Légendes interactives** : Tooltips au survol avec détails

### Gestion du rate limiting

L'application détecte automatiquement les limites de l'API GitHub et affiche :
- Un avertissement clair lorsque la limite est atteinte
- Des suggestions pour utiliser OAuth (5000 req/h vs 60 req/h)
- Des messages d'erreur informatifs

## ⚠️ Limitations

- **Rate Limiting GitHub API** : 
  - 60 requêtes/heure sans authentification
  - 5000 requêtes/heure avec OAuth (recommandé)
- **OAuth sans backend** : L'échange code/token nécessite un backend sécurisé
- **Données publiques uniquement** : Sans OAuth, seules les données publiques sont accessibles
- **Performance** : Pour les comptes avec beaucoup de repos, le chargement peut prendre du temps

## 🎨 Personnalisation

### Couleurs

Les couleurs peuvent être modifiées dans `tailwind.config.js` :

```javascript
colors: {
  'wrapped-bg': '#f5f5f0',      // Fond principal
  'wrapped-text': '#1a1a1a',    // Texte principal
  'wrapped-muted': '#6b6b6b',   // Texte secondaire
  'wrapped-accent': '#1db954',  // Couleur d'accent (vert Spotify)
}
```

### Délais d'affichage

Le délai entre les slides peut être modifié dans `src/components/Stats/ProgressiveStatsDisplay.tsx` (actuellement 10000ms).

## 🤝 Contributions

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Push sur la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- Inspiré par [Spotify Wrapped](https://www.spotify.com/wrapped/)
- Icônes de langages via [Devicons](https://devicon.dev/)
- API GitHub pour les données

## 👤 Auteur

**Thibaud Mineau**

- GitHub: [@ThibMN](https://github.com/ThibMN)

---

Créé avec ❤️ pour les développeurs
