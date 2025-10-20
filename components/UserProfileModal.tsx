// components/UserProfileModal.tsx
import React, { useContext, useState } from 'react';
import { User, AuthContextType, UrlContextType } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import { XIcon, TrashIcon, LoadingIcon, CheckIcon } from './icons/IconComponents';
import TimeLeft from './TimeLeft';

interface UserProfileModalProps {
    user: User;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
    const auth = useContext(AuthContext) as AuthContextType;
    const urlContext = useContext(UrlContext) as UrlContextType;

    const [subDays, setSubDays] = useState(30);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Admins should see all user data, including links
    const userUrls = urlContext.allUrls.filter(u => u.userId === user.id);

    const handleGrantSubscription = async () => {
        setIsUpdating(true);
        setIsSuccess(false);
        try {
            const expiresAt = Date.now() + (subDays * 24 * 60 * 60 * 1000);
            await auth.updateUserData(user.id, { 
                subscription: { planId: 'monthly', expiresAt },
                isDonor: true // Granting a sub also makes them premium
            });
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (e) {
            console.error("Failed to grant subscription", e);
            alert("Failed to grant subscription.");
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handleDeleteUrl = async (urlId: string, alias: string) => {
        if (window.confirm(`Are you sure you want to delete the link /${alias}?`)) {
            try {
                await urlContext.deleteUrl(urlId);
                // The UrlContext provider will handle the state update automatically
            } catch (e) {
                console.error("Failed to delete URL", e);
                alert("Failed to delete URL.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-2xl glass-card rounded-2xl p-6 my-8" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><XIcon className="h-6 w-6" /></button>
                
                <div className="flex items-center gap-4 mb-6">
                     {user.profilePictureUrl ? (
                        <img src={user.profilePictureUrl} alt={user.name} className="h-16 w-16 rounded-full object-cover border-2 border-brand-primary" />
                    ) : (
                        <div className="h-16 w-16 rounded-full bg-brand-secondary flex items-center justify-center text-3xl font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                     {/* Admin Actions Section */}
                    <div className="bg-black/30 p-4 rounded-lg border border-brand-secondary/30">
                        <h3 className="font-semibold text-brand-secondary mb-3">Admin Actions</h3>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <label htmlFor="sub-days" className="text-sm text-gray-300 whitespace-nowrap">Grant Subscription for</label>
                            <input
                                id="sub-days"
                                type="number"
                                value={subDays}
                                onChange={e => setSubDays(parseInt(e.target.value, 10) || 0)}
                                className="w-24 bg-black/40 rounded-md border-white/20 text-white focus:ring-brand-primary"
                            />
                            <span className="text-sm text-gray-300">days</span>
                             <button onClick={handleGrantSubscription} disabled={isUpdating} className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 ml-auto px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80 disabled:opacity-50">
                                {isUpdating ? <LoadingIcon className="h-4 w-4 animate-spin" /> : (isSuccess ? <CheckIcon className="h-4 w-4" /> : 'Grant')}
                            </button>
                        </div>
                    </div>
                    
                    {/* User Links Section */}
                    <div className="bg-black/30 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-300 mb-3">User's Short Links ({userUrls.length})</h3>
                        {userUrls.length > 0 ? (
                            <div className="space-y-2">
                                {userUrls.map(url => (
                                    <div key={url.id} className="flex items-center justify-between gap-4 bg-black/40 p-2 rounded-md">
                                        <div>
                                            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-brand-primary hover:underline">{url.shortUrl}</a>
                                            <p className="text-xs text-gray-500 truncate max-w-xs sm:max-w-md">{url.longUrl}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-gray-400 whitespace-nowrap"><TimeLeft expiryDate={url.expiresAt} /></span>
                                            <button onClick={() => handleDeleteUrl(url.id, url.alias)} title="Delete Link" className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-500/10">
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">This user has not created any links yet.</p>
                        )}
                    </div>

                    <div className="bg-black/30 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-300 mb-1">Subscription Details</h3>
                        {user.subscription ? (
                            <>
                                <p>Plan: <span className="font-mono text-brand-primary capitalize">{user.subscription.planId}</span></p>
                                <p>Expires: <TimeLeft expiryDate={user.subscription.expiresAt} /></p>
                            </>
                        ) : <p className="text-gray-500">No active web subscription.</p>}
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-300 mb-1">API Access</h3>
                         {user.apiAccess ? (
                            <>
                                <p>Plan: <span className="font-mono text-brand-primary capitalize">{user.apiAccess.subscription.planId}</span></p>
                                <p>Expires: <TimeLeft expiryDate={user.apiAccess.subscription.expiresAt} /></p>
                            </>
                        ) : <p className="text-gray-500">No API access.</p>}
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-300 mb-1">User Info</h3>
                        <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p>Last Active: {new Date(user.lastActive).toLocaleString()}</p>
                        <p>Is Donor: <span className={user.isDonor ? 'text-green-400' : 'text-gray-500'}>{user.isDonor ? 'Yes' : 'No'}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;