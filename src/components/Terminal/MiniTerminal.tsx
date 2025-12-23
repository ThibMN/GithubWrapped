import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalLog {
  type: 'info' | 'success' | 'error' | 'command';
  message: string;
  timestamp: Date;
}

interface MiniTerminalProps {
  logs: TerminalLog[];
  isProcessing?: boolean;
  inline?: boolean;
}

export const MiniTerminal: React.FC<MiniTerminalProps> = ({ logs, isProcessing = false, inline = false }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: TerminalLog['type']) => {
    switch (type) {
      case 'success':
        return 'text-wrapped-accent';
      case 'error':
        return 'text-red-600';
      case 'command':
        return 'text-wrapped-muted';
      default:
        return 'text-wrapped-text';
    }
  };

  if (inline) {
    return (
      <div className="lg:hidden w-full h-64 bg-white/80 backdrop-blur-md rounded-lg shadow-lg border border-black/10 overflow-hidden flex flex-col mb-6">
        <div className="flex items-center justify-between px-4 py-2 bg-black/5 border-b border-black/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-xs text-wrapped-muted font-mono">Terminal</span>
        </div>
        
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-mono"
        >
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${getLogColor(log.type)}`}
              >
                <span className="text-wrapped-muted">
                  [{log.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                </span>
                {' '}
                <span>{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-wrapped-muted flex items-center gap-2"
            >
              <span className="animate-pulse">●</span>
              <span>Traitement en cours...</span>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-64 bg-white/80 backdrop-blur-md rounded-lg shadow-lg border border-black/10 overflow-hidden flex-col z-50">
      <div className="flex items-center justify-between px-4 py-2 bg-black/5 border-b border-black/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <span className="text-xs text-wrapped-muted font-mono">Terminal</span>
      </div>
      
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-mono"
      >
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${getLogColor(log.type)}`}
            >
              <span className="text-wrapped-muted">
                [{log.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
              </span>
              {' '}
              <span>{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-wrapped-muted flex items-center gap-2"
          >
            <span className="animate-pulse">●</span>
            <span>Traitement en cours...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

