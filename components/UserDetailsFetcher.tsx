import React from 'react';
import { LoadingIcon } from './icons/IconComponents';

const UserDetailsFetcher: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-[999]">
            <LoadingIcon className="h-10 w-10 animate-spin text-brand-primary mb-4" />
            <p className="text-lg font-semibold animate-pulse">Finalizing session details...</p>
        </div>
    );
};

export default UserDetailsFetcher;
