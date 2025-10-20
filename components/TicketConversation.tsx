import React, { useState, useContext } from 'react';
import { Ticket, TicketReply, AuthContextType } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api';
import { timeAgo } from '../utils/time';
import { LoadingIcon } from './icons/IconComponents';

interface TicketConversationProps {
    ticket: Ticket;
    onBack: () => void;
    onUpdate: (updatedTicket: Ticket) => void;
    isAdminView?: boolean;
}

const TICKET_STATUS_OPTIONS: Ticket['status'][] = ['open', 'in-progress', 'closed'];

const TicketConversation: React.FC<TicketConversationProps> = ({ ticket, onBack, onUpdate, isAdminView }) => {
    const auth = useContext(AuthContext) as AuthContextType;
    const [reply, setReply] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReply = async () => {
        if (!reply.trim() || !auth.currentUser) return;
        setIsLoading(true);
        const newReply: Omit<TicketReply, 'id' | 'createdAt'> = {
            userId: auth.currentUser.id,
            userName: auth.currentUser.name,
            text: reply,
        };
        const updatedTicket = await api.replyToTicket(ticket.id, newReply);
        onUpdate(updatedTicket);
        setReply('');
        setIsLoading(false);
    };
    
    const handleStatusChange = async (newStatus: Ticket['status']) => {
        const updatedTicket = await api.updateTicketStatus(ticket.id, newStatus);
        onUpdate(updatedTicket);
    };

    const conversation = [{
        userId: ticket.userId,
        userName: ticket.userName,
        text: ticket.message,
        createdAt: ticket.createdAt
    }, ...ticket.replies];

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                <button onClick={onBack} className="text-sm text-brand-primary hover:underline">&larr; Back to all tickets</button>
                {isAdminView && (
                     <div className="flex items-center gap-2">
                        <label htmlFor="status-select" className="text-sm text-gray-400">Status:</label>
                        <select
                            id="status-select"
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(e.target.value as Ticket['status'])}
                            className="bg-black/30 text-sm rounded-md border-white/20 text-white focus:ring-brand-primary"
                        >
                            {TICKET_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
                        </select>
                    </div>
                )}
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{ticket.subject}</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {conversation.map((item, index) => (
                    <div key={index} className="p-4 bg-black/20 rounded-lg">
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                            <span className="font-semibold text-gray-300">{item.userName}</span>
                            <span>{timeAgo(item.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap">{item.text}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
                <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    rows={4}
                    className="block w-full rounded-md border-0 bg-black/30 py-2 px-3 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary text-sm resize-y"
                />
                <button onClick={handleReply} disabled={isLoading || !reply.trim()} className="mt-2 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-light rounded-md hover:bg-gray-300 disabled:opacity-50">
                    {isLoading && <LoadingIcon className="h-4 w-4 animate-spin" />}
                    Send Reply
                </button>
            </div>
        </div>
    );
};

export default TicketConversation;