
import React, { useState, useEffect } from 'react';
import { XIcon } from './icons/IconComponents';

const NotificationPermissionPrompt: React.FC = () => {
    const [status, setStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('unsupported');
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(sessionStorage.getItem('notification_prompt_dismissed') === 'true');

    useEffect(() => {
        if ('Notification' in window) {
            setStatus(Notification.permission);
        }
    }, []);

    useEffect(() => {
        if (status === 'default' && !isDismissed) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 10000); // 10-second delay
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [status, isDismissed]);

    const handleRequestPermission = async () => {
        const permission = await Notification.requestPermission();
        setStatus(permission);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
        sessionStorage.setItem('notification_prompt_dismissed', 'true');
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-6 z-50 bg-brand-dark/80 backdrop-blur-md border border-white/10 rounded-lg shadow-xl p-4 max-w-sm animate-fade-in-up">
            <button onClick={handleDismiss} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white">
                <XIcon className="h-4 w-4" />
            </button>
            <p className="text-white font-semibold pr-4">Get Notified!</p>
            <p className="text-sm text-gray-400 mt-1">Enable browser notifications to receive important updates and alerts instantly.</p>
            <div className="flex items-center gap-4 mt-3">
                <button onClick={handleRequestPermission} className="flex-1 text-center text-sm py-1.5 bg-brand-primary text-brand-dark rounded-md hover:bg-brand-primary/80">
                    Enable
                </button>
                <button onClick={handleDismiss} className="flex-1 text-center text-sm py-1.5 bg-white/10 text-gray-300 rounded-md hover:bg-white/20">
                    Not Now
                </button>
            </div>
        </div>
    );
};

export default NotificationPermissionPrompt;
