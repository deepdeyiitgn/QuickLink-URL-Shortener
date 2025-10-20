import React, { useContext, useState, useEffect } from 'react';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { LogoIcon, UserIcon, MenuIcon, XIcon } from './icons/IconComponents';
import MobileMenu from './MobileMenu';
import { AuthContextType } from '../types';

const Header: React.FC = () => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, openAuthModal, logout } = auth || {};
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-brand-dark/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <a href="/" className="flex-shrink-0 flex items-center gap-2 text-white">
                            <LogoIcon className="h-8 w-8 text-brand-primary" />
                            <span className="text-2xl font-bold">QuickLink</span>
                        </a>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="/shortener" className="nav-link">Shortener</a>
                        <a href="/qr-generator" className="nav-link">QR Generator</a>
                        <a href="/blog" className="nav-link">Blog</a>
                        <a href="/faq" className="nav-link">FAQ</a>
                        <a href="/donate" className="nav-link text-brand-secondary">Donate</a>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {currentUser ? (
                            <div className="relative group">
                                <a href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                    <UserIcon className="h-5 w-5" />
                                    <span>{currentUser.name}</span>
                                </a>
                                <div className="absolute right-0 mt-2 w-48 bg-brand-dark rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                                    <a href="/dashboard" className="dropdown-link">Dashboard</a>
                                    <a href="/api-access" className="dropdown-link">API Access</a>
                                    <button onClick={logout} className="dropdown-link w-full text-left">Sign Out</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button onClick={() => openAuthModal && openAuthModal('login')} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-white/10 transition-colors">Sign In</button>
                                <button onClick={() => openAuthModal && openAuthModal('signup')} className="px-4 py-2 text-sm font-medium text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80 transition-colors">Sign Up</button>
                            </>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>
            {isMenuOpen && <MobileMenu onLinkClick={() => setIsMenuOpen(false)} />}
        </header>
    );
};

export default Header;
