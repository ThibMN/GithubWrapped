import React from 'react';
import { motion } from 'framer-motion';
import { YearlyStats, MonthlyStats } from '../../types/github';
import { MonthlyStats as MonthlyStatsComponent } from './MonthlyStats';
import { YearlyStats as YearlyStatsComponent } from './YearlyStats';
import { BackgroundDecoration } from '../Layout/BackgroundDecoration';
import { Footer } from '../Layout/Footer';

interface StatsDisplayProps {
  yearlyStats: YearlyStats | null;
  monthlyStats: MonthlyStats | null;
  onClose?: () => void;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ 
  yearlyStats, 
  monthlyStats,
  onClose 
}) => {
  if (!yearlyStats && !monthlyStats) return null;

  return (
    <div className="fixed inset-0 bg-wrapped-bg z-40 overflow-y-auto">
      <BackgroundDecoration />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col py-12 px-4 relative z-10"
      >
        <div className="flex-1 max-w-6xl mx-auto w-full">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm border border-black/10 z-50"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-wrapped-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {yearlyStats && <YearlyStatsComponent stats={yearlyStats} />}
            {monthlyStats && <MonthlyStatsComponent stats={monthlyStats} />}
          </motion.div>
        </div>
        <Footer />
      </motion.div>
    </div>
  );
};

