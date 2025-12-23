import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StatsProvider, useStats } from './context/StatsContext';
import { AuthSelector } from './components/Auth/AuthSelector';
import { MiniTerminal } from './components/Terminal/MiniTerminal';
import { StatsDisplay } from './components/Stats/StatsDisplay';
import { ProgressiveStatsDisplay } from './components/Stats/ProgressiveStatsDisplay';
import { ErrorBoundary } from './components/Layout/ErrorBoundary';
import { BackgroundDecoration } from './components/Layout/BackgroundDecoration';
import { Footer } from './components/Layout/Footer';
import { RateLimitWarning } from './components/Layout/RateLimitWarning';
import { SourceButton } from './components/Layout/SourceButton';
import { useGitHubStats } from './hooks/useGitHubStats';
import { useGitHubAuth } from './hooks/useGitHubAuth';
import { getCurrentYear } from './utils/dateUtils';
import { RateLimitError } from './utils/rateLimitHandler';
import { YearlyStats } from './types/github';

interface TerminalLog {
  type: 'info' | 'success' | 'error' | 'command';
  message: string;
  timestamp: Date;
}

const AppContent: React.FC = () => {
  const { username, isLoading } = useAuth();
  const { yearlyStats, monthlyStats, setYearlyStats, setMonthlyStats } = useStats();
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showProgressiveStats, setShowProgressiveStats] = useState(false);
  const [partialStats, setPartialStats] = useState<Partial<YearlyStats>>({});
  const [rateLimitError, setRateLimitError] = useState<RateLimitError | null>(null);

  const addLog = (type: TerminalLog['type'], message: string) => {
    setLogs(prev => [...prev, { type, message, timestamp: new Date() }]);
  };

  const handleProgress = (current: number, total: number | null, message: string) => {
    if (total !== null && total > 0) {
      addLog('info', `${message} (${current}/${total})`);
    } else {
      addLog('info', message);
    }
  };

  const handlePartialStats = (stats: Partial<YearlyStats>) => {
    setPartialStats(stats);
    // Afficher l'affichage progressif dès qu'on a les premières stats
    if (!showProgressiveStats && (stats.totalCommits !== undefined || stats.totalAdditions !== undefined)) {
      setShowProgressiveStats(true);
    }
  };

  const { fetchYearlyStats, fetchMonthlyStats } = useGitHubStats(handleProgress, handlePartialStats);

  const handleFetchYearly = async () => {
    setIsProcessing(true);
    setShowProgressiveStats(false);
    setPartialStats({});
    addLog('info', 'Récupération des statistiques annuelles...');
    try {
      await fetchYearlyStats(getCurrentYear());
      addLog('success', 'Statistiques annuelles récupérées avec succès');
      // showProgressiveStats sera activé automatiquement via handlePartialStats
    } catch (error) {
      if (error instanceof RateLimitError) {
        addLog('error', error.message);
        addLog('info', '💡 Astuce: Connectez-vous avec OAuth pour augmenter la limite à 5000 requêtes/heure');
        setRateLimitError(error);
      } else {
        addLog('error', `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      setShowProgressiveStats(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFetchMonthly = async (month: number) => {
    setIsProcessing(true);
    addLog('info', `Récupération des statistiques du mois ${month + 1}...`);
    try {
      await fetchMonthlyStats(getCurrentYear(), month);
      addLog('success', `Statistiques du mois ${month + 1} récupérées avec succès`);
      setShowStats(true);
    } catch (error) {
      if (error instanceof RateLimitError) {
        addLog('error', error.message);
        addLog('info', '💡 Astuce: Connectez-vous avec OAuth pour augmenter la limite à 5000 requêtes/heure');
        setRateLimitError(error);
      } else {
        addLog('error', `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wrapped-bg">
        <div className="text-wrapped-text">Chargement...</div>
      </div>
    );
  }

  if (!username) {
    return <AuthSelector />;
  }

  return (
    <div className="min-h-screen bg-wrapped-bg relative">
      {/* Décorations de fond */}
      <BackgroundDecoration />
      
      {/* Bouton source en haut à droite (desktop/tablette uniquement) */}
      <div className="hidden md:block fixed top-4 right-4 z-50">
        <SourceButton className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-black/10 hover:bg-white transition-colors" />
      </div>
      
      {/* Page principale sobre */}
      <div className="min-h-screen flex flex-col px-4 py-12 relative z-10">
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl w-full flex flex-col items-center"
          >
          <div className="w-full flex justify-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold text-wrapped-text mb-4 leading-tight inline-block">
              GithubWrapped
            </h1>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl text-wrapped-muted mb-8 sm:mb-12 text-center px-4">
            {getCurrentYear()}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md sm:max-w-2xl px-4">
            <button
              onClick={handleFetchYearly}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-wrapped-text text-wrapped-bg rounded-full font-semibold text-base sm:text-lg hover:bg-wrapped-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voir mon année
            </button>
            <button
              onClick={() => {
                const currentMonth = new Date().getMonth();
                handleFetchMonthly(currentMonth);
              }}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-wrapped-text text-wrapped-text rounded-full font-semibold text-base sm:text-lg hover:bg-wrapped-text hover:text-wrapped-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voir ce mois
            </button>
          </div>

          {/* Terminal inline sur mobile pendant le chargement */}
          {isProcessing && (
            <div className="lg:hidden w-full max-w-md sm:max-w-2xl px-4 mt-6">
              <MiniTerminal logs={logs} isProcessing={isProcessing} inline={true} />
            </div>
          )}
          </motion.div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Terminal mini en bas à droite */}
      <MiniTerminal logs={logs} isProcessing={isProcessing} />

      {/* Avertissement rate limit */}
      <RateLimitWarning 
        error={rateLimitError} 
        onDismiss={() => setRateLimitError(null)} 
      />

      {/* Affichage progressif des stats (style Spotify Wrapped) */}
      {showProgressiveStats && Object.keys(partialStats).length > 0 && (
        <ProgressiveStatsDisplay
          partialStats={partialStats}
          onComplete={() => {
            // Quand l'affichage progressif est terminé, on peut afficher la vue complète
            setShowProgressiveStats(false);
            setShowStats(true);
          }}
          autoAdvance={true}
        />
      )}

      {/* Affichage complet des stats (si demandé) */}
      {showStats && !showProgressiveStats && (yearlyStats || monthlyStats) && (
        <StatsDisplay
          yearlyStats={yearlyStats}
          monthlyStats={monthlyStats}
          onClose={() => {
            setShowStats(false);
            setShowProgressiveStats(false);
            setYearlyStats(null);
            setMonthlyStats(null);
            setPartialStats({});
          }}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/GithubWrapped">
        <AuthProvider>
          <StatsProvider>
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </StatsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

const AuthCallback: React.FC = () => {
  const { handleOAuthCallback } = useGitHubAuth();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      // Appeler le handler OAuth qui va échanger le code contre un token
      handleOAuthCallback(code, state)
        .then(() => {
          // Rediriger vers la page principale après succès
          window.location.href = '/GithubWrapped/';
        })
        .catch((err) => {
          const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'authentification';
          setError(errorMessage);
          // Rediriger après 3 secondes même en cas d'erreur
          setTimeout(() => {
            window.location.href = '/GithubWrapped/';
          }, 3000);
        });
    } else {
      // Pas de code/state, rediriger immédiatement
      window.location.href = '/GithubWrapped/';
    }
  }, [handleOAuthCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-wrapped-bg">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-600 mb-4">Erreur d'authentification</div>
            <div className="text-wrapped-muted text-sm">{error}</div>
            <div className="text-wrapped-muted text-xs mt-2">Redirection en cours...</div>
          </>
        ) : (
          <>
            <div className="text-wrapped-text mb-4">Traitement de l'authentification...</div>
            <div className="w-8 h-8 border-4 border-wrapped-text border-t-transparent rounded-full animate-spin mx-auto"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

