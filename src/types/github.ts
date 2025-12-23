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
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

