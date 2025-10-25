import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api';
import type { NotificationMessage, AuthContextType } from '../types';
import { LoadingIcon, TrashIcon } from './icons/IconComponents';
import { timeAgo } from '../utils/time';

const NotificationsPage: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser } = auth || {};

    const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            api.getNotifications(currentUser.id)
                .then(setNotifications)
                .finally(() => setLoading(false));
        }
    }, [currentUser]);

    const handleMarkAllAsRead = async () => {
        if (!currentUser) return;
        await api.markNotificationsRead(currentUser.id);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleDelete = async (notificationId: string) => {
        if (!currentUser || !window.confirm('Are you sure you want to delete this notification? This action cannot be undone.')) return;
        try {
            await api.deleteNotification(notificationId, currentUser.id);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (err) {
            console.error(err);
            alert('Failed to delete notification.');
        }
    };


    const NotificationItem: React.FC<{ notification: NotificationMessage }> = ({ notification }) => {
        const content = (
            <div className={`p-4 rounded-lg transition-colors flex items-start gap-4 ${notification.isRead ? 'bg-black/20' : 'bg-brand-primary/10'}`}>
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-white">{notification.title}</h3>
                        {!notification.isRead && <div className="w-2.5 h-2.5 bg-brand-primary rounded-full flex-shrink-0 mt-1.5"></div>}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{timeAgo(notification.createdAt)}</p>
                </div>
                 {currentUser?.isAdmin && (
                    <button onClick={() => handleDelete(notification.id)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full flex-shrink-0">
                        <TrashIcon className="h-4 w-4" />
                    </button>
                )}
            </div>
        );

        return notification.link ? <Link to={notification.link}>{content}</Link> : <div>{content}</div>;
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white">Notifications</h1>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl">
                {loading ? (
                    <div className="text-center py-20">
                        <LoadingIcon className="h-10 w-10 animate-spin text-brand-primary mx-auto" />
                    </div>
                ) : notifications.length > 0 ? (
                    <>
                        <div className="text-right mb-4">
                            <button 
                                onClick={handleMarkAllAsRead}
                                className="text-sm text-brand-primary hover:underline"
                                disabled={notifications.every(n => n.isRead)}
                            >
                                Mark all as read
                            </button>
                        </div>
                        <div className="space-y-4">
                            {notifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <h2 className="mt-4 text-xl font-semibold text-white">No New Notifications</h2>
                        <p className="text-gray-500 mt-2">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;