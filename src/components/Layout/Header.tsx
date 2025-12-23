import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full p-4 border-b border-terminal-green/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold terminal-glow">
          <span className="text-terminal-green">Git</span>
          <span className="text-terminal-cyan">hub</span>
          <span className="text-terminal-green">Wrapped</span>
        </h1>
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-8 h-8 rounded-full border border-terminal-green/50"
              />
              <span className="text-terminal-text">{user.login}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 border border-terminal-green/50 hover:bg-terminal-green/10 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

