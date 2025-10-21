import React from 'react';
import { LoadingIcon } from './icons/IconComponents';

const FullScreenLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 gradient-bg flex flex-col items-center justify-center text-white z-[999]">
            <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary mb-4" />
            <p className="text-xl font-semibold animate-pulse">Loading QuickLink...</p>
        </div>
    );
};

export default FullScreenLoader;
