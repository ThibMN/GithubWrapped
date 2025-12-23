import React, { useState } from 'react';
import { useGitHubAuth } from '../../hooks/useGitHubAuth';
import { OAuthButton } from './OAuthButton';
import { Spinner } from '../Loading/Spinner';
import { BackgroundDecoration } from '../Layout/BackgroundDecoration';
import { Footer } from '../Layout/Footer';

export const AuthSelector: React.FC = () => {
  const [username, setUsername] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const { loginWithUsername, isLoading, error } = useGitHubAuth();

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      await loginWithUsername(username.trim());
    } catch (err) {
      // L'erreur est gérée par le hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-wrapped-bg">
        <Spinner />
        <p className="mt-4 text-wrapped-text">Connexion en cours...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-wrapped-bg px-4 relative">
      <BackgroundDecoration />
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto relative z-10">
        <div className="w-full flex justify-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 text-wrapped-text leading-tight inline-block">
            GithubWrapped
          </h1>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-wrapped-muted mb-8 sm:mb-12 text-center px-4">
          Découvrez vos statistiques GitHub de l'année
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {!showUsernameInput ? (
          <div className="space-y-4 w-full max-w-md px-4">
            <OAuthButton />
            <div className="relative flex items-center my-4 sm:my-6">
              <div className="flex-grow border-t border-wrapped-muted/30"></div>
              <span className="px-4 text-wrapped-muted text-sm">ou</span>
              <div className="flex-grow border-t border-wrapped-muted/30"></div>
            </div>
            <button
              onClick={() => setShowUsernameInput(true)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-wrapped-text text-wrapped-text rounded-full font-semibold text-sm sm:text-base hover:bg-wrapped-text hover:text-wrapped-bg transition-colors"
            >
              Utiliser un nom d'utilisateur
            </button>
          </div>
        ) : (
          <form onSubmit={handleUsernameSubmit} className="space-y-4 w-full max-w-md px-4">
            <div>
              <label htmlFor="username" className="block mb-2 text-wrapped-text font-medium text-sm sm:text-base">
                Nom d'utilisateur GitHub
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="octocat"
                className="w-full px-4 py-3 bg-white border border-wrapped-muted/30 rounded-lg focus:border-wrapped-text focus:outline-none text-wrapped-text text-sm sm:text-base"
                autoFocus
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                className="flex-1 px-4 sm:px-6 py-3 bg-wrapped-text text-wrapped-bg rounded-full font-semibold text-sm sm:text-base hover:bg-wrapped-muted transition-colors"
              >
                Continuer
              </button>
              <button
                type="button"
                onClick={() => setShowUsernameInput(false)}
                className="px-4 sm:px-6 py-3 border-2 border-wrapped-text/30 text-wrapped-muted rounded-full font-semibold text-sm sm:text-base hover:border-wrapped-text hover:text-wrapped-text transition-colors"
              >
                Retour
              </button>
            </div>
          </form>
        )}

        <p className="mt-8 text-xs text-wrapped-muted text-center">
          En utilisant un nom d'utilisateur, seules les données publiques seront accessibles.
          <br />
          L'authentification OAuth permet d'accéder à toutes vos données.
        </p>
      </div>
      <div className="mt-auto w-full">
        <Footer />
      </div>
    </div>
  );
};

