import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-wrapped-text/20 border-t-wrapped-text rounded-full animate-spin"></div>
    </div>
  );
};

