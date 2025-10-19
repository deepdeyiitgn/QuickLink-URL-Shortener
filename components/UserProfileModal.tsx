import React, { useContext } from 'react';
import { User, BlogPost } from '../types';
import { BlogContext } from '../contexts/BlogContext';
import { XIcon, ShieldCheckIcon, CrownIcon } from './icons/IconComponents';
import { timeAgo } from '../utils/time';

interface UserProfileModalProps {
    user: User;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
    const blog = useContext(BlogContext);
    const userPosts = blog?.posts.filter(p => p.userId === user.id).sort((a,b) => b.createdAt - a.createdAt) || [];

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl glass-card rounded-2xl p-8 my-8 max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <XIcon className="h-6 w-6" />
                </button>
                
                {/* Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                    {user.profilePictureUrl ? (
                        <img src={user.profilePictureUrl} alt={`${user.name}'s profile`} className="w-16 h-16 rounded-full object-cover border-2 border-brand-primary" />
                    ) : (
                        <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center font-bold text-white text-3xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <p className="text-gray-400">{user.email}</p>
                    </div>
                </div>

                {/* Body */}
                <div className="py-6 space-y-6 flex-grow overflow-y-auto">
                    {/* Roles & Status */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Roles & Status</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.isAdmin && <span className="flex items-center gap-1.5 px-3 py-1 text-sm rounded-full bg-yellow-500/20 text-yellow-300 font-semibold"><ShieldCheckIcon className="h-4 w-4" /> Admin</span>}
                            {user.canModerate && <span className="px-3 py-1 text-sm rounded-full bg-blue-500/20 text-blue-300 font-semibold">Moderator</span>}
                            {user.canSetCustomExpiry && <span className="px-3 py-1 text-sm rounded-full bg-purple-500/20 text-purple-300 font-semibold">Expiry Power</span>}
                            {(user.subscription && user.subscription.expiresAt > Date.now()) && <span className="flex items-center gap-1.5 px-3 py-1 text-sm rounded-full bg-green-500/20 text-green-300 font-semibold"><CrownIcon className="h-4 w-4" /> Subscriber</span>}
                        </div>
                    </div>
                    
                    {/* Blog Activity */}
                    <div>
                         <h3 className="text-lg font-semibold text-gray-300 mb-2">Blog Activity ({userPosts.length} Posts)</h3>
                         {userPosts.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                {userPosts.map(post => (
                                    <div key={post.id} className="bg-black/30 p-3 rounded-md">
                                        <p className="font-semibold text-white truncate">{post.title}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                            <span>{timeAgo(post.createdAt)}</span>
                                            <span className={`capitalize font-semibold ${post.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}`}>{post.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         ) : (
                            <p className="text-gray-500 text-sm">This user has not created any blog posts.</p>
                         )}
                    </div>

                    {/* Other Info */}
                     <div>
                         <h3 className="text-lg font-semibold text-gray-300 mb-2">Details</h3>
                         <div className="text-sm text-gray-400 space-y-1">
                            <p><strong>User ID:</strong> <span className="font-mono text-xs">{user.id}</span></p>
                            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                            <p><strong>IP Address:</strong> {user.ipAddress}</p>
                            <p><strong>API Key:</strong> {user.apiAccess?.apiKey ? 'Active' : 'Not Generated'}</p>
                         </div>
                    </div>

                </div>
                 <div className="pt-4 border-t border-white/10 text-right">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-semibold text-brand-dark bg-brand-light rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
