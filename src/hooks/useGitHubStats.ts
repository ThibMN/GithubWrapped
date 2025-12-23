import { useState, useCallback, useRef } from 'react';
import { getCurrentYear } from '../utils/dateUtils';
import { calculateYearlyStats, calculateMonthlyStats } from '../utils/statsCalculations';
import {
  getAllUserRepositories,
  getAllUserCommits,
  getUserPullRequests,
  getUserIssues,
} from '../services/githubApi';
import { useAuth } from '../context/AuthContext';
import { useStats } from '../context/StatsContext';
import { RateLimitError } from '../utils/rateLimitHandler';
import { YearlyStats } from '../types/github';

interface ProgressCallback {
  (current: number, total: number | null, message: string): void;
}

interface PartialStatsCallback {
  (stats: Partial<YearlyStats>): void;
}

export const useGitHubStats = (onProgress?: ProgressCallback, onPartialStats?: PartialStatsCallback) => {
  const { username, isAuth } = useAuth();
  const { setYearlyStats, setMonthlyStats, setLoading, setError } = useStats();
  const [isLoading, setIsLoading] = useState(false);
  const partialStatsRef = useRef<Partial<YearlyStats>>({});

  const fetchYearlyStats = useCallback(async (year: number = getCurrentYear()) => {
    if (!username) {
      throw new Error('Nom d\'utilisateur requis');
    }

    setIsLoading(true);
    setLoading(true);
    setError(null);
    partialStatsRef.current = { year };

    try {
      const yearStart = new Date(year, 0, 1).toISOString();
      const yearEnd = new Date(year, 11, 31, 23, 59, 59).toISOString();

      // Récupérer d'abord les repos
      const repos = await getAllUserRepositories(isAuth ? undefined : username, onProgress);
      
      // Commencer par récupérer les commits (données de base)
      onProgress?.(0, 0, 'Récupération des commits...');
      const commits = await getAllUserCommits(username, repos, yearStart, yearEnd, onProgress);

      // Filtrer les commits pour cette année
      const yearCommits = commits.filter(c => {
        const commitYear = new Date(c.commit.author.date).getFullYear();
        return commitYear === year;
      });

      // Calculer les stats de base (commits, additions, deletions, active days)
      const basicStats = {
        totalCommits: yearCommits.length,
        totalAdditions: yearCommits.reduce((sum, c) => sum + (c.stats?.additions || 0), 0),
        totalDeletions: yearCommits.reduce((sum, c) => sum + (c.stats?.deletions || 0), 0),
        activeDays: new Set(yearCommits.map(c => {
          const date = new Date(c.commit.author.date);
          return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        })).size,
      };

      // Mettre à jour les stats partielles immédiatement
      partialStatsRef.current = {
        ...partialStatsRef.current,
        ...basicStats,
      };
      onPartialStats?.({ ...partialStatsRef.current });

      // Continuer à charger les PRs et Issues en arrière-plan
      onProgress?.(0, 0, 'Récupération des Pull Requests et Issues...');
      const [pullRequests, issues] = await Promise.all([
        getUserPullRequests(username, 'all', 1, onProgress),
        getUserIssues(username, 'all', 1, onProgress),
      ]);

      // Calculer les stats complètes
      const stats = calculateYearlyStats(
        year,
        yearCommits,
        pullRequests,
        issues,
        repos
      );

      // Mettre à jour avec les stats complètes
      partialStatsRef.current = stats;
      onPartialStats?.({ ...stats });
      setYearlyStats(stats);
      return stats;
    } catch (err) {
      let errorMessage = 'Erreur lors de la récupération des statistiques';
      
      if (err instanceof RateLimitError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [username, isAuth, setYearlyStats, setLoading, setError, onProgress, onPartialStats]);

  const fetchMonthlyStats = useCallback(async (year: number, month: number) => {
    if (!username) {
      throw new Error('Nom d\'utilisateur requis');
    }

    setIsLoading(true);
    setLoading(true);
    setError(null);

    try {
      const monthStart = new Date(year, month, 1).toISOString();
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

      // Récupérer d'abord les repos, puis les commits
      const repos = await getAllUserRepositories(isAuth ? undefined : username, onProgress);
      
      onProgress?.(0, 0, 'Récupération des commits, PRs et issues...');
      
      const [commits, pullRequests, issues] = await Promise.all([
        getAllUserCommits(username, repos, monthStart, monthEnd, onProgress),
        getUserPullRequests(username, 'all', 1, onProgress),
        getUserIssues(username, 'all', 1, onProgress),
      ]);

      // Filtrer les commits pour ce mois
      const monthCommits = commits.filter(c => {
        const commitDate = new Date(c.commit.author.date);
        return commitDate.getFullYear() === year && commitDate.getMonth() === month;
      });

      // Calculer les stats mensuelles
      const stats = calculateMonthlyStats(
        year,
        month,
        monthCommits,
        pullRequests,
        issues,
        repos
      );

      setMonthlyStats(stats);
      return stats;
    } catch (err) {
      let errorMessage = 'Erreur lors de la récupération des statistiques';
      
      if (err instanceof RateLimitError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [username, isAuth, setMonthlyStats, setLoading, setError, onProgress]);

  return {
    fetchYearlyStats,
    fetchMonthlyStats,
    isLoading,
  };
};

