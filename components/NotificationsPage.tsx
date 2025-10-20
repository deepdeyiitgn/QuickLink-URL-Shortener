import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api';
import { Notification } from '../types';
import { LoadingIcon, CheckIcon } from './icons/IconComponents';
import { timeAgo } from '../utils/time';

const NotificationsPage: React.FC = () => {
    const auth = useContext(AuthContext);
    const { currentUser } = auth || {};
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            api.getNotifications(currentUser.id)
                .then(setNotifications)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const handleMarkAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        await api.markNotificationAsRead(id);
    };

    if (loading) {
        return <div className="text-center py-20"><LoadingIcon className="h-12 w-12 animate-spin text-brand-primary" /></div>;
    }

    if (!currentUser) {
        return <div className="text-center py-20"><h1 className="text-2xl">Please log in to see your notifications.</h1></div>;
    }
    
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Notifications</h1>
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div key={notification.id} className={`p-4 rounded-lg flex items-start gap-4 ${notification.isRead ? 'bg-black/20 opacity-70' : 'bg-black/40'}`}>
                            <div className="flex-grow">
                                <p className="text-gray-300">{notification.message}</p>
                                <span className="text-xs text-gray-500">{timeAgo(notification.createdAt)}</span>
                            </div>
                            {!notification.isRead && (
                                <button onClick={() => handleMarkAsRead(notification.id)} className="flex-shrink-0 p-2 text-xs flex items-center gap-1 bg-white/10 rounded-md hover:bg-white/20">
                                    <CheckIcon className="h-4 w-4" /> Mark as Read
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-8">You have no new notifications.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
