import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur non gérée:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center terminal-bg">
          <div className="max-w-md p-8 border border-red-500/50 bg-terminal-bg/50">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Erreur</h2>
            <p className="text-terminal-text mb-4">
              Une erreur inattendue s'est produite.
            </p>
            {this.state.error && (
              <pre className="text-xs text-terminal-text/60 mb-4 overflow-auto">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-terminal-green/50 hover:bg-terminal-green/10 transition-colors text-terminal-green"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

