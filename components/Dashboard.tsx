import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ProfileSettings from './ProfileSettings';
import SubscriptionStatus from './SubscriptionStatus';
import OwnerDashboard from './OwnerDashboard';
import { AuthContextType, Ticket } from '../types';
import { api } from '../api';
import TicketModal from './TicketModal';
import TicketConversation from './TicketConversation';
import { LoadingIcon } from './icons/IconComponents';
import AboutDashboard from './AboutDashboard';
import HowToUseDashboard from './HowToUseDashboard';

const MyTickets: React.FC = () => {
    const auth = useContext(AuthContext);
    const [isTicketModalOpen, setTicketModalOpen] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    React.useEffect(() => {
        if (auth?.currentUser) {
            api.getUserTickets(auth.currentUser.id).then(userTickets => {
                setTickets(userTickets);
                setLoading(false);
            }).catch(err => {
                console.error("Failed to load tickets:", err);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [auth?.currentUser]);

    const handleTicketUpdate = (updatedTicket: Ticket) => {
        setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
    };

    if (loading) return <div className="text-center py-10"><LoadingIcon className="h-8 w-8 animate-spin mx-auto text-brand-primary" /></div>;
    
    if (selectedTicket) {
        return <TicketConversation ticket={selectedTicket} onBack={() => setSelectedTicket(null)} onUpdate={handleTicketUpdate} isAdminView={false} />;
    }

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-white">My Support Tickets</h2>
                <button onClick={() => setTicketModalOpen(true)} className="px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80">
                    New Ticket
                </button>
            </div>
            {tickets.length > 0 ? (
                <div className="space-y-3">
                    {tickets.map(ticket => (
                        <button key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="w-full text-left p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
                            <p className="font-semibold text-white">{ticket.subject}</p>
                            <p className={`text-xs capitalize ${ticket.status === 'open' ? 'text-green-400' : 'text-gray-400'}`}>Status: {ticket.status}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center py-8">You have not submitted any support tickets yet.</p>
            )}
            {isTicketModalOpen && <TicketModal onClose={() => setTicketModalOpen(false)} />}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const auth = useContext(AuthContext);

    if (auth?.loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!auth?.currentUser) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-white">Access Denied</h1>
                <p className="text-gray-400 mt-2">Please log in to view your dashboard.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">Dashboard</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">Manage your account, links, and subscriptions.</p>
            </div>

            <div className="flex justify-center p-1 rounded-lg bg-black/30 w-full max-w-md mx-auto">
                <button onClick={() => setActiveTab('profile')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'profile' ? 'bg-brand-primary text-brand-dark' : 'text-gray-300 hover:bg-white/10'}`}>
                    Profile & Subscription
                </button>
                <button onClick={() => setActiveTab('tickets')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'tickets' ? 'bg-brand-primary text-brand-dark' : 'text-gray-300 hover:bg-white/10'}`}>
                    My Tickets
                </button>
            </div>
            
            {activeTab === 'profile' && (
                <div className="space-y-8">
                    <ProfileSettings />
                    <SubscriptionStatus />
                </div>
            )}

            {activeTab === 'tickets' && <MyTickets />}
            
            <OwnerDashboard />

            <div className="mt-16 grid gap-12 md:grid-cols-2">
                <AboutDashboard />
                <HowToUseDashboard />
            </div>
        </div>
    );
};

export default Dashboard;
