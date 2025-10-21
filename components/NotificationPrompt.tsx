
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import type { NotificationMessage } from '../types';
import { XIcon } from './icons/IconComponents';
import { api } from '../api';

const NotificationPrompt: React.FC = () => {
    const auth = useContext(AuthContext);
    const { currentUser } = auth || {};

    const [unreadCount, setUnreadCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!currentUser) return;

        const checkNotifications = async () => {
            try {
                const notifications: NotificationMessage[] = await api.getNotifications(currentUser.id);
                const unread = notifications.filter(n => !n.isRead);
                
                if (unread.length > 0) {
                    setUnreadCount(unread.length);
                    setIsVisible(true); // This controls the in-app prompt

                    // This section handles OS-level notifications
                    if ('Notification' in window && Notification.permission === 'granted') {
                        const shownNotifsStr = sessionStorage.getItem('shown_browser_notifs') || '[]';
                        const shownNotifs: string[] = JSON.parse(shownNotifsStr);
                        
                        const notifsToShow = unread.filter(n => !shownNotifs.includes(n.id));
                        
                        if (notifsToShow.length > 0) {
                            // To avoid spam, just show the latest new notification
                            const latest = notifsToShow.sort((a,b) => b.createdAt - a.createdAt)[0];
                            
                            const browserNotif = new Notification(latest.title, {
                                body: latest.message,
                                icon: '/quicklink-logo.svg',
                                tag: latest.id // Tag prevents duplicates of the same notification
                            });
                            
                            browserNotif.onclick = () => {
                                window.open(latest.link || '/notifications', '_blank');
                            };
                            
                            // Add all newly shown notifications to our tracking list
                            notifsToShow.forEach(n => shownNotifs.push(n.id));
                            sessionStorage.setItem('shown_browser_notifs', JSON.stringify(shownNotifs));
                        }
                    }
                } else {
                    setIsVisible(false);
                }
            } catch (error) {
                console.error("Failed to check notifications:", error);
            }
        };
        
        checkNotifications();
        const interval = setInterval(checkNotifications, 120000); // Check every 2 minutes

        return () => clearInterval(interval);

    }, [currentUser]);

    const handleMarkAsRead = async () => {
        if (!currentUser) return;
        setIsVisible(false);
        try {
            await api.markNotificationsRead(currentUser.id);
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