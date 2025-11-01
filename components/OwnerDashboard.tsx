


import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import { User, AuthContextType, Ticket } from '../types';
import { LoadingIcon, WarningIcon } from './icons/IconComponents';
import UserProfileModal from './UserProfileModal';
import { api } from '../api';
import { timeAgo } from '../utils/time';
import TicketConversation from './TicketConversation';
import NotificationCreator from './NotificationCreator';
import ProductManager from './ProductManager';
import CouponManager from './CouponManager';
import LiveActivityDashboard from './LiveActivityDashboard';

const TICKET_STATUS_STYLES: Record<Ticket['status'], string> = {
    open: 'bg-green-500/20 text-green-300',
    'in-progress': 'bg-blue-500/20 text-blue-300',
    closed: 'bg-red-500/20 text-red-300',
};

const UserManagement: React.FC = () => {
    const auth = useContext(AuthContext);
    const urlContext = useContext(UrlContext);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    if (!auth || !urlContext) return null;

    const { users, updateUserData } = auth;
    const { deleteUrlsByUserId } = urlContext;

    const handleRoleChange = async (userId: string, role: keyof User, value: boolean) => {
        try {
            await updateUserData(userId, { [role]: value } as Partial<User>);
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };
    
    return (
        <div>
            <h3 className="text-xl font-bold text-white mb-4">User Management</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="text-gray-400">
                        <tr>
                            <th className="text-left font-semibold p-2">User</th>
                            <th className="text-center font-semibold p-2">Admin</th>
                            <th className="text-center font-semibold p-2">Moderator</th>
                            <th className="text-center font-semibold p-2">Can Set Expiry</th>
                            <th className="text-center font-semibold p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {users.map(user => (
                            <tr key={user.id} className="text-gray-300">
                                <td className="p-2">
                                    <button onClick={() => setSelectedUser(user)} className="hover:underline text-left">
                                        <p className="font-semibold text-white">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </button>
                                </td>
                                <td className="p-2 text-center">
                                    <input type="checkbox" checked={user.isAdmin} onChange={(e) => handleRoleChange(user.id, 'isAdmin', e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-brand-secondary focus:ring-brand-secondary" />
                                </td>
                                <td className="p-2 text-center">
                                    <input type="checkbox" checked={user.canModerate} onChange={(e) => handleRoleChange(user.id, 'canModerate', e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-400 focus:ring-blue-400" />
                                </td>
                                <td className="p-2 text-center">
                                    <input type="checkbox" checked={user.canSetCustomExpiry} onChange={(e) => handleRoleChange(user.id, 'canSetCustomExpiry', e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-purple-400 focus:ring-purple-400" />
                                </td>
                                <td className="p-2 text-center">
                                    <button onClick={() => { if(window.confirm(`Are you sure you want to delete all URLs for ${user.name}?`)) deleteUrlsByUserId?.(user.id) }} className="text-red-500 hover:underline text-xs">Delete All URLs</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {selectedUser && <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
};

const TicketManagement: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [filter, setFilter] = useState<'all' | Ticket['status']>('all');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const allTickets = await api.getAllTickets();
                if (Array.isArray(allTickets)) {
                    setTickets(allTickets);
                } else {
                    console.error("Invalid ticket data:", allTickets);
                    setTickets([]);
                }
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
                alert("Unable to load tickets right now. Please try again later.");
                setTickets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    
    const handleTicketUpdate = (updatedTicket: Ticket) => {
        setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
    };

    const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

    if (loading) {
        return <div className="text-center py-10"><LoadingIcon className="h-8 w-8 animate-spin mx-auto" /></div>;
    }

    if (selectedTicket) {
        return <TicketConversation ticket={selectedTicket} onBack={() => setSelectedTicket(null)} onUpdate={handleTicketUpdate} isAdminView />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">All Support Tickets</h3>
                <select value={filter} onChange={e => setFilter(e.target.value as any)} className="bg-black/30 rounded-md border-white/20 text-white text-sm focus:ring-brand-primary">
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
            {filteredTickets.length > 0 ? (
                <div className="space-y-3">
                    {filteredTickets.map(ticket => (
                        <button key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="w-full text-left p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-white">{ticket.subject}</p>
                                <p className="text-xs text-gray-400">From: {ticket.userName} ({ticket.userEmail})</p>
                                <p className="text-xs text-gray-500">Last updated: {timeAgo(ticket.replies[ticket.replies.length - 1]?.createdAt || ticket.createdAt)}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${TICKET_STATUS_STYLES[ticket.status]}`}>
                                {ticket.status.replace('-', ' ')}
                            </span>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center py-8">No tickets match the current filter.</p>
            )}
        </div>
    );
};


const OwnerDashboard: React.FC = () => {
    const auth = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('users');
    
    if (!auth || !auth.currentUser?.isAdmin) {
        return null;
    }

    const renderContent = () => {
        switch(activeTab) {
            case 'live':
                return <LiveActivityDashboard />;
            case 'shop':
                return <ProductManager />;
            case 'coupons':
                return <CouponManager />;
            case 'tickets':
                return <TicketManagement />;
            case 'notifications':
                return <NotificationCreator />;
            case 'users':
            default:
                return <UserManagement />;
        }
    };
    
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl mt-12 border-2 border-brand-secondary/50">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                 <h2 className="text-3xl font-bold text-brand-secondary flex items-center gap-2">
                    <WarningIcon className="h-8 w-8" />
                    Admin Panel
                </h2>
                <div className="p-1 rounded-lg bg-black/30 flex flex-wrap items-center gap-1">
                     <button onClick={() => setActiveTab('live')} className={`py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${activeTab === 'live' ? 'bg-brand-secondary/80 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                        Live Activity
                    </button>
                     <button onClick={() => setActiveTab('users')} className={`py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${activeTab === 'users' ? 'bg-brand-secondary/80 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                        Users
                    </button>
                    <button onClick={() => setActiveTab('shop')} className={`py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${activeTab === 'shop' ? 'bg-brand-secondary/80 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                        Manage Shop
                    </button>
                    <button onClick={() => setActiveTab('coupons')} className={`py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${activeTab === 'coupons' ? 'bg-brand-secondary/80 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                        Manage Coupons
                    </button>
                     <button onClick={() => setActiveTab('tickets')} className={`py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${activeTab === 'tickets' ? 'bg-brand-secondary/80 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                        Tickets
                    </button>
                    <button onClick={() => setActiveTab('notifications')} className={`py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${activeTab === 'notifications' ? 'bg-brand-secondary/80 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                        Send Notification
                    </button>
                </div>
            </div>
            
            {renderContent()}

            <div className="mt-8 pt-6 border-t border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Project Management</h3>
                <a 
                    href="https://github.com/deepdeyiitgn/QuickLink-URL-Shortener/archive/refs/heads/main.zip" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block px-6 py-3 text-sm font-semibold text-brand-dark bg-gray-300 rounded-md hover:bg-white transition-colors"
                >
                    Download Project Source (ZIP)
                </a>
                <p className="text-xs text-gray-500 mt-2">This will take you to the project's GitHub repository where you can download the latest source code as a zip file.</p>
            </div>
        </div>
    );
};

export default OwnerDashboard;
