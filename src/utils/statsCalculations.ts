import { MonthlyStats, YearlyStats, Repository, Commit, PullRequest, Issue, TimeStats, CodeQualityStats, ContributionStats, FunStats, ContributionHeatmapDay } from '../types/github';
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

  // Compter le nombre total de repos (pas le nombre de langages uniques)
  const totalRepos = repositories.filter(repo => repo.language).length;
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

  // Calculer les nouvelles statistiques
  const timeStats = calculateTimeStats(yearCommits);
  const codeQualityStats = calculateCodeQualityStats(yearCommits, totalAdditions, totalDeletions);
  const contributionStats = calculateContributionStats(yearPRs, yearIssues, repositories, year, yearCommits);
  const funStats = calculateFunStats(yearCommits);
  const contributionHeatmap = calculateContributionHeatmap(yearCommits, year);
  const hourlyDistribution = calculateHourlyDistribution(yearCommits);
  const weeklyDistribution = calculateWeeklyDistribution(yearCommits);

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
    timeStats,
    codeQualityStats,
    contributionStats,
    funStats,
    contributionHeatmap,
    hourlyDistribution,
    weeklyDistribution,
  };
};

// Fonctions helper pour calculer les nouvelles statistiques

const calculateTimeStats = (commits: Commit[]): TimeStats => {
  if (commits.length === 0) {
    return {
      mostActiveHour: 0,
      mostActiveDayOfWeek: 0,
      longestStreak: 0,
      averageTimeBetweenCommits: 0,
    };
  }

  // Distribution horaire
  const hourlyCounts: Record<number, number> = {};
  commits.forEach(commit => {
    const date = new Date(commit.commit.author.date);
    const hour = date.getHours();
    hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
  });
  const mostActiveHourEntry = Object.entries(hourlyCounts)
    .sort((a, b) => b[1] - a[1])[0];
  const mostActiveHour = mostActiveHourEntry ? parseInt(mostActiveHourEntry[0]) : 0;

  // Distribution hebdomadaire
  const weeklyCounts: Record<number, number> = {};
  commits.forEach(commit => {
    const date = new Date(commit.commit.author.date);
    const dayOfWeek = date.getDay(); // 0 = dimanche, 6 = samedi
    weeklyCounts[dayOfWeek] = (weeklyCounts[dayOfWeek] || 0) + 1;
  });
  const mostActiveDayOfWeekEntry = Object.entries(weeklyCounts)
    .sort((a, b) => b[1] - a[1])[0];
  const mostActiveDayOfWeek = mostActiveDayOfWeekEntry ? parseInt(mostActiveDayOfWeekEntry[0]) : 0;

  // Streak le plus long
  const sortedDates = commits
    .map(c => c.commit.author.date.split('T')[0])
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort()
    .map(d => new Date(d));

  let longestStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  sortedDates.forEach(date => {
    const dateStr = date.toISOString().split('T')[0];
    const lastDateStr = lastDate?.toISOString().split('T')[0];
    
    if (!lastDate || areConsecutiveDays(lastDateStr!, dateStr)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
    lastDate = date;
  });

  // Temps moyen entre commits (en heures)
  const sortedCommitDates = commits
    .map(c => new Date(c.commit.author.date))
    .sort((a, b) => a.getTime() - b.getTime());

  let totalHours = 0;
  for (let i = 1; i < sortedCommitDates.length; i++) {
    const diff = sortedCommitDates[i].getTime() - sortedCommitDates[i - 1].getTime();
    totalHours += diff / (1000 * 60 * 60);
  }
  const averageTimeBetweenCommits = sortedCommitDates.length > 1 
    ? totalHours / (sortedCommitDates.length - 1) 
    : 0;

  return {
    mostActiveHour,
    mostActiveDayOfWeek,
    longestStreak,
    averageTimeBetweenCommits,
  };
};

const areConsecutiveDays = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

const calculateCodeQualityStats = (
  commits: Commit[],
  totalAdditions: number,
  totalDeletions: number
): CodeQualityStats => {
  if (commits.length === 0) {
    return {
      averageCommitSize: 0,
      additionDeletionRatio: 0,
      totalFilesModified: 0,
      topFileExtensions: [],
    };
  }

  // Taille moyenne des commits
  const totalChanges = totalAdditions + totalDeletions;
  const averageCommitSize = totalChanges / commits.length;

  // Ratio additions/suppressions
  const additionDeletionRatio = totalDeletions > 0 
    ? totalAdditions / totalDeletions 
    : totalAdditions > 0 ? Infinity : 0;

  // Fichiers modifiés et extensions
  const fileExtensions: Record<string, number> = {};
  const filesSet = new Set<string>();

  commits.forEach(commit => {
    if (commit.files) {
      commit.files.forEach(file => {
        filesSet.add(file.filename);
        const extension = getFileExtension(file.filename);
        if (extension) {
          fileExtensions[extension] = (fileExtensions[extension] || 0) + 1;
        }
      });
    }
  });

  const totalFilesModified = filesSet.size;
  const totalFiles = Object.values(fileExtensions).reduce((sum, count) => sum + count, 0);

  const topFileExtensions = Object.entries(fileExtensions)
    .map(([extension, count]) => ({
      extension,
      count,
      percentage: totalFiles > 0 ? (count / totalFiles) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    averageCommitSize,
    additionDeletionRatio,
    totalFilesModified,
    topFileExtensions,
  };
};

const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  if (parts.length > 1) {
    const ext = parts[parts.length - 1].toLowerCase();
    // Filtrer les extensions communes non pertinentes
    if (ext && ext.length <= 5 && !['lock', 'txt', 'md', 'json', 'yml', 'yaml'].includes(ext)) {
      return ext;
    }
  }
  return '';
};

const calculateContributionStats = (
  pullRequests: PullRequest[],
  issues: Issue[],
  repositories: Repository[],
  year: number,
  commits: Commit[]
): ContributionStats => {
  // Repos avec le plus de stars
  const repoStars = repositories
    .filter(repo => {
      const repoYear = new Date(repo.created_at).getFullYear();
      return repoYear <= year; // Repos existants à la fin de l'année
    })
    .map(repo => ({
      name: repo.full_name,
      stars: repo.stargazers_count,
    }))
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10);

  // Contributions open-source vs propres repos
  const userRepos = new Set(repositories.map(r => r.full_name.toLowerCase()));
  let openSourceContributions = 0;
  let ownReposContributions = 0;

  commits.forEach(commit => {
    if (commit.repository) {
      const repoLower = commit.repository.toLowerCase();
      if (userRepos.has(repoLower)) {
        ownReposContributions++;
      } else {
        openSourceContributions++;
      }
    }
  });

  // Taux de merge des PRs
  const totalPRs = pullRequests.length;
  const mergedPRs = pullRequests.filter(pr => pr.merged_at).length;
  const prMergeRate = totalPRs > 0 ? (mergedPRs / totalPRs) * 100 : 0;

  // Temps moyen de résolution des issues (en heures)
  const closedIssues = issues.filter(issue => issue.closed_at);
  let totalResolutionHours = 0;
  closedIssues.forEach(issue => {
    if (issue.closed_at) {
      const created = new Date(issue.created_at);
      const closed = new Date(issue.closed_at);
      const hours = (closed.getTime() - created.getTime()) / (1000 * 60 * 60);
      totalResolutionHours += hours;
    }
  });
  const averageIssueResolutionTime = closedIssues.length > 0
    ? totalResolutionHours / closedIssues.length
    : 0;

  // Nouveaux repos créés dans l'année
  const newReposCreated = repositories.filter(repo => {
    const repoYear = new Date(repo.created_at).getFullYear();
    return repoYear === year;
  }).length;

  return {
    topStarredRepos: repoStars,
    openSourceContributions,
    ownReposContributions,
    prMergeRate,
    averageIssueResolutionTime,
    newReposCreated,
  };
};

const calculateFunStats = (commits: Commit[]): FunStats => {
  if (commits.length === 0) {
    return {
      longestCommitMessage: '',
      shortestCommitMessage: '',
      averageCommitMessageLength: 0,
      topEmojis: [],
      topCommitKeywords: [],
    };
  }

  const messages = commits.map(c => c.commit.message);
  const longestCommitMessage = messages.reduce((longest, msg) => 
    msg.length > longest.length ? msg : longest, messages[0]);
  const shortestCommitMessage = messages.reduce((shortest, msg) => 
    msg.length < shortest.length ? msg : shortest, messages[0]);

  const averageCommitMessageLength = messages.reduce((sum, msg) => sum + msg.length, 0) / messages.length;

  // Emojis (regex simple pour détecter les emojis)
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{24C2}-\u{1F251}]/gu;
  const emojiCounts: Record<string, number> = {};
  messages.forEach(msg => {
    const emojis = msg.match(emojiRegex) || [];
    emojis.forEach(emoji => {
      emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
    });
  });

  const topEmojis = Object.entries(emojiCounts)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Mots-clés communs dans les commits
  const keywords = ['feat', 'fix', 'refactor', 'docs', 'style', 'test', 'chore', 'perf', 'ci', 'build', 'revert'];
  const keywordCounts: Record<string, number> = {};
  messages.forEach(msg => {
    const lowerMsg = msg.toLowerCase();
    keywords.forEach(keyword => {
      if (lowerMsg.includes(keyword)) {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      }
    });
  });

  const topCommitKeywords = Object.entries(keywordCounts)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    longestCommitMessage,
    shortestCommitMessage,
    averageCommitMessageLength,
    topEmojis,
    topCommitKeywords,
  };
};

const calculateContributionHeatmap = (commits: Commit[], year: number): ContributionHeatmapDay[] => {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31, 23, 59, 59);
  const daysInYear = Math.ceil((yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const dailyCounts: Record<string, number> = {};
  commits.forEach(commit => {
    const date = commit.commit.author.date.split('T')[0];
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
  });

  const heatmap: ContributionHeatmapDay[] = [];
  for (let i = 0; i < daysInYear; i++) {
    const date = new Date(yearStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const count = dailyCounts[dateStr] || 0;
    
    // Niveau d'intensité (0-4)
    let level = 0;
    if (count > 0) {
      const maxCount = Math.max(...Object.values(dailyCounts), 1);
      level = Math.min(4, Math.ceil((count / maxCount) * 4));
    }
    
    heatmap.push({ date: dateStr, count, level });
  }

  return heatmap;
};

const calculateHourlyDistribution = (commits: Commit[]): Array<{ hour: number; count: number }> => {
  const hourlyCounts: Record<number, number> = {};
  commits.forEach(commit => {
    const date = new Date(commit.commit.author.date);
    const hour = date.getHours();
    hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
  });

  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourlyCounts[hour] || 0,
  }));
};

const calculateWeeklyDistribution = (commits: Commit[]): Array<{ dayOfWeek: number; count: number }> => {
  const weeklyCounts: Record<number, number> = {};
  commits.forEach(commit => {
    const date = new Date(commit.commit.author.date);
    const dayOfWeek = date.getDay(); // 0 = dimanche, 6 = samedi
    weeklyCounts[dayOfWeek] = (weeklyCounts[dayOfWeek] || 0) + 1;
  });

  return Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    count: weeklyCounts[dayOfWeek] || 0,
  }));
};

