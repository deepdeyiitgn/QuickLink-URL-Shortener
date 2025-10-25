import React, { useState, useContext, useEffect } from 'react';
import { UrlContext } from '../contexts/UrlContext';
import { AuthContext } from '../contexts/AuthContext';
import { CopyIcon, CheckIcon, LoadingIcon, LinkIcon } from './icons/IconComponents';
import { ShortenedUrl } from '../types';
import ShareButtons from './ShareButtons';

const UrlShortener: React.FC = () => {
    const urlContext = useContext(UrlContext);
    const auth = useContext(AuthContext);
    const { currentUser } = auth || {};

    const [longUrl, setLongUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [expiryDays, setExpiryDays] = useState(1);
    const [domain, setDomain] = useState('');

    useEffect(() => {
        // Set domain on component mount to avoid SSR issues
        setDomain(window.location.host);
    }, []);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.canSetCustomExpiry) {
                 setExpiryDays(0); // Represents permanent
            } else if (currentUser.subscription && currentUser.subscription.expiresAt > Date.now()) {
                setExpiryDays(365); // Premium user
            } else {
                setExpiryDays(7); // Registered user
            }
        } else {
            setExpiryDays(1); // Anonymous user
        }
    }, [currentUser]);

    const handleCopy = () => {
        if (shortenedUrl) {
            navigator.clipboard.writeText(shortenedUrl.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShortenedUrl(null);

        if (!urlContext) {
            setError('URL context is not available.');
            setLoading(false);
            return;
        }

        if (!/^(https?:\/\/)/i.test(longUrl)) {
            setError('Please enter a valid URL (e.g., https://example.com)');
            setLoading(false);
            return;
        }

        try {
            const finalAlias = alias.trim() || undefined; // Send undefined if empty
            
            const newUrl = await urlContext.addUrl({
                longUrl,
                alias: finalAlias,
                userId: currentUser?.id || null,
            });

            setShortenedUrl(newUrl);
            setLongUrl('');
            setAlias('');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const getExpiryMessage = () => {
        if (expiryDays === 0) return 'Links created by you are permanent.';
        if (expiryDays === 365) return `Your premium links will last for up to ${expiryDays} days.`;
        if (expiryDays === 7) return `Your links will last for ${expiryDays} days.`;
        return `Links created anonymously last for 24 hours. Sign up for 7-day links.`;
    };

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
            <form onSubmit={handleSubmit}>
                <div className="relative mb-4">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                        type="url"
                        value={longUrl}
                        onChange={e => setLongUrl(e.target.value)}
                        placeholder="Enter Long URL"
                        required
                        className="w-full bg-black/30 rounded-md border-white/20 text-white pl-11 py-3 focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 bg-black/30 rounded-md border border-white/20 focus-within:ring-2 focus-within:ring-brand-primary flex flex-col sm:flex-row items-stretch">
                        <span className="pl-3 py-3 text-gray-500 bg-black/20 sm:bg-transparent rounded-t-md sm:rounded-l-md sm:rounded-t-none flex items-center">
                            {domain}/
                        </span>
                        <input
                            type="text"
                            value={alias}
                            onChange={e => setAlias(e.target.value.replace(/\s/g, '-'))}
                            placeholder="custom-alias"
                            className="w-full bg-transparent text-white py-3 sm:py-0 pl-3 sm:pl-1 focus:ring-0 border-none rounded-b-md sm:rounded-r-md sm:rounded-b-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 disabled:opacity-50 transition-all"
                    >
                        {loading ? <LoadingIcon className="animate-spin h-5 w-5" /> : 'Generate Short URL'}
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-3">{getExpiryMessage()}</p>
            </form>

            {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

            {shortenedUrl && (
                <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
                    <p className="text-sm text-center text-gray-300 mb-2">Your short link is ready!</p>
                    <div className="flex items-center gap-2 bg-black/40 p-3 rounded-md">
                        <a href={shortenedUrl.shortUrl} target="_blank" rel="noopener noreferrer" className="flex-grow font-mono text-brand-primary hover:underline truncate">
                            {shortenedUrl.shortUrl.replace(/^https?:\/\//, '')}
                        </a>
                        <button onClick={handleCopy} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 rounded-md hover:bg-white/20">
                            {copied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <CopyIcon className="h-4 w-4" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <ShareButtons shortUrl={shortenedUrl.shortUrl} longUrl={shortenedUrl.longUrl} />
                </div>
            )}
        </div>
    );
};

export default UrlShortener;