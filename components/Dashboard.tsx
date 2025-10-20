import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProfileSettings from './ProfileSettings';
import SubscriptionStatus from './SubscriptionStatus';
import { AuthContextType, Ticket } from '../types';
import { api } from '../api';
import { LoadingIcon, PlusIcon } from './icons/IconComponents';
import { timeAgo } from '../utils/time';
import TicketConversation from './TicketConversation';
import TicketModal from './TicketModal';
import AboutDashboard from './AboutDashboard';
import HowToUseDashboard from './HowToUseDashboard';
// FIX: Imported the OwnerDashboard component to resolve the "Cannot find name" error.
import OwnerDashboard from './OwnerDashboard';

const TICKET_STATUS_STYLES: Record<Ticket['status'], string> = {
    open: 'bg-green-500/20 text-green-300',
    'in-progress': 'bg-blue-500/20 text-blue-300',
    closed: 'bg-red-500/20 text-red-300',
};

const UserTickets: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isTicketModalOpen, setTicketModalOpen] = useState(false);

    const fetchTickets = async () => {
        if (auth.currentUser) {
            setLoading(true);
            const userTickets = await api.getUserTickets(auth.currentUser.id);
            setTickets(userTickets);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [auth.currentUser]);
    
    const handleTicketUpdate = (updatedTicket: Ticket) => {
        setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
    };

    if (loading) {
        return <div className="text-center py-10"><LoadingIcon className="h-8 w-8 animate-spin mx-auto" /></div>;
    }
    
    if (selectedTicket) {
        return <TicketConversation ticket={selectedTicket} onBack={() => setSelectedTicket(null)} onUpdate={handleTicketUpdate} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Your Support Tickets</h3>
                <button onClick={() => setTicketModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80">
                    <PlusIcon className="h-4 w-4" /> New Ticket
                </button>
            </div>
            {tickets.length > 0 ? (
                <div className="space-y-3">
                    {tickets.map(ticket => (
                        <button key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="w-full text-left p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-white">{ticket.subject}</p>
                                <p className="text-xs text-gray-500">Last updated: {timeAgo(ticket.replies[ticket.replies.length - 1]?.createdAt || ticket.createdAt)}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${TICKET_STATUS_STYLES[ticket.status]}`}>
                                {ticket.status.replace('-', ' ')}
                            </span>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center py-8">You have not submitted any tickets yet.</p>
            )}
            {isTicketModalOpen && <TicketModal onClose={() => { setTicketModalOpen(false); fetchTickets(); }} />}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, openAuthModal } = auth || {};
    const [activeTab, setActiveTab] = useState('profile');

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
    
    const renderContent = () => {
        switch(activeTab) {
            case 'tickets':
                return <UserTickets />;
            case 'profile':
            default:
                return (
                    <div className="space-y-8">
                        <SubscriptionStatus />
                        <ProfileSettings />
                    </div>
                );
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-2 animate-aurora">Welcome, {currentUser.name}!</h1>
                <p className="text-lg text-gray-400">Manage your profile, subscriptions, and support tickets.</p>
            </div>

            <div className="glass-card p-2 rounded-xl max-w-md mx-auto">
                <div className="flex justify-center items-center gap-2">
                    <button onClick={() => setActiveTab('profile')} className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-brand-primary text-brand-dark' : 'text-gray-300 hover:bg-white/10'}`}>
                        Profile & Subscription
                    </button>
                     <button onClick={() => setActiveTab('tickets')} className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'tickets' ? 'bg-brand-primary text-brand-dark' : 'text-gray-300 hover:bg-white/10'}`}>
                        My Tickets
                    </button>
                </div>
            </div>
            
            <div className="glass-card p-6 md:p-8 rounded-2xl">
                {renderContent()}
            </div>

            {currentUser.isAdmin && (
                <OwnerDashboard />
            )}

            <div className="mt-16 grid gap-12 md:grid-cols-2">
                <AboutDashboard />
                <HowToUseDashboard />
            </div>
        </div>
    );
};

export default Dashboard;