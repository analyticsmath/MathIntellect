import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  chartName?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ChartErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    void error;
    void info;
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center gap-3 py-10 text-center animate-fade-in">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}
          >
            <span className="text-xl">📉</span>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: '#8892a4' }}>
              {this.props.chartName ?? 'Chart'} could not be rendered
            </p>
            <p className="text-xs mt-1 max-w-xs" style={{ color: '#4d5a70' }}>
              {this.state.message}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            className="text-xs underline transition-colors"
            style={{ color: '#8b7cf8' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#a89eff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#8b7cf8'; }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
