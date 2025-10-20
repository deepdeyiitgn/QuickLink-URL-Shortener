import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api';
import { AuthContextType } from '../types';
import { LoadingIcon, CheckIcon } from './icons/IconComponents';

const NotificationCreator: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const [targetUser, setTargetUser] = useState<'all' | string>('all');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Message cannot be empty.');
            return;
        }
        setStatus('loading');
        setError('');
        try {
            await api.createCustomNotification(targetUser, message);
            setStatus('success');
            setMessage('');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to send notification.');
            setStatus('error');
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-white mb-4">Send a Notification</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="targetUser" className="block text-sm font-medium text-gray-300 mb-2">Recipient</label>
                    <select
                        id="targetUser"
                        value={targetUser}
                        onChange={e => setTargetUser(e.target.value)}
                        className="block w-full rounded-md border-0 bg-black/30 py-2.5 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm"
                    >
                        <option value="all">All Users</option>
                        {auth.users
                            .filter(u => !u.isAdmin)
                            .map(user => (
                            <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={4}
                        required
                        className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm"
                    />
                </div>
                 <button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto flex justify-center items-center gap-2 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-brand-dark shadow-sm hover:bg-brand-primary/80 disabled:opacity-50">
                    {status === 'loading' && <LoadingIcon className="animate-spin h-5 w-5" />}
                    {status === 'success' && <CheckIcon className="h-5 w-5" />}
                    {status === 'success' ? 'Notification Sent!' : 'Send Notification'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default NotificationCreator;