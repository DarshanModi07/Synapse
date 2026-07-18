import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400">
                    <div className="bg-[#13111C] border border-red-500/20 rounded-xl p-8 max-w-md w-full text-center flex flex-col items-center">
                        <div className="p-3 bg-red-500/10 rounded-full mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Something went wrong.</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            We encountered an unexpected error while rendering this page.
                        </p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-[#2D2B45] hover:bg-[#3D3B55] text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
