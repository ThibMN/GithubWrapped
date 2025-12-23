import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RateLimitError } from '../../utils/rateLimitHandler';
import { useAuth } from '../../context/AuthContext';

interface RateLimitWarningProps {
  error: RateLimitError | null;
  onDismiss: () => void;
}

export const RateLimitWarning: React.FC<RateLimitWarningProps> = ({ error, onDismiss }) => {
  const { isAuth } = useAuth();

  if (!error) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4"
      >
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="font-semibold text-yellow-800">Limite de taux API atteinte</h3>
              </div>
              <p className="text-sm text-yellow-700 mb-2">{error.message}</p>
              {!isAuth && (
                <p className="text-xs text-yellow-600">
                  💡 <strong>Astuce:</strong> Connectez-vous avec OAuth GitHub pour passer de 60 à 5000 requêtes/heure
                </p>
              )}
            </div>
            <button
              onClick={onDismiss}
              className="ml-4 text-yellow-600 hover:text-yellow-800"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

