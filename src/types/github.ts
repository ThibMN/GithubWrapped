export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name?: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description?: string;
  language?: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  };
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: CommitFile[];
  repository?: string; // Nom du repo (ex: "owner/repo")
}

export interface CommitFile {
  filename: string;
  additions: number;
  deletions: number;
  changes: number;
  status: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  closed_at?: string;
  merged_at?: string;
  user: {
    login: string;
    avatar_url: string;
  };
  base: {
    repo: {
      name: string;
      full_name: string;
    };
  };
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  closed_at?: string;
  user: {
    login: string;
    avatar_url: string;
  };
  repository?: {
    name: string;
    full_name: string;
  };
}

export interface MonthlyStats {
  month: number;
  year: number;
  commits: number;
  additions: number;
  deletions: number;
  pullRequests: number;
  pullRequestsMerged: number;
  issues: number;
  issuesClosed: number;
  repositories: string[];
  languages: Record<string, number>;
  activeDays: number;
}

export interface TimeStats {
  mostActiveHour: number; // 0-23
  mostActiveDayOfWeek: number; // 0-6 (0 = dimanche, 6 = samedi)
  longestStreak: number; // Nombre de jours consécutifs
  averageTimeBetweenCommits: number; // En heures
}

export interface CodeQualityStats {
  averageCommitSize: number; // Lignes de code par commit
  additionDeletionRatio: number; // additions / deletions
  totalFilesModified: number;
  topFileExtensions: Array<{ extension: string; count: number; percentage: number }>;
}

export interface ContributionStats {
  topStarredRepos: Array<{ name: string; stars: number }>;
  openSourceContributions: number; // Contributions à des repos qui ne sont pas à l'utilisateur
  ownReposContributions: number;
  prMergeRate: number; // Pourcentage
  averageIssueResolutionTime: number; // En heures
  newReposCreated: number;
}

export interface FunStats {
  longestCommitMessage: string;
  shortestCommitMessage: string;
  averageCommitMessageLength: number;
  topEmojis: Array<{ emoji: string; count: number }>;
  topCommitKeywords: Array<{ keyword: string; count: number }>;
}

export interface ContributionHeatmapDay {
  date: string; // Format YYYY-MM-DD
  count: number;
  level: number; // 0-4 pour l'intensité de couleur
}

export interface YearlyStats {
  year: number;
  totalCommits: number;
  totalAdditions: number;
  totalDeletions: number;
  totalPullRequests: number;
  totalPullRequestsMerged: number;
  totalIssues: number;
  totalIssuesClosed: number;
  topLanguages: Array<{ name: string; count: number; percentage: number; value?: number }>;
  topRepositories: Array<{ name: string; commits: number }>;
  monthlyStats: MonthlyStats[];
  mostActiveMonth: number;
  activeDays: number;
  // Nouvelles statistiques
  timeStats: TimeStats;
  codeQualityStats: CodeQualityStats;
  contributionStats: ContributionStats;
  funStats: FunStats;
  contributionHeatmap: ContributionHeatmapDay[];
  hourlyDistribution: Array<{ hour: number; count: number }>; // 0-23
  weeklyDistribution: Array<{ dayOfWeek: number; count: number }>; // 0-6
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

