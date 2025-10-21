import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api';
import type { AuthContextType } from '../types';
import { LoadingIcon, CheckIcon } from './icons/IconComponents';

const NotificationCreator: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { users } = auth;

    const [target, setTarget] = useState<'all' | 'single'>('all');
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setError('');

        try {
            const targets = target === 'all' ? users.map(u => u.id) : [userId];
            if (targets.length === 0 || !targets[0]) {
                throw new Error("No user selected.");
            }

            for (const id of targets) {
                 await api.sendNotification({
                    userId: id,
                    title,
                    message,
                    link: link || undefined,
                });
            }
            
            setStatus('success');
            setTitle('');
            setMessage('');
            setLink('');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to send notification(s).");
            setStatus('error');
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-white mb-4">Send Notification</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Target</label>
                    <select value={target} onChange={e => setTarget(e.target.value as any)} className="bg-black/30 rounded-md border-white/20 text-white w-full">
                        <option value="all">All Users ({users.length})</option>
                        <option value="single">Single User</option>
                    </select>
                </div>
                {target === 'single' && (
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Select User</label>
                        <select value={userId} onChange={e => setUserId(e.target.value)} required className="bg-black/30 rounded-md border-white/20 text-white w-full">
                            <option value="">-- Select a User --</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                        </select>
                    </div>
                )}
                <div>
                    <label htmlFor="notif-title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input id="notif-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-black/30 rounded-md border-white/20 text-white" />
                </div>
                <div>
                    <label htmlFor="notif-message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                    <textarea id="notif-message" value={message} onChange={e => setMessage(e.target.value)} required rows={3} className="w-full bg-black/30 rounded-md border-white/20 text-white" />
                </div>
                <div>
                    <label htmlFor="notif-link" className="block text-sm font-medium text-gray-300 mb-1">Link (Optional)</label>
                    <input id="notif-link" type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full bg-black/30 rounded-md border-white/20 text-white" />
                </div>

                <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-primary/80 disabled:opacity-50">
                    {status === 'loading' ? <LoadingIcon className="animate-spin h-5 w-5" /> : (status === 'success' ? <CheckIcon className="h-5 w-5" /> : 'Send Notification')}
                </button>
                 {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                 {status === 'success' && <p className="text-green-400 text-sm text-center">Notification(s) sent successfully!</p>}
            </form>
        </div>
    );
};

export default NotificationCreator;
