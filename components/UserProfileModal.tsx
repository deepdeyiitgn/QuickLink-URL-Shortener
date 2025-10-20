// components/UserProfileModal.tsx
import React from 'react';
import type { User } from '../types';
import { XIcon } from './icons/IconComponents';
import TimeLeft from './TimeLeft';

interface UserProfileModalProps {
    user: User;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-lg glass-card rounded-2xl p-8" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><XIcon className="h-6 w-6" /></button>
                <div className="flex items-center gap-4 mb-6">
                    {user.profilePictureUrl ? (
                        <img src={user.profilePictureUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover border-2 border-brand-primary" />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-brand-secondary flex items-center justify-center text-3xl font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>
                <div className="space-y-4 text-sm">
                    <div className="bg-black/20 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-300 mb-1">Subscription Details</h3>
                        {user.subscription ? (
                            <>
                                <p>Plan: <span className="font-mono text-brand-primary capitalize">{user.subscription.planId}</span></p>
                                <p>Expires: <TimeLeft expiryDate={user.subscription.expiresAt} /></p>
                            </>
                        ) : <p className="text-gray-500">No active web subscription.</p>}
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-300 mb-1">API Access</h3>
                         {user.apiAccess ? (
                            <>
                                <p>Plan: <span className="font-mono text-brand-primary capitalize">{user.apiAccess.subscription.planId}</span></p>
                                <p>Expires: <TimeLeft expiryDate={user.apiAccess.subscription.expiresAt} /></p>
                            </>
                        ) : <p className="text-gray-500">No API access.</p>}
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg">
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
