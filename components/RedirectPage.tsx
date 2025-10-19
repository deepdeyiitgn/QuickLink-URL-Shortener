import React, { useEffect, useState } from 'react';
import { LoadingIcon } from './icons/IconComponents';
import SocialLinks from './SocialLinks';

interface RedirectPageProps {
    longUrl: string;
    shortUrl: string;
}

const RedirectPage: React.FC<RedirectPageProps> = ({ longUrl, shortUrl }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        const redirectTimeout = setTimeout(() => {
            window.location.replace(longUrl);
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimeout);
        };
    }, [longUrl]);

    const handleRedirectNow = () => {
        window.location.replace(longUrl);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark text-white p-4 text-center">
            <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Redirecting you...</h1>
            <p className="text-gray-400 mb-6 max-w-md">
                You are being redirected from <span className="font-mono text-brand-primary break-all">{shortUrl}</span>.
            </p>

            <div className="w-full max-w-lg glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
                <p className="text-center text-sm font-semibold text-gray-400 select-none">
                    <span className="animate-aurora">Made with 🩷 Deep | Helped by Google Gemini 💙 | We Are Here 🧿</span>
                </p>
                <p className="text-xs text-gray-500 my-4">This free service is brought to you by Deep Dey. Connect below:</p>
                <SocialLinks />
            </div>
            
            <button
                onClick={handleRedirectNow}
                className="mt-8 px-6 py-3 bg-brand-primary text-brand-dark font-semibold rounded-md hover:bg-brand-primary/80 transition-all shadow-[0_0_10px_#00e5ff]"
            >
                Redirecting in {countdown}... (Click to go now)
            </button>
        </div>
    );
};

export default RedirectPage;