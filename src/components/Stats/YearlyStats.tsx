import React from 'react';
import { motion } from 'framer-motion';
import { YearlyStats as YearlyStatsType } from '../../types/github';
import { CodeLinesChart } from './CodeLinesChart';
import { LanguagesChart } from './LanguagesChart';
import { ContributionHeatmapChart } from './ContributionHeatmapChart';
import { HourlyDistributionChart } from './HourlyDistributionChart';
import { WeeklyDistributionChart } from './WeeklyDistributionChart';
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

      {/* Statistiques temporelles */}
      {stats.timeStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Heure la plus active</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">{stats.timeStats.mostActiveHour}h</div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Jour le plus actif</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][stats.timeStats.mostActiveDayOfWeek]}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Streak le plus long</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">{stats.timeStats.longestStreak} jours</div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Temps moyen entre commits</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {stats.timeStats.averageTimeBetweenCommits < 24 
                ? `${stats.timeStats.averageTimeBetweenCommits.toFixed(1)}h`
                : `${(stats.timeStats.averageTimeBetweenCommits / 24).toFixed(1)}j`}
            </div>
          </div>
        </div>
      )}

      {/* Statistiques qualité de code */}
      {stats.codeQualityStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Taille moyenne commits</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {stats.codeQualityStats.averageCommitSize.toFixed(0)} lignes
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Ratio A/D</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {stats.codeQualityStats.additionDeletionRatio === Infinity 
                ? '∞'
                : stats.codeQualityStats.additionDeletionRatio.toFixed(2)}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Fichiers modifiés</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {stats.codeQualityStats.totalFilesModified.toLocaleString()}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Extensions top</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {stats.codeQualityStats.topFileExtensions[0]?.extension || 'N/A'}
            </div>
            <div className="text-wrapped-muted text-xs">
              {stats.codeQualityStats.topFileExtensions[0]?.percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Statistiques contributions */}
      {stats.contributionStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Contributions OS</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {stats.contributionStats.openSourceContributions}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Mes repos</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {stats.contributionStats.ownReposContributions}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Taux merge PR</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {stats.contributionStats.prMergeRate.toFixed(0)}%
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Résolution issues</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {stats.contributionStats.averageIssueResolutionTime < 24
                ? `${stats.contributionStats.averageIssueResolutionTime.toFixed(1)}h`
                : `${(stats.contributionStats.averageIssueResolutionTime / 24).toFixed(1)}j`}
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <div className="text-wrapped-muted text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Nouveaux repos</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-wrapped-text">
              {stats.contributionStats.newReposCreated}
            </div>
          </div>
        </div>
      )}

      {/* Graphiques temporels */}
      {stats.hourlyDistribution && stats.hourlyDistribution.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <HourlyDistributionChart data={stats.hourlyDistribution} />
        </div>
      )}

      {stats.weeklyDistribution && stats.weeklyDistribution.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <WeeklyDistributionChart data={stats.weeklyDistribution} />
        </div>
      )}

      {/* Heatmap */}
      {stats.contributionHeatmap && stats.contributionHeatmap.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <ContributionHeatmapChart heatmap={stats.contributionHeatmap} year={stats.year} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        {stats.topRepositories.length > 0 && (
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <h3 className="text-wrapped-text mb-3 sm:mb-4 font-bold text-lg sm:text-xl">Top Repos</h3>
            <div className="space-y-2 sm:space-y-3">
              {stats.topRepositories.map((repo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-wrapped-text font-medium text-sm sm:text-base">{repo.name}</span>
                  <span className="text-wrapped-muted font-semibold text-sm sm:text-base">{repo.commits} commits</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="text-wrapped-text mb-3 sm:mb-4 font-bold text-lg sm:text-xl">Mois le plus actif</h3>
          <div className="text-3xl sm:text-4xl font-bold text-wrapped-text mb-1 sm:mb-2">
            {getMonthName(stats.mostActiveMonth)}
          </div>
          <div className="text-wrapped-muted text-xs sm:text-sm">
            {stats.monthlyStats[stats.mostActiveMonth]?.commits || 0} commits
          </div>
        </div>
      </div>

      {/* Repos les plus populaires */}
      {stats.contributionStats?.topStarredRepos && stats.contributionStats.topStarredRepos.length > 0 && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="text-wrapped-text mb-3 sm:mb-4 font-bold text-lg sm:text-xl">Repos les plus populaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {stats.contributionStats.topStarredRepos.slice(0, 10).map((repo, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-wrapped-bg rounded-lg">
                <span className="text-wrapped-text font-medium text-sm sm:text-base">{repo.name}</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-wrapped-muted font-semibold text-sm sm:text-base">{repo.stars}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques amusantes */}
      {stats.funStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <h3 className="text-wrapped-text mb-3 sm:mb-4 font-bold text-lg sm:text-xl">Messages de commit</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="text-wrapped-muted text-xs sm:text-sm mb-1">Message le plus long</div>
                <div className="text-sm sm:text-base text-wrapped-text bg-wrapped-bg p-2 rounded line-clamp-2">
                  {stats.funStats.longestCommitMessage || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-wrapped-muted text-xs sm:text-sm mb-1">Message le plus court</div>
                <div className="text-sm sm:text-base text-wrapped-text bg-wrapped-bg p-2 rounded">
                  {stats.funStats.shortestCommitMessage || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-wrapped-muted text-xs sm:text-sm mb-1">Longueur moyenne</div>
                <div className="text-2xl sm:text-3xl font-bold text-wrapped-text">
                  {stats.funStats.averageCommitMessageLength.toFixed(0)} caractères
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
            <h3 className="text-wrapped-text mb-3 sm:mb-4 font-bold text-lg sm:text-xl">Emojis & Mots-clés</h3>
            <div className="space-y-4">
              {stats.funStats.topEmojis && stats.funStats.topEmojis.length > 0 && (
                <div>
                  <div className="text-wrapped-muted text-xs sm:text-sm mb-2">Top emojis</div>
                  <div className="flex flex-wrap gap-2">
                    {stats.funStats.topEmojis.slice(0, 5).map((item, index) => (
                      <span key={index} className="text-2xl sm:text-3xl" title={`${item.count} fois`}>
                        {item.emoji}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {stats.funStats.topCommitKeywords && stats.funStats.topCommitKeywords.length > 0 && (
                <div>
                  <div className="text-wrapped-muted text-xs sm:text-sm mb-2">Mots-clés fréquents</div>
                  <div className="flex flex-wrap gap-2">
                    {stats.funStats.topCommitKeywords.slice(0, 5).map((item, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-wrapped-bg rounded-full text-wrapped-text text-xs sm:text-sm font-medium"
                      >
                        {item.keyword} ({item.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Extensions de fichiers */}
      {stats.codeQualityStats?.topFileExtensions && stats.codeQualityStats.topFileExtensions.length > 0 && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="text-wrapped-text mb-3 sm:mb-4 font-bold text-lg sm:text-xl">Extensions de fichiers les plus modifiées</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {stats.codeQualityStats.topFileExtensions.slice(0, 10).map((ext, index) => (
              <div key={index} className="text-center p-3 bg-wrapped-bg rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-wrapped-text">.{ext.extension}</div>
                <div className="text-xs sm:text-sm text-wrapped-muted mt-1">{ext.count} fichiers</div>
                <div className="text-xs text-wrapped-muted">{ext.percentage.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

