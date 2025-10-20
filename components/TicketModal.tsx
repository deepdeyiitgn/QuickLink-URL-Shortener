// FIX: Implemented the TicketModal component to resolve the initialization error.
import React, { useState, useContext } from 'react';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
// FIX: Corrected import path for api
import { api } from '../api';
import { XIcon, LoadingIcon, CheckIcon } from './icons/IconComponents';
import { AuthContextType } from '../types';

interface TicketModalProps {
    onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ onClose }) => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser } = auth || {};

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setError('');

        if (!currentUser) {
            setError('You must be logged in to submit a ticket.');
            setStatus('error');
            return;
        }

        try {
            await api.createTicket({
                userId: currentUser.id,
                userName: currentUser.name,
                userEmail: currentUser.email,
                subject,
                message,
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to submit ticket. Please try again later.');
            setStatus('error');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-lg glass-card rounded-2xl p-8"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <XIcon className="h-6 w-6"/>
                </button>

                <h2 className="text-2xl font-bold text-white mb-4">Submit a Support Ticket</h2>

                {status === 'success' ? (
                    <div className="text-center">
                        <CheckIcon className="h-12 w-12 text-green-500 mx-auto mb-4 animate-check-pop" />
                        <h3 className="text-xl text-white font-semibold">Ticket Submitted!</h3>
                        <p className="text-gray-400 mt-2">Our team will get back to you shortly. Closing this window...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="ticket-subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                            <input 
                                type="text" 
                                id="ticket-subject" 
                                value={subject} 
                                onChange={e => setSubject(e.target.value)} 
                                required 
                                className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary" 
                            />
                        </div>
                        <div>
                            <label htmlFor="ticket-message" className="block text-sm font-medium text-gray-300 mb-1">Describe your issue</label>
                            <textarea 
                                id="ticket-message" 
                                value={message} 
                                onChange={e => setMessage(e.target.value)} 
                                required 
                                rows={5}
                                className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary"
                            />
                        </div>
                        
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                        <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 disabled:opacity-50 transition-all">
                            {status === 'loading' ? <LoadingIcon className="animate-spin h-5 w-5" /> : 'Submit Ticket'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TicketModal;
