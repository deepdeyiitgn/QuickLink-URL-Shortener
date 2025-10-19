import React, { useContext } from 'react';
import { UrlContext } from '../contexts/UrlContext';
import { timeAgo } from '../utils/time';

const RecentLinks: React.FC = () => {
    const urlContext = useContext(UrlContext);
    
    // Sort active URLs by creation date (newest first) and take the top 10
    const recentUrls = (urlContext?.activeUrls ?? [])
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 10);

    if (urlContext?.loading || recentUrls.length === 0) {
        return null; // Don't show anything while loading or if there are no links
    }

    return (
        <div className="mt-16 glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
            <h3 className="text-2xl font-bold text-brand-primary mb-6 text-center">Recently Created Links</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="text-gray-400">
                        <tr>
                            <th className="text-left font-semibold p-2">Short Link</th>
                            <th className="text-left font-semibold p-2 hidden sm:table-cell">Original URL</th>
                            <th className="text-right font-semibold p-2">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {recentUrls.map(url => (
                            <tr key={url.id} className="text-gray-300">
                                <td className="p-2 font-mono">
                                    <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">{url.alias}</a>
                                </td>
                                <td className="p-2 max-w-xs truncate hidden sm:table-cell">
                                    <a href={url.longUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-light">{url.longUrl}</a>
                                </td>
                                <td className="p-2 text-right text-gray-500 whitespace-nowrap">
                                    {timeAgo(url.createdAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentLinks;