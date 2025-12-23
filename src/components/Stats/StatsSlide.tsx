import React from 'react';
import { motion } from 'framer-motion';

interface StatsSlideProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
}

export const StatsSlide: React.FC<StatsSlideProps> = ({ 
  title, 
  subtitle, 
  children, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="text-center mb-6 sm:mb-12 px-4"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-wrapped-muted mb-3 sm:mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg sm:text-xl md:text-2xl text-wrapped-muted">
            {subtitle}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
        className="w-full max-w-4xl px-4"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

