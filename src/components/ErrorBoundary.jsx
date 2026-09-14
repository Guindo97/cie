import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour afficher l'UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur pour le debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personnalisée
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">😅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Oups ! Une erreur s'est produite
            </h2>
            <p className="text-gray-600 mb-6">
              Désolé, quelque chose s'est mal passé. Ne vous inquiétez pas, vos données sont en sécurité.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-300 font-medium"
              >
                🔄 Recharger la page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium"
              >
                🔙 Réessayer
              </button>
            </div>
            
            {/* Détails de l'erreur en mode développement */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Détails techniques (développement)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-600 overflow-auto max-h-32">
                  <strong>Erreur:</strong> {this.state.error.toString()}
                  <br />
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


