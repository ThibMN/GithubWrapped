import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GitHubUser } from '../types/github';
import { getUser } from '../services/githubApi';
import { clearAccessToken, isAuthenticated } from '../services/authService';

interface AuthContextType {
  user: GitHubUser | null;
  username: string | null;
  isLoading: boolean;
  isAuth: boolean;
  setUser: (user: GitHubUser | null) => void;
  setUsername: (username: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = await getUser();
          setUser(userData);
          setUsername(userData.login);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error);
        clearAccessToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    clearAccessToken();
    setUser(null);
    setUsername(null);
  };

  const value: AuthContextType = {
    user,
    username,
    isLoading,
    isAuth: isAuthenticated(),
    setUser,
    setUsername,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

