import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import { User, AuthContextType, Ticket, Product, ProductType } from '../types';
import { LoadingIcon, WarningIcon } from './icons/IconComponents';
import UserProfileModal from './UserProfileModal';
import { api } from '../api';
import { timeAgo } from '../utils/time';

const TicketManager: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getTickets().then(setTickets).finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (ticketId: string, status: Ticket['status']) => {
        const updatedTicket = await api.updateTicketStatus(ticketId, status);
        setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
    };

    if (loading) return <div className="flex justify-center p-4"><LoadingIcon className="h-6 w-6 animate-spin" /></div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr>
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Subject</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Last Updated</th>
                        <th className="text-center p-2">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                    {tickets.map(ticket => (
                        <tr key={ticket.id}>
                            <td className="p-2">{ticket.userName}<br/><span className="text-xs text-gray-500">{ticket.userEmail}</span></td>
                            <td className="p-2 font-semibold">{ticket.subject}</td>
                            <td className="p-2">{ticket.status}</td>
                            <td className="p-2">{timeAgo(ticket.lastReplyAt)}</td>
                            <td className="p-2 space-x-2 text-center">
                                <button className="text-blue-400 hover:underline">View</button>
                                <button onClick={() => handleStatusChange(ticket.id, 'closed')} className="text-red-400 hover:underline">Close</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const OwnerDashboard: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const urlContext = useContext(UrlContext);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    if (!auth || !auth.currentUser?.isAdmin) {
        return null;
    }

    const { users, updateUserData } = auth;
    const { deleteUrlsByUserId } = urlContext || {};

    const handleRoleChange = async (userId: string, role: keyof User, value: boolean | string) => {
        try {
            await updateUserData(userId, { [role]: value } as Partial<User>);
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };
    
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl mt-12 border-2 border-brand-secondary/50">
            <h2 className="text-3xl font-bold text-brand-secondary mb-6 flex items-center gap-2">
                <WarningIcon className="h-8 w-8" />
                Admin Control Panel
            </h2>
            
            <div className="space-y-8 divide-y divide-white/10">
                <section>
                    <h3 className="text-2xl font-bold text-white mb-4">User Management</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-gray-400">
                                <tr>
                                    <th className="text-left font-semibold p-2">User</th>
                                    <th className="text-center font-semibold p-2">Admin</th>
                                    <th className="text-center font-semibold p-2">Moderator</th>
                                    <th className="text-center font-semibold p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {users.map(user => (
                                    <tr key={user.id} className="text-gray-300">
                                        <td className="p-2">
                                            <p className="font-semibold text-white">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </td>
                                        <td className="p-2 text-center">
                                            <input type="checkbox" checked={user.isAdmin} onChange={(e) => handleRoleChange(user.id, 'isAdmin', e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-brand-secondary focus:ring-brand-secondary" />
                                        </td>
                                        <td className="p-2 text-center">
                                            <input type="checkbox" checked={user.canModerate} onChange={(e) => handleRoleChange(user.id, 'canModerate', e.target.checked)} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-400 focus:ring-blue-400" />
                                        </td>
                                        <td className="p-2 text-center space-x-2 whitespace-nowrap">
                                             <button 
                                                onClick={() => handleRoleChange(user.id, 'status', user.status === 'active' ? 'banned' : 'active')}
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'banned' ? 'bg-red-500/50 text-white' : 'bg-green-500/50 text-white'}`}
                                            >
                                                {user.status === 'banned' ? 'Unban' : 'Ban'}
                                            </button>
                                            <button onClick={() => setSelectedUser(user)} className="text-blue-400 hover:underline text-xs">Manage</button>
                                            <button onClick={() => { if(window.confirm(`Are you sure you want to delete all URLs for ${user.name}?`)) deleteUrlsByUserId?.(user.id) }} className="text-red-500 hover:underline text-xs">Delete URLs</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="pt-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Support Tickets</h3>
                    <TicketManager />
                </section>
                
                <section className="pt-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Manage Shop</h3>
                    <p className="text-gray-400">Shop product management will be implemented here.</p>
                </section>

                <section className="pt-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Broadcast Notification</h3>
                    <p className="text-gray-400">A form to send notifications to all users will be implemented here.</p>
                </section>
            </div>


            {selectedUser && (
                <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </div>
    );
};

export default OwnerDashboard;