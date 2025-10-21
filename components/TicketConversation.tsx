import React, { useState, useContext } from 'react';
import { Ticket, AuthContextType } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api';
import { timeAgo } from '../utils/time';
import { LoadingIcon } from './icons/IconComponents';

interface TicketConversationProps {
    ticket: Ticket;
    onBack: () => void;
    onUpdate: (updatedTicket: Ticket) => void;
    isAdminView: boolean;
}

const TICKET_STATUS_STYLES: Record<Ticket['status'], string> = {
    open: 'bg-green-500/20 text-green-300',
    'in-progress': 'bg-blue-500/20 text-blue-300',
    closed: 'bg-red-500/20 text-red-300',
};

const TicketConversation: React.FC<TicketConversationProps> = ({ ticket, onBack, onUpdate, isAdminView }) => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser } = auth;
    const [reply, setReply] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !currentUser) return;
        setIsLoading(true);
        try {
            const updatedTicket = await api.updateTicket(ticket.id, {
                action: 'add_reply',
                userId: currentUser.id,
                message: reply,
            });
            onUpdate(updatedTicket);
            setReply('');
        } catch (error) {
            console.error("Failed to add reply", error);
            alert('Failed to send reply.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeStatus = async (newStatus: Ticket['status']) => {
        if (!currentUser) return;
        try {
            const updatedTicket = await api.updateTicket(ticket.id, {
                action: 'change_status',
                userId: currentUser.id,
                newStatus,
            });
            onUpdate(updatedTicket);
        } catch (error) {
             console.error("Failed to change status", error);
             alert('Failed to change status.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <button onClick={onBack} className="text-sm text-brand-primary hover:underline mb-2">&larr; Back to Tickets</button>
                    <h3 className="text-xl font-bold text-white">{ticket.subject}</h3>
                    <p className="text-xs text-gray-400">From: {ticket.userName} ({ticket.userEmail})</p>
                </div>
                {isAdminView ? (
                    <select value={ticket.status} onChange={e => handleChangeStatus(e.target.value as any)} className={`text-xs font-semibold rounded-full border-0 focus:ring-0 ${TICKET_STATUS_STYLES[ticket.status]}`}>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>
                ) : (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${TICKET_STATUS_STYLES[ticket.status]}`}>
                        {ticket.status.replace('-', ' ')}
                    </span>
                )}
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto bg-black/20 p-4 rounded-lg">
                {ticket.replies.map(r => (
                    <div key={r.id} className={`flex flex-col ${r.userId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-xl p-3 rounded-lg ${r.userId === currentUser?.id ? 'bg-brand-primary/20' : 'bg-white/10'}`}>
                            <div className="flex items-center gap-2 text-xs font-semibold">
                                <span className={r.userIsAdmin ? 'text-brand-secondary' : 'text-gray-300'}>{r.userName}</span>
                                <span className="text-gray-500">{timeAgo(r.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-200 mt-1">{r.message}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {ticket.status !== 'closed' && (
                 <form onSubmit={handleSubmitReply} className="mt-4">
                    <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." rows={3} className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary"></textarea>
                    <button type="submit" disabled={isLoading || !reply.trim()} className="mt-2 px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-light rounded-md hover:bg-gray-300 disabled:opacity-50">
                        {isLoading ? <LoadingIcon className="h-5 w-5 animate-spin"/> : 'Send Reply'}
                    </button>
                 </form>
            )}
        </div>
    );
};

export default TicketConversation;
