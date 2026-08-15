import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Button from './Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#061426] text-white">
          <div className="max-w-md w-full p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                Something went wrong
              </h2>
              <p className="text-xs text-white/60 leading-relaxed">
                An unexpected interface issue occurred. Your clinical data and session remain secure.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                onClick={this.handleReload}
                className="w-full gap-2 justify-center"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Page</span>
              </Button>
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full gap-2 justify-center"
              >
                <Home className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
