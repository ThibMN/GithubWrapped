import React, { createContext, useContext, useState, ReactNode } from 'react';
import { YearlyStats, MonthlyStats } from '../types/github';

interface StatsContextType {
  yearlyStats: YearlyStats | null;
  monthlyStats: MonthlyStats | null;
  isLoading: boolean;
  error: string | null;
  setYearlyStats: (stats: YearlyStats | null) => void;
  setMonthlyStats: (stats: MonthlyStats | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats doit être utilisé dans un StatsProvider');
  }
  return context;
};

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const [yearlyStats, setYearlyStats] = useState<YearlyStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value: StatsContextType = {
    yearlyStats,
    monthlyStats,
    isLoading,
    error,
    setYearlyStats,
    setMonthlyStats,
    setLoading,
    setError,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};

