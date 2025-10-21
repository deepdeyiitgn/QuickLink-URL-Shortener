import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UrlContext } from '../contexts/UrlContext';
import { ShortenedUrl } from '../types';
import { LoadingIcon } from './icons/IconComponents';
import AdComponent from './AdComponent';

const RedirectPage: React.FC = () => {
    const { alias } = useParams<{ alias: string }>();
    const urlContext = useContext(UrlContext);

    const [targetUrl, setTargetUrl] = useState<ShortenedUrl | null | 'not-found'>(null);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!urlContext || !alias) return;

        const findUrl = () => {
            const url = urlContext.allUrls.find(u => u.alias === alias);
            if (url) {
                // Check for expiry
                if (url.expiresAt && url.expiresAt < Date.now()) {
                    setTargetUrl('not-found');
                } else {
                    setTargetUrl(url);
                }
            } else if (!urlContext.loading) {
                // If not loading and still not found, it's a 404
                setTargetUrl('not-found');
            }
        };

        // If URLs are already loaded, find it. Otherwise, wait for loading to finish.
        if (!urlContext.loading) {
            findUrl();
        } else {
            // This component relies on UrlContext being populated. A timeout acts as a fallback.
            const timeout = setTimeout(findUrl, 1500);
            return () => clearTimeout(timeout);
        }

    }, [alias, urlContext]);

    useEffect(() => {
        if (targetUrl && targetUrl !== 'not-found') {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                window.location.href = targetUrl.longUrl;
            }
        }
    }, [targetUrl, countdown]);

    if (targetUrl === null) {
        return (
            <div className="text-center py-20">
                <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary mx-auto" />
                <p className="mt-4 text-gray-400">Finding your link...</p>
            </div>
        );
    }
    
    if (targetUrl === 'not-found') {
         return (
            <div className="text-center py-20 animate-fade-in">
                <h1 className="text-6xl font-bold text-brand-primary animate-aurora">404</h1>
                <h2 className="text-2xl font-semibold text-white mt-4">Link Not Found</h2>
                <p className="text-gray-400 mt-2">
                    The link you are looking for may have expired, been moved, or never existed.
                </p>
                <Link to="/" className="mt-8 inline-block px-6 py-3 bg-brand-primary text-brand-dark font-semibold rounded-md hover:bg-brand-primary/80 transition-all shadow-[0_0_10px_#00e5ff]">
                    Go to Homepage
                </Link>
            </div>
        );
    }
    
    return (
        <div className="text-center py-12 glass-card rounded-2xl animate-fade-in">
            <h2 className="text-3xl font-bold text-white">You are being redirected</h2>
            <p className="text-gray-400 mt-2">Please wait while we securely redirect you to your destination.</p>
            <div className="my-8 text-5xl font-bold text-brand-primary animate-pulse">{countdown}</div>
            <p className="text-xs text-gray-500 break-all px-4">Redirecting to: {targetUrl.longUrl}</p>
            
            <div className="max-w-md mx-auto my-8">
                <AdComponent type="display" />
            </div>

            <Link to="/" className="text-sm text-gray-400 hover:underline">
                Not redirecting? Click here or go back home.
            </Link>
        </div>
    );
};

export default RedirectPage;
