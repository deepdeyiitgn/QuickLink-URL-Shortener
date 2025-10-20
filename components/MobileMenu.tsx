import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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

    const linkClasses = "block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700";

    return (
        <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/" onClick={onLinkClick} className={linkClasses}>Home</Link>
                <Link to="/tools" onClick={onLinkClick} className={linkClasses}>Tools</Link>
                <Link to="/blog" onClick={onLinkClick} className={linkClasses}>Blog</Link>
                <Link to="/about" onClick={onLinkClick} className={linkClasses}>About</Link>
                <Link to="/contact" onClick={onLinkClick} className={linkClasses}>Contact</Link>
                <Link to="/status" onClick={onLinkClick} className={linkClasses}>Status</Link>
                <Link to="/faq" onClick={onLinkClick} className={linkClasses}>FAQ</Link>
                <Link to="/donate" onClick={onLinkClick} className={`${linkClasses} text-brand-secondary hover:text-brand-secondary/80 hover:bg-brand-secondary/10`}>Donate</Link>
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
                        <Link to="/dashboard" onClick={onLinkClick} className={linkClasses}>Dashboard</Link>
                        <Link to="/api-access" onClick={onLinkClick} className={linkClasses}>API Access</Link>
                        <button onClick={() => { logout?.(); onLinkClick(); }} className={`${linkClasses} w-full text-left`}>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="px-2 space-y-2">
                        <button onClick={() => { openAuthModal?.('login'); onLinkClick(); }} className={`w-full text-left ${linkClasses}`}>
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