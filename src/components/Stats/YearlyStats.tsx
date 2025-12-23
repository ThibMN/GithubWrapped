import React from 'react';
import { motion } from 'framer-motion';
import { YearlyStats as YearlyStatsType } from '../../types/github';
import { CodeLinesChart } from './CodeLinesChart';
import { LanguagesChart } from './LanguagesChart';
import { getMonthName } from '../../utils/dateUtils';

interface YearlyStatsProps {
  stats: YearlyStatsType;
}

export const YearlyStats: React.FC<YearlyStatsProps> = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <h2 className="text-5xl md:text-7xl font-bold mb-12 text-wrapped-text text-center w-full">
        Votre année {stats.year}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
          <div className="text-wrapped-muted text-xs sm:text-sm mb-2 font-medium flex items-center gap-1.5 sm:gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Total Commits
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-wrapped-text">{stats.totalCommits.toLocaleString()}</div>
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
          <div className="text-wrapped-muted text-xs sm:text-sm mb-2 font-medium flex items-center gap-1.5 sm:gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Lignes ajoutées
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-wrapped-text">{stats.totalAdditions.toLocaleString()}</div>
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
          <div className="text-wrapped-muted text-xs sm:text-sm mb-2 font-medium flex items-center gap-1.5 sm:gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            Lignes supprimées
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-wrapped-text">{stats.totalDeletions.toLocaleString()}</div>
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
          <div className="text-wrapped-muted text-xs sm:text-sm mb-2 font-medium flex items-center gap-1.5 sm:gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Jours actifs
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-wrapped-text">{stats.activeDays}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
          <div className="text-wrapped-muted text-xs sm:text-sm mb-2 font-medium flex items-center gap-1.5 sm:gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Pull Requests
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text mb-1 sm:mb-2">{stats.totalPullRequests}</div>
          <div className="text-wrapped-muted text-xs sm:text-sm">
            {stats.totalPullRequestsMerged} mergées
          </div>
        </div>
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
          <div className="text-wrapped-muted text-xs sm:text-sm mb-2 font-medium flex items-center gap-1.5 sm:gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Issues
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text mb-1 sm:mb-2">{stats.totalIssues}</div>
          <div className="text-wrapped-muted text-xs sm:text-sm">
            {stats.totalIssuesClosed} fermées
          </div>
        </div>
      </div>

      <div className="mb-6">
        <CodeLinesChart monthlyStats={stats.monthlyStats} />
      </div>

      {stats.topLanguages.length > 0 && (
        <div className="mb-6">
          <LanguagesChart languages={stats.topLanguages} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.topRepositories.length > 0 && (
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h3 className="text-wrapped-text mb-4 font-bold text-xl">Top Repos</h3>
            <div className="space-y-3">
              {stats.topRepositories.map((repo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-wrapped-text font-medium">{repo.name}</span>
                  <span className="text-wrapped-muted font-semibold">{repo.commits} commits</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="text-wrapped-text mb-4 font-bold text-xl">Mois le plus actif</h3>
          <div className="text-4xl font-bold text-wrapped-text mb-2">
            {getMonthName(stats.mostActiveMonth)}
          </div>
          <div className="text-wrapped-muted text-sm">
            {stats.monthlyStats[stats.mostActiveMonth]?.commits || 0} commits
          </div>
        </div>
      </div>
    </motion.div>
  );
};

