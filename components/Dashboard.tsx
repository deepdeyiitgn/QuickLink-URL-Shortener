import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import { ShortenedUrl } from '../types';
import { LinkIcon, WarningIcon } from './icons/IconComponents';
import SubscriptionStatus from './SubscriptionStatus';
import TimeLeft from './TimeLeft';

const Dashboard: React.FC = () => {
    const auth = useContext(AuthContext);
    const urlContext = useContext(UrlContext);
    const [userUrls, setUserUrls] = useState<ShortenedUrl[]>([]);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (auth?.currentUser && urlContext?.activeUrls) {
            const allUrls = urlContext.activeUrls;
            const filteredUrls = allUrls.filter(url => url.userId === auth.currentUser?.id);
            setUserUrls(filteredUrls.sort((a, b) => b.createdAt - a.createdAt));
        }
    }, [auth?.currentUser, urlContext?.activeUrls]);
    
    const filteredUrls = useMemo(() => {
        return userUrls.filter(url => 
            url.longUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
            url.alias.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [userUrls, searchTerm]);

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };
    
    const handleThresholdChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newThreshold = parseInt(e.target.value, 10);
        if (auth?.updateUserSettings) {
            await auth.updateUserSettings({ warningThreshold: newThreshold });
        }
    };

    if (!auth?.currentUser) {
        return <div className="text-center text-gray-400">Please log in to see your dashboard.</div>;
    }
    
    const currentThreshold = auth.currentUser.settings?.warningThreshold || 24;

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
            <SubscriptionStatus />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-white">Your Links</h2>
                <div className="flex w-full sm:w-auto items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search links..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full sm:w-48 rounded-md border-0 bg-black/30 py-1.5 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm"
                    />
                    <div className="flex items-center gap-2">
                        <label htmlFor="warning-threshold" className="text-sm text-gray-400 whitespace-nowrap">Warn before:</label>
                        <select
                            id="warning-threshold"
                            value={currentThreshold}
                            onChange={handleThresholdChange}
                            className="block w-full rounded-md border-0 bg-black/30 py-1.5 pl-3 pr-8 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm"
                        >
                            <option value={6}>6 Hours</option>
                            <option value={12}>12 Hours</option>
                            <option value={24}>24 Hours</option>
                            <option value={48}>48 Hours</option>
                            <option value={72}>72 Hours</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {filteredUrls.length === 0 ? (
                <p className="text-center text-gray-400 py-8">{searchTerm ? 'No links match your search.' : "You haven't created any links yet."}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-black/20">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Original URL</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Short Link</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Expires In</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredUrls.map(url => {
                                const now = Date.now();
                                const thresholdMs = currentThreshold * 60 * 60 * 1000;
                                const isExpiringSoon = url.expiresAt !== null && url.expiresAt > now && (url.expiresAt - now < thresholdMs);

                                return (
                                    <tr key={url.id} className={isExpiringSoon ? "bg-yellow-500/10" : ""}>
                                        <td id={`url-original-${url.id}`} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-300 sm:pl-6">
                                            <div className="flex items-center gap-2">
                                                <LinkIcon className="h-4 w-4 text-gray-500" />
                                                <a href={url.longUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary truncate max-w-xs">{url.longUrl}</a>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-mono text-brand-primary">
                                            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{url.shortUrl}</a>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <TimeLeft expiryDate={url.expiresAt} />
                                                {isExpiringSoon && (
                                                    <div className="group relative flex items-center">
                                                        <WarningIcon className="h-5 w-5 text-yellow-400" />
                                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-brand-dark text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
                                                            Expires in &lt; {currentThreshold} hours
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-4">
                                            <button
                                                onClick={() => handleCopy(url.shortUrl)}
                                                className="font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors"
                                            >
                                                {copiedUrl === url.shortUrl ? 'Copied!' : 'Copy'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Dashboard;