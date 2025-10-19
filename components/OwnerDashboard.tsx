import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import { QrContext } from '../contexts/QrContext';
import type { User } from '../types';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${active ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'}`}>
        {children}
    </button>
);

const OwnerDashboard: React.FC = () => {
    const auth = useContext(AuthContext);
    const urlContext = useContext(UrlContext);
    const qrContext = useContext(QrContext);

    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
        const fetchUsers = async () => {
            if (auth) {
                const fetchedUsers = await auth.getAllUsers();
                setUsers(fetchedUsers);
            }
        };
        fetchUsers();
    }, [auth, auth?.currentUser]);

    const OWNER_EMAIL = import.meta.env?.VITE_OWNER_EMAIL;

    if (auth?.currentUser?.email !== OWNER_EMAIL && !auth?.currentUser?.isAdmin) {
        return (
            <div className="glass-card p-8 rounded-2xl text-center">
                <h2 className="text-2xl font-bold text-red-400">Access Denied</h2>
                <p className="text-gray-400 mt-2">You do not have permission to view this page.</p>
            </div>
        )
    }

    const handlePermissionChange = async (userId: string, permission: 'isAdmin' | 'canSetCustomExpiry', value: boolean) => {
        try {
            if (auth?.updateUserPermissions) {
                await auth.updateUserPermissions(userId, { [permission]: value });
                // Refetch users to update the local state
                const updatedUsers = await auth.getAllUsers();
                setUsers(updatedUsers);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-gray-400"><tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2 text-left">API Key</th><th className="p-2 text-left">Is Admin</th><th className="p-2 text-left">Custom Expiry</th></tr></thead>
                            <tbody className="divide-y divide-white/10">
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="p-2">{u.name}</td>
                                        <td className="p-2">{u.email}</td>
                                        <td className="p-2 font-mono text-xs">{u.apiAccess?.apiKey || 'N/A'}</td>
                                        <td className="p-2">
                                            <input 
                                                type="checkbox" 
                                                checked={!!u.isAdmin} 
                                                disabled={u.email === OWNER_EMAIL}
                                                onChange={(e) => handlePermissionChange(u.id, 'isAdmin', e.target.checked)}
                                                className="h-5 w-5 rounded bg-black/30 border-white/20 text-brand-primary focus:ring-brand-primary disabled:opacity-50"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input 
                                                type="checkbox" 
                                                checked={!!u.canSetCustomExpiry} 
                                                onChange={(e) => handlePermissionChange(u.id, 'canSetCustomExpiry', e.target.checked)}
                                                className="h-5 w-5 rounded bg-black/30 border-white/20 text-brand-primary focus:ring-brand-primary"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'urls':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-gray-400"><tr><th className="p-2 text-left">Short URL</th><th className="p-2 text-left">Original URL</th><th className="p-2 text-left">Owner Email</th></tr></thead>
                            <tbody className="divide-y divide-white/10">
                                {urlContext?.allUrls.map(url => {
                                    const owner = users.find(u => u.id === url.userId);
                                    return <tr key={url.id}><td className="p-2 font-mono text-brand-primary">{url.alias}</td><td className="p-2 truncate max-w-xs">{url.longUrl}</td><td className="p-2">{owner?.email || 'Guest'}</td></tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                );
             case 'qr_history':
                return <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="text-gray-400"><tr><th className="p-2 text-left">Type</th><th className="p-2 text-left">Payload</th><th className="p-2 text-left">Owner Email</th></tr></thead><tbody className="divide-y divide-white/10">{qrContext?.qrHistory.map(qr => { const owner = users.find(u => u.id === qr.userId); return <tr key={qr.id}><td className="p-2">{qr.type}</td><td className="p-2 truncate max-w-xs">{qr.payload}</td><td className="p-2">{owner?.email || 'Guest'}</td></tr>})}</tbody></table></div>;
            case 'scan_history':
                return <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="text-gray-400"><tr><th className="p-2 text-left">Content</th><th className="p-2 text-left">Owner Email</th></tr></thead><tbody className="divide-y divide-white/10">{qrContext?.scanHistory.map(scan => { const owner = users.find(u => u.id === scan.userId); return <tr key={scan.id}><td className="p-2 truncate max-w-md">{scan.content}</td><td className="p-2">{owner?.email || 'Guest'}</td></tr>})}</tbody></table></div>;
            default: return null;
        }
    };

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in space-y-6">
            <h2 className="text-3xl font-bold text-white text-center">Owner Dashboard</h2>
            <div className="border-b border-white/20 flex space-x-4">
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Users ({users.length})</TabButton>
                <TabButton active={activeTab === 'urls'} onClick={() => setActiveTab('urls')}>URLs ({urlContext?.allUrls.length})</TabButton>
                <TabButton active={activeTab === 'qr_history'} onClick={() => setActiveTab('qr_history')}>QR History ({qrContext?.qrHistory.length})</TabButton>
                <TabButton active={activeTab === 'scan_history'} onClick={() => setActiveTab('scan_history')}>Scan History ({qrContext?.scanHistory.length})</TabButton>
            </div>
            <div className="bg-black/20 p-4 rounded-b-lg min-h-[20rem] max-h-[30rem] overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default OwnerDashboard;