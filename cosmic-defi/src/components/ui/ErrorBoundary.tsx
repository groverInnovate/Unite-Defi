'use client'
import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 bg-crimson-red/20 border border-crimson-red/50 rounded-lg">
          <h2 className="text-lg font-semibold text-crimson-red mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-cosmic-white">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
