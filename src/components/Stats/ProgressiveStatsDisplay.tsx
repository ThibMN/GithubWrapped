import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { YearlyStats } from '../../types/github';
import { StatsSlide } from './StatsSlide';
import { BackgroundDecoration } from '../Layout/BackgroundDecoration';
import { Footer } from '../Layout/Footer';
import { SourceButton } from '../Layout/SourceButton';
import { CodeLinesChart } from './CodeLinesChart';
import { LanguagesChart } from './LanguagesChart';
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
    if (partialStats.topLanguages && partialStats.topLanguages.length > 0) {
      s.push('languages');
    }
    if (partialStats.topRepositories && partialStats.topRepositories.length > 0) {
      s.push('repositories');
    }
    if (partialStats.monthlyStats && partialStats.monthlyStats.length > 0) {
      s.push('chart');
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

