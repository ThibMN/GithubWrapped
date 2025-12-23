import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full p-6 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-wrapped-muted text-sm">
          par{' '}
          <a
            href="https://github.com/ThibMN"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-wrapped-text hover:text-wrapped-accent transition-colors underline decoration-1 underline-offset-2"
          >
            Thibaud Mineau
          </a>
        </p>
        <p className="mt-2 text-wrapped-muted text-xs">
          Créé avec <span className="text-red-500">❤</span> pour les développeurs
        </p>
      </div>
    </footer>
  );
};

