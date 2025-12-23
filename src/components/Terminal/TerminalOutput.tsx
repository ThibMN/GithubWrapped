import React from 'react';
import { motion } from 'framer-motion';

interface TerminalOutputProps {
  content: string;
  isCommand?: boolean;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ content, isCommand = false }) => {
  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-2 ${isCommand ? 'text-terminal-cyan' : 'text-terminal-green'}`}
    >
      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
        {content}
      </pre>
    </motion.div>
  );
};

