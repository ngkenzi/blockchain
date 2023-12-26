import React from 'react';
import { ClipLoader } from 'react-spinners';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Caught an error:', error, errorInfo);
    }

    componentDidUpdate() {
        if (this.state.hasError) {
            setTimeout(() => window.location.reload(), 3000);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <ClipLoader color="#4A90E2" size={150} />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
