import React from "react";
import { AlertCircle } from "lucide-react";

export class ProjectErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ProjectErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 border border-red-500/20 bg-red-500/10 rounded-xl p-8 text-center mt-6">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-500 mb-2">Something went wrong.</h2>
          <p className="text-sm text-red-400">Failed to render dashboard component.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
