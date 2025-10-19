import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import { QrContext } from '../contexts/QrContext';
import { BlogContext } from '../contexts/BlogContext';
import UserProfileModal from './UserProfileModal';
import type { User, BlogPost } from '../types';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${active ? 'text-brand-primary border-brand-primary' : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'}`}>
        {children}
    </button>
);

const OwnerDashboard: React.FC = () => {
    const auth = useContext(AuthContext);
    const urlContext = useContext(UrlContext);
    const qrContext = useContext(QrContext);
    const blogContext = useContext(BlogContext);

    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState<User[]>([]);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    
    useEffect(() => {
        const fetchUsers = async () => {
            if (auth) {
                const fetchedUsers = await auth.getAllUsers();
                setUsers(fetchedUsers);
            }
        };
        fetchUsers();
    }, [auth]);

    const pendingPosts = useMemo(() => {
        return blogContext?.posts.filter(p => p.status === 'pending') || [];
    }, [blogContext?.posts]);

    const OWNER_EMAIL = import.meta.env?.VITE_OWNER_EMAIL;

    if (auth?.currentUser?.email !== OWNER_EMAIL && !auth?.currentUser?.isAdmin) {
        return (
            <div className="glass-card p-8 rounded-2xl text-center">
                <h2 className="text-2xl font-bold text-red-400">Access Denied</h2>
                <p className="text-gray-400 mt-2">You do not have permission to view this page.</p>
            </div>
        )
    }

    const handlePermissionChange = async (userId: string, permissions: Partial<Pick<User, 'isAdmin' | 'canSetCustomExpiry' | 'canModerate'>>) => {
        try {
            if (auth?.updateUserPermissions) {
                await auth.updateUserPermissions(userId, permissions);
                const updatedUsers = await auth.getAllUsers();
                setUsers(updatedUsers);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };
    

    const handleApprovePost = (postId: string) => blogContext?.approvePost(postId);
    const handleDeletePost = (postId: string) => blogContext?.deletePost(postId);

    const renderContent = () => {
        switch (activeTab) {
            case 'pending_posts':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-gray-400"><tr><th className="p-2 text-left">Author</th><th className="p-2 text-left">Title</th><th className="p-2 text-left">Content Snippet</th><th className="p-2 text-center">Actions</th></tr></thead>
                            <tbody className="divide-y divide-white/10">
                                {pendingPosts.map(post => (
                                    <tr key={post.id}>
                                        <td className="p-2">{post.userName}</td>
                                        <td className="p-2 font-semibold">{post.title}</td>
                                        <td className="p-2 truncate max-w-sm">{post.content.replace(/<[^>]+>/g, '').substring(0, 100)}...</td>
                                        <td className="p-2 text-center space-x-2">
                                            <button onClick={() => handleApprovePost(post.id)} className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-xs font-bold">Approve</button>
                                            <button onClick={() => handleDeletePost(post.id)} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-bold">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                {pendingPosts.length === 0 && (
                                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">No posts are currently pending approval.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            case 'users':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-gray-400"><tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2 text-center">Admin</th><th className="p-2 text-center">Expiry Power</th><th className="p-2 text-center">Moderator</th></tr></thead>
                            <tbody className="divide-y divide-white/10">
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="p-2"><button onClick={() => setViewingUser(u)} className="hover:underline text-brand-primary">{u.name}</button></td>
                                        <td className="p-2">{u.email}</td>
                                        <td className="p-2 text-center">
                                            <input type="checkbox" checked={!!u.isAdmin} disabled={u.email === OWNER_EMAIL} onChange={(e) => handlePermissionChange(u.id, { isAdmin: e.target.checked })} className="h-5 w-5 rounded bg-black/30 border-white/20 text-brand-primary focus:ring-brand-primary disabled:opacity-50"/>
                                        </td>
                                        <td className="p-2 text-center">
                                            <input type="checkbox" checked={!!u.canSetCustomExpiry} onChange={(e) => handlePermissionChange(u.id, { canSetCustomExpiry: e.target.checked })} className="h-5 w-5 rounded bg-black/30 border-white/20 text-brand-primary focus:ring-brand-primary"/>
                                        </td>
                                        <td className="p-2 text-center">
                                            <input type="checkbox" checked={!!u.canModerate} onChange={(e) => handlePermissionChange(u.id, { canModerate: e.target.checked })} className="h-5 w-5 rounded bg-black/30 border-white/20 text-brand-primary focus:ring-brand-primary"/>
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
        <>
            <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in space-y-6">
                <h2 className="text-3xl font-bold text-white text-center">Owner Dashboard</h2>
                <div className="border-b border-white/20 flex flex-wrap space-x-4">
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Users ({users.length})</TabButton>
                    <TabButton active={activeTab === 'pending_posts'} onClick={() => setActiveTab('pending_posts')}>
                        Pending Posts <span className="ml-1.5 inline-block text-xs font-bold bg-yellow-500 text-brand-dark px-2 py-0.5 rounded-full">{pendingPosts.length}</span>
                    </TabButton>
                    <TabButton active={activeTab === 'urls'} onClick={() => setActiveTab('urls')}>URLs ({urlContext?.allUrls.length})</TabButton>
                    <TabButton active={activeTab === 'qr_history'} onClick={() => setActiveTab('qr_history')}>QR History ({qrContext?.qrHistory.length})</TabButton>
                    <TabButton active={activeTab === 'scan_history'} onClick={() => setActiveTab('scan_history')}>Scan History ({qrContext?.scanHistory.length})</TabButton>
                </div>
                <div className="bg-black/20 p-4 rounded-b-lg min-h-[20rem] max-h-[30rem] overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
            {viewingUser && (
                <UserProfileModal user={viewingUser} onClose={() => setViewingUser(null)} />
            )}
        </>
    );
};

export default OwnerDashboard;