'use client';

import { Component, ReactNode } from 'react';
import { cn, styles } from '@/utils/styles';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || null,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={cn(styles.layout.center, 'min-h-screen bg-red-50 dark:bg-red-950 p-4')}>
          <div className={cn(styles.card.base, styles.card.padding, 'max-w-2xl w-full shadow-lg')}>
            <div className={cn(styles.layout.between, 'mb-4')}>
              <div className={cn(styles.layout.center)}>
                <div className={cn(styles.layout.center, 'w-8 h-8 bg-red-500 rounded-full mr-3')}>
                  <span className="text-white font-bold">!</span>
                </div>
                <h1 className="text-xl font-semibold text-red-800 dark:text-red-200">
                  Something went wrong
                </h1>
              </div>
            </div>

            <p className={cn(styles.text.body, 'mb-4')}>
              The application encountered an error. This error has been logged for debugging.
            </p>

            <button
              onClick={this.handleReset}
              className={cn(styles.button.base, styles.button.primary, 'mb-4')}
            >
              Try Again
            </button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className={cn(styles.text.small, 'cursor-pointer font-medium mb-2')}>
                  Error Details (Development Only)
                </summary>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="mt-1 text-xs overflow-auto whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 text-xs overflow-auto whitespace-pre-wrap">
                        {this.state.errorInfo}
                      </pre>
                    </div>
                  )}
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
