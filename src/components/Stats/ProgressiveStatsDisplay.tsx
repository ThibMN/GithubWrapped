import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { YearlyStats } from '../../types/github';
import { StatsSlide } from './StatsSlide';
import { BackgroundDecoration } from '../Layout/BackgroundDecoration';
import { Footer } from '../Layout/Footer';
import { SourceButton } from '../Layout/SourceButton';
import { CodeLinesChart } from './CodeLinesChart';
import { LanguagesChart } from './LanguagesChart';
import { ContributionHeatmapChart } from './ContributionHeatmapChart';
import { HourlyDistributionChart } from './HourlyDistributionChart';
import { WeeklyDistributionChart } from './WeeklyDistributionChart';
import { YearlyStats as YearlyStatsComponent } from './YearlyStats';

interface ProgressiveStatsDisplayProps {
  partialStats: Partial<YearlyStats>;
  onComplete?: () => void;
  autoAdvance?: boolean;
}

export const ProgressiveStatsDisplay: React.FC<ProgressiveStatsDisplayProps> = ({ 
  partialStats,
  onComplete,
  autoAdvance = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);
  const slideTimeoutRef = React.useRef<number | null>(null);

  const slides = React.useMemo(() => {
    const s = [];
    
    if (partialStats.totalCommits !== undefined) {
      s.push('commits');
    }
    if (partialStats.totalAdditions !== undefined) {
      s.push('additions');
    }
    if (partialStats.totalDeletions !== undefined) {
      s.push('deletions');
    }
    if (partialStats.activeDays !== undefined) {
      s.push('activeDays');
    }
    if (partialStats.timeStats?.longestStreak !== undefined && partialStats.timeStats.longestStreak > 0) {
      s.push('streak');
    }
    if (partialStats.timeStats?.mostActiveHour !== undefined) {
      s.push('activeHour');
    }
    if (partialStats.codeQualityStats?.averageCommitSize !== undefined) {
      s.push('commitSize');
    }
    if (partialStats.contributionStats?.openSourceContributions !== undefined) {
      s.push('openSource');
    }
    if (partialStats.funStats?.topEmojis && partialStats.funStats.topEmojis.length > 0) {
      s.push('emojis');
    }
    if (partialStats.topLanguages && partialStats.topLanguages.length > 0) {
      s.push('languages');
    }
    if (partialStats.topRepositories && partialStats.topRepositories.length > 0) {
      s.push('repositories');
    }
    if (partialStats.monthlyStats && partialStats.monthlyStats.length > 0) {
      s.push('chart');
    }
    if (partialStats.contributionHeatmap && partialStats.contributionHeatmap.length > 0) {
      s.push('heatmap');
    }
    if (partialStats.hourlyDistribution && partialStats.hourlyDistribution.length > 0) {
      s.push('hourlyChart');
    }
    if (partialStats.weeklyDistribution && partialStats.weeklyDistribution.length > 0) {
      s.push('weeklyChart');
    }
    if (partialStats.totalPullRequests !== undefined || partialStats.totalIssues !== undefined) {
      s.push('prsIssues');
    }
    // Dernière slide : vue complète
    if (Object.keys(partialStats).length > 4) {
      s.push('complete');
    }
    
    return s;
  }, [partialStats]);

  useEffect(() => {
    // Auto-avancer après 10 secondes si autoAdvance est activé
    if (autoAdvance && canAdvance && currentSlide < slides.length - 1) {
      slideTimeoutRef.current = window.setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
        setCanAdvance(false);
      }, 10000);
    }

    return () => {
      if (slideTimeoutRef.current !== null) {
        clearTimeout(slideTimeoutRef.current);
      }
    };
  }, [canAdvance, currentSlide, slides.length, autoAdvance]);

  useEffect(() => {
    // Quand de nouvelles stats arrivent, permettre l'avancement
    setCanAdvance(true);
    
    // Si on est sur la dernière slide et qu'on reçoit des stats complètes, appeler onComplete
    if (currentSlide === slides.length - 1 && slides.includes('complete')) {
      setTimeout(() => {
        onComplete?.();
      }, 4000);
    }
  }, [partialStats, currentSlide, slides, onComplete]);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setCanAdvance(false);
    }
  }, [currentSlide, slides.length]);

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setCanAdvance(false);
    }
  }, [currentSlide]);

  const renderSlide = () => {
    if (currentSlide >= slides.length) return null;
    
    const slideType = slides[currentSlide];

    switch (slideType) {
      case 'commits':
        if (partialStats.totalCommits === undefined) return null;
        return (
          <StatsSlide 
            title="Commits cette année"
            delay={0}
          >
            <div className="text-center">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-wrapped-text mb-6 sm:mb-8">
                {partialStats.totalCommits.toLocaleString()}
              </div>
              <p className="text-base sm:text-lg md:text-xl text-wrapped-muted px-4">
                C'est {partialStats.totalCommits > 1000 ? 'énorme' : 'impressionnant'} ! 🎉
              </p>
            </div>
          </StatsSlide>
        );

      case 'additions':
        if (partialStats.totalAdditions === undefined) return null;
        return (
          <StatsSlide 
            title="Lignes de code ajoutées"
            delay={0}
          >
            <div className="text-center">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-wrapped-text mb-6 sm:mb-8">
                {partialStats.totalAdditions.toLocaleString()}
              </div>
              <p className="text-base sm:text-lg md:text-xl text-wrapped-muted px-4">
                Tu es un vrai codeur ! 💻
              </p>
            </div>
          </StatsSlide>
        );

      case 'deletions':
        if (partialStats.totalDeletions === undefined) return null;
        return (
          <StatsSlide 
            title="Lignes de code supprimées"
            delay={0}
          >
            <div className="text-center">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-wrapped-text mb-6 sm:mb-8">
                {partialStats.totalDeletions.toLocaleString()}
              </div>
              <p className="text-base sm:text-lg md:text-xl text-wrapped-muted px-4">
                Refactoring is caring 🧹
              </p>
            </div>
          </StatsSlide>
        );

      case 'activeDays':
        if (partialStats.activeDays === undefined) return null;
        return (
          <StatsSlide 
            title="Jours actifs"
            delay={0}
          >
            <div className="text-center">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-wrapped-text mb-6 sm:mb-8">
                {partialStats.activeDays}
              </div>
              <p className="text-base sm:text-lg md:text-xl text-wrapped-muted px-4">
                Tu as été actif {Math.round((partialStats.activeDays / 365) * 100)}% de l'année
              </p>
            </div>
          </StatsSlide>
        );

      case 'streak':
        if (!partialStats.timeStats || partialStats.timeStats.longestStreak === undefined) return null;
        return (
          <StatsSlide 
            title="Streak le plus long"
            delay={0}
          >
            <div className="text-center">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-wrapped-text mb-6 sm:mb-8">
                {partialStats.timeStats.longestStreak}
              </div>
              <p className="text-base sm:text-lg md:text-xl text-wrapped-muted px-4">
                {partialStats.timeStats.longestStreak > 30 
                  ? 'Un vrai machine ! 🔥' 
                  : partialStats.timeStats.longestStreak > 14
                  ? 'Consistance au rendez-vous ! 💪'
                  : 'Bonne régularité ! ⚡'}
              </p>
            </div>
          </StatsSlide>
        );

      case 'activeHour':
        if (!partialStats.timeStats || partialStats.timeStats.mostActiveHour === undefined) return null;
        const hour = partialStats.timeStats.mostActiveHour;
        return (
          <StatsSlide 
            title="Heure la plus active"
            delay={0}
          >
            <div className="text-center">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-wrapped-text mb-6 sm:mb-8">
                {hour}h
              </div>
              <p className="text-base sm:text-lg md:text-xl text-wrapped-muted px-4">
                {hour >= 22 || hour < 6 
                  ? 'Oiseau de nuit ! 🦉'
                  : hour >= 6 && hour < 12
                  ? 'Early bird ! 🌅'
                  : hour >= 12 && hour < 14
                  ? 'Productif même le midi ! ☀️'
                  : 'Après-midi studieux ! 💼'}
              </p>
            </div>
          </StatsSlide>
        );

      case 'commitSize':
        if (!partialStats.codeQualityStats || partialStats.codeQualityStats.averageCommitSize === undefined) return null;
        const avgSize = Math.round(partialStats.codeQualityStats.averageCommitSize);
        return (
          <StatsSlide 
            title="Taille moyenne des commits"
            delay={0}
          >
            <div className="text-center">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-wrapped-text mb-6 sm:mb-8">
                {avgSize}
              </div>
              <p className="text-base sm:text-lg md:text-xl text-wrapped-muted px-4">
                {avgSize > 500 
                  ? 'Commits conséquents ! 📦'
                  : avgSize > 100
                  ? 'Bons commits bien dimensionnés ! ✨'
                  : 'Commits atomiques, parfait ! 🎯'}
              </p>
            </div>
          </StatsSlide>
        );

      case 'openSource':
        if (!partialStats.contributionStats || partialStats.contributionStats.openSourceContributions === undefined) return null;
        return (
          <StatsSlide 
            title="Contributions open-source"
            delay={0}
          >
            <div className="text-center">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-wrapped-text mb-6 sm:mb-8">
                {partialStats.contributionStats.openSourceContributions}
              </div>
              <p className="text-base sm:text-lg md:text-xl text-wrapped-muted px-4">
                {partialStats.contributionStats.openSourceContributions > 0
                  ? 'Merci pour tes contributions à l\'open-source ! 🌟'
                  : 'Contribue à l\'open-source, c\'est génial ! 🚀'}
              </p>
            </div>
          </StatsSlide>
        );

      case 'emojis':
        if (!partialStats.funStats?.topEmojis || partialStats.funStats.topEmojis.length === 0) return null;
        return (
          <StatsSlide 
            title="Tes emojis préférés"
            delay={0}
          >
            <div className="text-center">
              <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 flex-wrap">
                {partialStats.funStats.topEmojis.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-2">{item.emoji}</div>
                    <div className="text-sm sm:text-base text-wrapped-muted">{item.count}x</div>
                  </motion.div>
                ))}
              </div>
              <p className="text-base sm:text-lg md:text-xl text-wrapped-muted px-4">
                Un développeur expressif ! 😄
              </p>
            </div>
          </StatsSlide>
        );

      case 'heatmap':
        if (!partialStats.contributionHeatmap || partialStats.contributionHeatmap.length === 0 || !partialStats.year) return null;
        return (
          <StatsSlide title="Carte de contributions" delay={0}>
            <ContributionHeatmapChart heatmap={partialStats.contributionHeatmap} year={partialStats.year} />
          </StatsSlide>
        );

      case 'hourlyChart':
        if (!partialStats.hourlyDistribution || partialStats.hourlyDistribution.length === 0) return null;
        return (
          <StatsSlide title="Répartition horaire" delay={0}>
            <HourlyDistributionChart data={partialStats.hourlyDistribution} />
          </StatsSlide>
        );

      case 'weeklyChart':
        if (!partialStats.weeklyDistribution || partialStats.weeklyDistribution.length === 0) return null;
        return (
          <StatsSlide title="Répartition hebdomadaire" delay={0}>
            <WeeklyDistributionChart data={partialStats.weeklyDistribution} />
          </StatsSlide>
        );

      case 'languages':
        if (!partialStats.topLanguages || partialStats.topLanguages.length === 0) return null;
        return (
          <StatsSlide title="Tes langages" delay={0}>
            <LanguagesChart languages={partialStats.topLanguages} />
          </StatsSlide>
        );

      case 'repositories':
        if (!partialStats.topRepositories || partialStats.topRepositories.length === 0) return null;
        return (
          <StatsSlide title="Tes repos les plus actifs" delay={0}>
            <div className="space-y-3 sm:space-y-4">
              {partialStats.topRepositories.slice(0, 5).map((repo, index) => (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
                >
                  <div className="text-base sm:text-lg md:text-xl font-semibold text-wrapped-text break-words">{repo.name}</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-wrapped-muted whitespace-nowrap">{repo.commits} commits</div>
                </motion.div>
              ))}
            </div>
          </StatsSlide>
        );

      case 'chart':
        if (!partialStats.monthlyStats || partialStats.monthlyStats.length === 0) return null;
        return (
          <StatsSlide title="Évolution mensuelle" delay={0}>
            <CodeLinesChart monthlyStats={partialStats.monthlyStats} />
          </StatsSlide>
        );

      case 'prsIssues':
        return (
          <StatsSlide title="Contributions" subtitle="Pull Requests et Issues" delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-wrapped-text mb-3 sm:mb-4">
                  {partialStats.totalPullRequests?.toLocaleString() || 0}
                </div>
                <div className="text-lg sm:text-xl text-wrapped-muted">Pull Requests</div>
                {partialStats.totalPullRequestsMerged !== undefined && (
                  <div className="text-xs sm:text-sm text-wrapped-muted mt-2">
                    {partialStats.totalPullRequestsMerged} mergées
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-wrapped-text mb-3 sm:mb-4">
                  {partialStats.totalIssues?.toLocaleString() || 0}
                </div>
                <div className="text-lg sm:text-xl text-wrapped-muted">Issues</div>
                {partialStats.totalIssuesClosed !== undefined && (
                  <div className="text-xs sm:text-sm text-wrapped-muted mt-2">
                    {partialStats.totalIssuesClosed} fermées
                  </div>
                )}
              </div>
            </div>
          </StatsSlide>
        );

      case 'complete':
        if (Object.keys(partialStats).length < 10) return null;
        return (
          <StatsSlide title={`Ton année ${partialStats.year}`} delay={0}>
            <YearlyStatsComponent stats={partialStats as YearlyStats} />
          </StatsSlide>
        );

      default:
        return null;
    }
  };

  const currentSlideContent = renderSlide();

  return (
    <div className="fixed inset-0 bg-wrapped-bg z-40 overflow-hidden">
      <BackgroundDecoration />
      
      {/* Bouton source en haut à droite (desktop/tablette uniquement) */}
      <div className="hidden md:block fixed top-4 right-4 z-50">
        <SourceButton className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-black/10 hover:bg-white transition-colors" />
      </div>
      
      <div className="relative z-10 h-full overflow-y-auto flex flex-col">
        <AnimatePresence mode="wait">
          {currentSlideContent && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              {currentSlideContent}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Contrôles de navigation */}
        <div className="fixed bottom-20 sm:bottom-24 left-0 right-0 flex justify-center gap-3 sm:gap-4 z-50 px-4">
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full font-semibold text-wrapped-text hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-black/10 text-sm sm:text-base"
          >
            Précédent
          </button>
          {currentSlide < slides.length - 1 && (
            <button
              onClick={handleNext}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-wrapped-text text-wrapped-bg rounded-full font-semibold hover:bg-wrapped-muted transition-colors shadow-lg text-sm sm:text-base"
            >
              Suivant
            </button>
          )}
        </div>
        
        {/* Indicateur de progression */}
        <div className="fixed bottom-2 sm:bottom-6 left-0 right-0 flex justify-center gap-1.5 sm:gap-2 z-50 px-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-wrapped-text'
                  : 'w-2 bg-wrapped-muted/30'
              }`}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

