import { MonthlyStats, YearlyStats, Repository, Commit, PullRequest, Issue } from '../types/github';
import { getMonthsOfYear, isDateInMonth } from './dateUtils';

export const calculateMonthlyStats = (
  year: number,
  month: number,
  commits: Commit[],
  pullRequests: PullRequest[],
  issues: Issue[],
  repositories: Repository[]
): MonthlyStats => {
  const monthCommits = commits.filter(c => {
    const commitDate = c.commit.author.date;
    return isDateInMonth(commitDate, year, month);
  });

  const monthPRs = pullRequests.filter(pr => {
    const prDate = pr.created_at;
    return isDateInMonth(prDate, year, month);
  });

  const monthIssues = issues.filter(issue => {
    const issueDate = issue.created_at;
    return isDateInMonth(issueDate, year, month);
  });

  const additions = monthCommits.reduce((sum, commit) => {
    return sum + (commit.stats?.additions || 0);
  }, 0);

  const deletions = monthCommits.reduce((sum, commit) => {
    return sum + (commit.stats?.deletions || 0);
  }, 0);

  const languages: Record<string, number> = {};
  const repoCommits: Record<string, number> = {};

  monthCommits.forEach(commit => {
    // Compter les commits par repo
    if (commit.repository) {
      repoCommits[commit.repository] = (repoCommits[commit.repository] || 0) + 1;
    }
  });

  // Compter les langages depuis les repos actifs
  repositories.forEach(repo => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  const activeDays = new Set(
    monthCommits.map(c => c.commit.author.date.split('T')[0])
  ).size;

  return {
    month,
    year,
    commits: monthCommits.length,
    additions,
    deletions,
    pullRequests: monthPRs.length,
    pullRequestsMerged: monthPRs.filter(pr => pr.merged_at).length,
    issues: monthIssues.length,
    issuesClosed: monthIssues.filter(issue => issue.closed_at).length,
    repositories: Object.keys(repoCommits).length > 0 
      ? Object.keys(repoCommits).sort((a, b) => repoCommits[b] - repoCommits[a]).slice(0, 10)
      : Array.from(new Set(repositories.map(r => r.name))),
    languages,
    activeDays,
  };
};

export const calculateYearlyStats = (
  year: number,
  commits: Commit[],
  pullRequests: PullRequest[],
  issues: Issue[],
  repositories: Repository[]
): YearlyStats => {
  const yearCommits = commits.filter(c => {
    const commitDate = c.commit.author.date;
    return new Date(commitDate).getFullYear() === year;
  });

  const yearPRs = pullRequests.filter(pr => {
    return new Date(pr.created_at).getFullYear() === year;
  });

  const yearIssues = issues.filter(issue => {
    return new Date(issue.created_at).getFullYear() === year;
  });

  const totalAdditions = yearCommits.reduce((sum, commit) => {
    return sum + (commit.stats?.additions || 0);
  }, 0);

  const totalDeletions = yearCommits.reduce((sum, commit) => {
    return sum + (commit.stats?.deletions || 0);
  }, 0);

  // Calculer les langages
  const languageCounts: Record<string, number> = {};
  repositories.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const totalRepos = Object.keys(languageCounts).length;
  const topLanguages = Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalRepos > 0 ? (count / totalRepos) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculer les repos les plus actifs (basé sur les commits)
  const repoCommits: Record<string, number> = {};
  yearCommits.forEach(commit => {
    if (commit.repository) {
      repoCommits[commit.repository] = (repoCommits[commit.repository] || 0) + 1;
    }
  });

  const topRepositories = Object.entries(repoCommits)
    .map(([name, commits]) => ({ name, commits }))
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 10);

  // Calculer les stats mensuelles
  const months = getMonthsOfYear(year);
  const monthlyStats: MonthlyStats[] = months.map((_, index) => {
    return calculateMonthlyStats(
      year,
      index,
      commits,
      pullRequests,
      issues,
      repositories
    );
  });

  // Trouver le mois le plus actif
  const mostActiveMonth = monthlyStats.reduce((max, stats, index) => {
    return stats.commits > monthlyStats[max].commits ? index : max;
  }, 0);

  const activeDays = new Set(
    yearCommits.map(c => c.commit.author.date.split('T')[0])
  ).size;

  return {
    year,
    totalCommits: yearCommits.length,
    totalAdditions,
    totalDeletions,
    totalPullRequests: yearPRs.length,
    totalPullRequestsMerged: yearPRs.filter(pr => pr.merged_at).length,
    totalIssues: yearIssues.length,
    totalIssuesClosed: yearIssues.filter(issue => issue.closed_at).length,
    topLanguages,
    topRepositories,
    monthlyStats,
    mostActiveMonth,
    activeDays,
  };
};

