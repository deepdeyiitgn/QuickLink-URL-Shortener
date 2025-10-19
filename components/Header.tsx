import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { LogoIcon, UserIcon, CrownIcon } from './icons/IconComponents';

interface HeaderProps {
    currentView: string;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
    const auth = useContext(AuthContext);
    const { currentUser, openAuthModal, logout } = auth || {};

    const getLinkClass = (path: string) => {
        return `text-sm font-medium transition-colors ${currentView === path ? 'text-brand-primary' : 'text-gray-300 hover:text-brand-primary'}`;
    };

    return (
        <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                         <a href="/" className="flex items-center gap-2 text-white hover:text-brand-primary transition-colors">
                            <LogoIcon className="h-8 w-8 text-brand-primary" />
                            <span className="text-xl font-bold animate-aurora">QuickLink</span>
                        </a>
                        <nav className="hidden md:flex items-center space-x-6">
                            <a href="/shortener" className={getLinkClass('shortener')}>URL Shortener</a>
                            <a href="/qr-generator" className={getLinkClass('qr-generator')}>QR Generator</a>
                            <a href="/qr-scanner" className={getLinkClass('qr-scanner')}>QR Scanner</a>
                             {currentUser && (
                                <a href="/api" className={getLinkClass('api')}>Developer API</a>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <a href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-brand-primary transition-colors">
                                    <UserIcon className="h-5 w-5"/>
                                    <span>Dashboard</span>
                                </a>
                                {currentUser.subscription && currentUser.subscription.expiresAt > Date.now() && (
                                     <button onClick={() => auth.openSubscriptionModal && auth.openSubscriptionModal()} title="You are a subscriber!" className="text-green-400">
                                        <CrownIcon className="h-6 w-6"/>
                                    </button>
                                )}
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-sm font-semibold text-gray-300 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                             <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openAuthModal && openAuthModal('login')}
                                    className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-brand-primary transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => openAuthModal && openAuthModal('signup')}
                                    className="px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80 transition-colors shadow-[0_0_10px_#00e5ff]"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;