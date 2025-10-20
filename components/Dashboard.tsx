import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProfileSettings from './ProfileSettings';
import SubscriptionStatus from './SubscriptionStatus';
import OwnerDashboard from './OwnerDashboard';
import { AuthContextType, Ticket } from '../types';
import { api } from '../api';
import { timeAgo } from '../utils/time';
import { LoadingIcon } from './icons/IconComponents';

const TicketStatusBadge: React.FC<{ status: Ticket['status'] }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    const statusMap = {
        open: 'bg-green-500/20 text-green-400',
        'in-progress': 'bg-blue-500/20 text-blue-400',
        closed: 'bg-red-500/20 text-red-400',
    };
    return <span className={`${baseClasses} ${statusMap[status]}`}>{status.replace('-', ' ')}</span>;
};

const UserTickets: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth.currentUser) {
            api.getTickets(auth.currentUser.id)
                .then(setTickets)
                .finally(() => setLoading(false));
        }
    }, [auth.currentUser]);

    if (loading) return <div className="flex justify-center"><LoadingIcon className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Your Support Tickets</h2>
            {tickets.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr>
                                <th className="text-left p-2">Subject</th>
                                <th className="text-left p-2">Status</th>
                                <th className="text-left p-2">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {tickets.map(ticket => (
                                <tr key={ticket.id}>
                                    <td className="p-2 font-semibold">{ticket.subject}</td>
                                    <td className="p-2"><TicketStatusBadge status={ticket.status} /></td>
                                    <td className="p-2 text-gray-400">{timeAgo(ticket.lastReplyAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-400 text-center py-4">You haven't submitted any support tickets yet.</p>
            )}
             <div className="text-center mt-6">
                 <button onClick={auth.openTicketModal} className="text-brand-primary hover:underline font-semibold">
                    Create New Ticket
                </button>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, openAuthModal } = auth || {};

    if (!currentUser) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-white">Access Denied</h1>
                <p className="text-gray-400 mt-4">You must be logged in to view your dashboard.</p>
                <button onClick={() => openAuthModal && openAuthModal('login')} className="mt-8 px-6 py-3 bg-brand-primary text-brand-dark font-semibold rounded-md hover:bg-brand-primary/80 transition-all shadow-[0_0_10px_#00e5ff]">
                    Log In or Sign Up
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-2 animate-aurora">Welcome, {currentUser.name}!</h1>
                <p className="text-lg text-gray-400">Manage your profile, subscription, and links here.</p>
            </div>

            <SubscriptionStatus />
            <ProfileSettings />
            <UserTickets />

            {currentUser.isAdmin && (
                <OwnerDashboard />
            )}

            {/* In a real app, URL and QR history would be here */}
            <div className="glass-card p-6 md:p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Your Links & QR Codes</h2>
                <p className="text-gray-400">Link and QR code management functionality will be displayed here in a future update.</p>
            </div>
        </div>
    );
};

export default Dashboard;