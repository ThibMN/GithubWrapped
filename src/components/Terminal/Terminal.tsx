import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalInput } from './TerminalInput';
import { TerminalOutput } from './TerminalOutput';
import { executeCommand, createCommandHandler } from '../../utils/terminalCommands';
import { useStats } from '../../context/StatsContext';
import { useGitHubStats } from '../../hooks/useGitHubStats';
import { getCurrentYear } from '../../utils/dateUtils';
import { MonthlyStats } from '../Stats/MonthlyStats';
import { YearlyStats } from '../Stats/YearlyStats';

interface TerminalHistory {
  type: 'command' | 'output';
  content: string;
  timestamp: Date;
}

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<TerminalHistory[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { monthlyStats, yearlyStats } = useStats();
  const { fetchMonthlyStats, fetchYearlyStats } = useGitHubStats();

  useEffect(() => {
    // Scroll vers le bas quand l'historique change
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Message de bienvenue initial
    const welcomeMessage = `Bienvenue sur GithubWrapped ${getCurrentYear()}!
Tapez 'help' pour voir les commandes disponibles.`;
    setHistory([{ type: 'output', content: welcomeMessage, timestamp: new Date() }]);
  }, []);

  const handleStatsMonth = async (month: number) => {
    setIsProcessing(true);
    try {
      await fetchMonthlyStats(getCurrentYear(), month);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
      setHistory(prev => [...prev, {
        type: 'output',
        content: `Erreur: ${errorMsg}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatsYear = async () => {
    setIsProcessing(true);
    try {
      await fetchYearlyStats(getCurrentYear());
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
      setHistory(prev => [...prev, {
        type: 'output',
        content: `Erreur: ${errorMsg}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setHistory([]);
  };

  const commands = createCommandHandler(handleStatsMonth, handleStatsYear, handleClear);

  const handleCommand = async (input: string) => {
    // Ajouter la commande à l'historique
    setHistory(prev => [...prev, {
      type: 'command',
      content: input,
      timestamp: new Date(),
    }]);

    // Exécuter la commande
    const result = await executeCommand(input, commands);
    
    if (result) {
      setHistory(prev => [...prev, {
        type: 'output',
        content: result,
        timestamp: new Date(),
      }]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-6 terminal-bg scanlines"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <AnimatePresence>
          {history.map((item, index) => (
            <div key={index} className="mb-2">
              {item.type === 'command' ? (
                <div className="flex items-center gap-2">
                  <span className="text-terminal-green font-mono">
                    github-wrapped@user:~$
                  </span>
                  <span className="text-terminal-cyan font-mono">{item.content}</span>
                </div>
              ) : (
                <TerminalOutput content={item.content} />
              )}
            </div>
          ))}
        </AnimatePresence>

        {/* Afficher les stats mensuelles si disponibles */}
        {monthlyStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <MonthlyStats stats={monthlyStats} />
          </motion.div>
        )}

        {/* Afficher les stats annuelles si disponibles */}
        {yearlyStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4"
          >
            <YearlyStats stats={yearlyStats} />
          </motion.div>
        )}

        {isProcessing && (
          <div className="text-terminal-cyan font-mono text-sm">
            Traitement en cours...
          </div>
        )}
      </div>

      <div className="border-t border-terminal-green/20 p-4 bg-terminal-bg/50">
        <TerminalInput
          prompt="github-wrapped@user:~$"
          onCommand={handleCommand}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

