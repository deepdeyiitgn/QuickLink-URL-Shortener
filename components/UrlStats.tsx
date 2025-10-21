import React, { useContext } from 'react';
import { UrlContext } from '../contexts/UrlContext';
import { LoadingIcon } from './icons/IconComponents';

const UrlStats: React.FC = () => {
    const urlContext = useContext(UrlContext);
    
    if (urlContext?.loading) {
        return (
             <div className="text-center my-8 h-8 flex items-center justify-center">
                <LoadingIcon className="animate-spin h-6 w-6 text-gray-500" />
             </div>
        )
    }

    const count = urlContext?.activeUrls.length ?? 0;

    return (
        <div className="text-center my-8 animate-fade-in">
            <p className="text-lg text-gray-400">
                Join <span className="font-bold text-2xl text-brand-primary animate-aurora">{count.toLocaleString()}</span> active links shortened globally!
            </p>
        </div>
    );
};

export default UrlStats;