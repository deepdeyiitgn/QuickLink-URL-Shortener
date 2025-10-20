// components/UserProfileModal.tsx
import React, { useState, useContext } from 'react';
import type { User, AuthContextType, ApiSubscription } from '../types';
import { XIcon, LoadingIcon } from './icons/IconComponents';
import TimeLeft from './TimeLeft';
import { AuthContext } from '../contexts/AuthContext';

interface UserProfileModalProps {
    user: User;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, updateUserData } = auth || {};

    const [permCredits, setPermCredits] = useState(user.urlCredits?.permanent || 0);
    const [apiPlan, setApiPlan] = useState<ApiSubscription['planId']>('trial');
    const [apiDuration, setApiDuration] = useState(1); // in months
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [error, setError] = useState('');

    const isAdmin = currentUser?.isAdmin;

    const handleSaveCredits = async () => {
        if (!updateUserData) return;
        setIsSaving('credits');
        setError('');
        try {
            await updateUserData(user.id, { urlCredits: { permanent: permCredits } });
            alert('Credits updated successfully!');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSaving(null);
        }
    };

    const handleGrantApi = async () => {
        if (!updateUserData) return;
        setIsSaving('api');
        setError('');
        try {
            const apiKey = user.apiAccess?.apiKey || `qk_prod_${Date.now().toString(36)}`;
            let expiresAt;
            if (apiPlan === 'permanent') {
                // Set a far-future date for permanent access, effectively making it non-expiring.
                expiresAt = new Date('2099-12-31').getTime(); 
            } else {
                expiresAt = Date.now() + apiDuration * 30 * 24 * 60 * 60 * 1000;
            }
            
            await updateUserData(user.id, {
                apiAccess: {
                    apiKey,
                    subscription: { planId: apiPlan, expiresAt }
                }
            });
            alert('API access granted successfully! The user profile will update on their next login.');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsSaving(null);
        }
    };


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
                        <p>URL Credits: <span className="text-brand-primary font-semibold">{user.urlCredits?.permanent || 0}</span></p>
                    </div>
                </div>

                {isAdmin && user.id !== currentUser.id && (
                    <div className="mt-6 pt-6 border-t border-white/20 space-y-4">
                        <h3 className="text-xl font-bold text-brand-secondary">Admin Management</h3>
                        
                        <div className="bg-black/20 p-3 rounded-lg">
                            <label htmlFor="perm-credits" className="font-semibold text-gray-300 mb-1 block">Permanent URL Credits</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    id="perm-credits"
                                    value={permCredits}
                                    onChange={e => setPermCredits(Math.max(0, parseInt(e.target.value, 10)) || 0)}
                                    className="block w-full rounded-md border-0 bg-black/50 py-1.5 px-2 text-brand-light ring-1 ring-inset ring-white/20"
                                />
                                <button onClick={handleSaveCredits} disabled={isSaving === 'credits'} className="px-4 py-1.5 text-sm bg-brand-primary text-brand-dark rounded-md hover:bg-brand-primary/80 disabled:opacity-50 w-20 flex justify-center">
                                    {isSaving === 'credits' ? <LoadingIcon className="h-4 w-4 animate-spin"/> : 'Save'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-black/20 p-3 rounded-lg">
                            <label className="font-semibold text-gray-300 mb-1 block">Grant API Access</label>
                            <div className="flex flex-wrap items-center gap-2">
                                <select value={apiPlan} onChange={e => setApiPlan(e.target.value as any)} className="bg-black/50 rounded-md border-white/20 text-white focus:ring-brand-primary">
                                    <option value="trial">Trial</option>
                                    <option value="basic">Basic</option>
                                    <option value="pro">Pro</option>
                                    <option value="permanent">Permanent</option>
                                </select>
                                {apiPlan !== 'permanent' && (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            value={apiDuration}
                                            onChange={e => setApiDuration(Math.max(1, parseInt(e.target.value, 10)) || 1)}
                                            min="1"
                                            className="w-20 bg-black/50 rounded-md border-white/20 text-white focus:ring-brand-primary"
                                        />
                                        <span className="text-gray-400 text-sm">months</span>
                                    </div>
                                )}
                                <button onClick={handleGrantApi} disabled={isSaving === 'api'} className="px-4 py-1.5 text-sm bg-brand-primary text-brand-dark rounded-md hover:bg-brand-primary/80 disabled:opacity-50 w-20 flex justify-center">
                                    {isSaving === 'api' ? <LoadingIcon className="h-4 w-4 animate-spin"/> : 'Grant'}
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-400 text-center mt-2">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileModal;