import React, { useContext, useState } from 'react';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
// FIX: Corrected import path for types
import { User, AuthContextType } from '../types';
import { LoadingIcon, WarningIcon } from './icons/IconComponents';
// FIX: Corrected import path for UserProfileModal
import UserProfileModal from './UserProfileModal';

const OwnerDashboard: React.FC = () => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const urlContext = useContext(UrlContext);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    if (!auth || !auth.currentUser?.isAdmin) {
        return null;
    }

    const { users, updateUserData } = auth;
    const { deleteUrlsByUserId } = urlContext || {};

    const handleRoleChange = async (userId: string, role: keyof User, value: boolean) => {
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

            {selectedUser && (
                <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </div>
    );
};

export default OwnerDashboard;
