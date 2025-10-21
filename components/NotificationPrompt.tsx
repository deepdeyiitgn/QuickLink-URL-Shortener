import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Notification } from '../types';
import { XIcon } from './icons/IconComponents';

// FIX: Added a local apiFetch helper to resolve the "Cannot find name 'apiFetch'" error.
const apiFetch = async (url: string, options?: RequestInit) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
    }
    return response.json();
};


const NotificationPrompt: React.FC = () => {
    const auth = useContext(AuthContext);
    const { currentUser } = auth || {};

    const [unreadCount, setUnreadCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!currentUser) return;

        const checkNotifications = async () => {
            try {
                const notifications: Notification[] = await apiFetch(`/api/support?type=notification&userId=${currentUser.id}`);
                const count = notifications.filter(n => !n.isRead).length;
                setUnreadCount(count);
                if (count > 0) {
                    setIsVisible(true);
                }
            } catch (error) {
                console.error("Failed to check notifications:", error);
            }
        };
        
        // Check on mount and then every 2 minutes
        checkNotifications();
        const interval = setInterval(checkNotifications, 120000);

        return () => clearInterval(interval);

    }, [currentUser]);

    const handleMarkAsRead = async () => {
        if (!currentUser) return;
        setIsVisible(false);
        try {
            await apiFetch('/api/support?type=notification', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, action: 'mark_read' }),
            });
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };
    
    if (!isVisible || unreadCount === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-6 z-50 bg-brand-dark/80 backdrop-blur-md border border-white/10 rounded-lg shadow-xl p-4 max-w-sm animate-fade-in-up">
            <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white">
                <XIcon className="h-4 w-4" />
            </button>
            <p className="text-white font-semibold">You have {unreadCount} new notification{unreadCount > 1 ? 's' : ''}.</p>
            <div className="flex items-center gap-4 mt-2">
                <Link to="/notifications" onClick={() => setIsVisible(false)} className="flex-1 text-center text-sm py-1.5 bg-brand-primary text-brand-dark rounded-md hover:bg-brand-primary/80">
                    View
                </Link>
                <button onClick={handleMarkAsRead} className="flex-1 text-center text-sm py-1.5 bg-white/10 text-gray-300 rounded-md hover:bg-white/20">
                    Mark as Read
                </button>
            </div>
        </div>
    );
};

export default NotificationPrompt;
