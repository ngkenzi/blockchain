import React from 'react';
import dynamic from 'next/dynamic';
import ErrorBoundary from './ErrorBoundary';

const AvatarPage = dynamic(() => import('./Avatar'), { ssr: false });

function MainComponent() {
    return (
        <ErrorBoundary>
            <AvatarPage />
        </ErrorBoundary>
    );
}

export default MainComponent;
