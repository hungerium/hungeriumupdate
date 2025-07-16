'use client';

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#101c3a]">
          <div className="text-center">
            <h2 className="text-2xl text-[#FFD700] mb-4">Oops! Something went wrong.</h2>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#1e90ff] text-white px-4 py-2 rounded-lg hover:bg-[#00bfff]"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
