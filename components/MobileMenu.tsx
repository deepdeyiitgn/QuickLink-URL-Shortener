import React, { useContext } from 'react';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { UserIcon } from './icons/IconComponents';
import { AuthContextType } from '../types';

interface MobileMenuProps {
    onLinkClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onLinkClick }) => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, openAuthModal, logout } = auth || {};

    const handleLinkClick = (path: string) => {
        window.location.href = path;
        onLinkClick();
    };

    return (
        <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="/shortener" onClick={onLinkClick} className="mobile-nav-link">Shortener</a>
                <a href="/qr-generator" onClick={onLinkClick} className="mobile-nav-link">QR Generator</a>
                <a href="/blog" onClick={onLinkClick} className="mobile-nav-link">Blog</a>
                <a href="/faq" onClick={onLinkClick} className="mobile-nav-link">FAQ</a>
                <a href="/donate" onClick={onLinkClick} className="mobile-nav-link text-brand-secondary">Donate</a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
                {currentUser ? (
                    <div className="px-2 space-y-1">
                        <div className="flex items-center px-3 py-2">
                            <UserIcon className="h-8 w-8 text-gray-400" />
                            <div className="ml-3">
                                <div className="text-base font-medium text-white">{currentUser.name}</div>
                                <div className="text-sm font-medium text-gray-400">{currentUser.email}</div>
                            </div>
                        </div>
                        <a href="/dashboard" onClick={onLinkClick} className="mobile-nav-link">Dashboard</a>
                        <a href="/api-access" onClick={onLinkClick} className="mobile-nav-link">API Access</a>
                        <button onClick={() => { logout?.(); onLinkClick(); }} className="mobile-nav-link w-full text-left">
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="px-2 space-y-2">
                        <button onClick={() => { openAuthModal?.('login'); onLinkClick(); }} className="w-full text-left mobile-nav-link">
                            Sign In
                        </button>
                        <button onClick={() => { openAuthModal?.('signup'); onLinkClick(); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-brand-dark bg-brand-primary">
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileMenu;
