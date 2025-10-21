import React from 'react';
import type { User } from '../types';
import { XIcon } from './icons/IconComponents';
import { getUserBadge } from '../utils/userHelper';
import BlogUserBadge from './BlogUserBadge';

interface UserProfileModalProps {
    user: User;
    onClose: () => void;
}

const Detail: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
        <p className="text-gray-200">{value}</p>
    </div>
);

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
    const badge = getUserBadge(user);
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-lg glass-card rounded-2xl p-8" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <XIcon className="h-6 w-6" />
                </button>
                
                <div className="flex items-center gap-4 mb-6">
                    {user.profilePictureUrl ? (
                         <img src={user.profilePictureUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover border-2 border-brand-primary" />
                    ) : (
                        <div className="h-20 w-20 bg-brand-secondary rounded-full flex items-center justify-center font-bold text-white text-4xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            {user.name} <BlogUserBadge badge={badge} />
                        </h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <Detail label="User ID" value={<code className="text-xs">{user.id}</code>} />
                        <Detail label="Status" value={<span className={`font-semibold ${user.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>{user.status}</span>} />
                        <Detail label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
                        <Detail label="Last Active" value={new Date(user.lastActive).toLocaleString()} />
                    </div>

                    <div className="pt-2 border-t border-white/10">
                        <h3 className="text-gray-400 font-semibold mb-2 text-sm">Security & Analytics</h3>
                        {user.ipAddress ? (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <Detail label="Last IP Address" value={user.ipAddress} />
                                <Detail label="Device/Browser" value={`${user.deviceType} / ${user.browser}`} />
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No session details recorded yet.</p>
                        )}
                    </div>
                    
                    <div className="pt-2 border-t border-white/10">
                        <h3 className="text-gray-400 font-semibold mb-2 text-sm">Subscription</h3>
                        {user.subscription ? (
                             <Detail label={user.subscription.planId} value={`Expires on ${new Date(user.subscription.expiresAt).toLocaleDateString()}`} />
                        ) : (
                            <p className="text-gray-500 text-sm">No active subscription.</p>
                        )}
                    </div>

                     <div className="pt-2 border-t border-white/10">
                        <h3 className="text-gray-400 font-semibold mb-2 text-sm">API Access</h3>
                        {user.apiAccess ? (
                             <Detail label={user.apiAccess.subscription.planId} value={`Expires on ${new Date(user.apiAccess.subscription.expiresAt).toLocaleDateString()}`} />
                        ) : (
                            <p className="text-gray-500 text-sm">No API key generated.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
