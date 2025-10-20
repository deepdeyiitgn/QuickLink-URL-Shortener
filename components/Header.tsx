import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { LogoIcon, UserIcon, MenuIcon, XIcon, ChevronDownIcon } from './icons/IconComponents';
import MobileMenu from './MobileMenu';
import { AuthContextType, Notification } from '../types';
import { api } from '../api';

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);


const Header: React.FC = () => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, openAuthModal, logout } = auth || {};
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        let interval: number;
        if (currentUser) {
            const checkNotifications = async () => {
                const notifications: Notification[] = await api.getNotifications(currentUser.id);
                if (notifications.some(n => !n.isRead)) {
                    setHasUnread(true);
                } else {
                    setHasUnread(false);
                }
            };
            checkNotifications();
            interval = window.setInterval(checkNotifications, 30000); // Check every 30 seconds
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (interval) clearInterval(interval);
        };
    }, [currentUser]);

    const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors";
    const dropdownLinkClasses = "block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white w-full text-left";

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-brand-dark/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-white">
                            <LogoIcon className="h-8 w-8 text-brand-primary" />
                            <span className="text-2xl font-bold">QuickLink</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        <Link to="/" className={navLinkClasses}>Home</Link>
                        <div className="relative group">
                            <button className={`${navLinkClasses} flex items-center gap-1`}>
                                Tools
                                <ChevronDownIcon className="h-4 w-4" />
                            </button>
                            <div className="absolute left-0 mt-2 w-48 bg-brand-dark/90 backdrop-blur-sm border border-white/10 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
                                <Link to="/shortener" className={dropdownLinkClasses}>URL Shortener</Link>
                                <Link to="/qr-generator" className={dropdownLinkClasses}>QR Generator</Link>
                                <Link to="/qr-scanner" className={dropdownLinkClasses}>QR Scanner</Link>
                            </div>
                        </div>
                        <Link to="/blog" className={navLinkClasses}>Blog</Link>
                        <Link to="/shop" className={navLinkClasses}>Shop</Link>
                        <Link to="/about" className={navLinkClasses}>About</Link>
                        <Link to="/contact" className={navLinkClasses}>Contact</Link>
                        <Link to="/donate" className={`${navLinkClasses} text-brand-secondary hover:text-brand-secondary/80 hover:bg-brand-secondary/10`}>Donate</Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <Link to="/notifications" className="relative text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10">
                                    <BellIcon className="h-6 w-6" />
                                    {hasUnread && <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-brand-dark"></span>}
                                </Link>
                                <div className="relative group">
                                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                                        <UserIcon className="h-5 w-5" />
                                        <span>{currentUser.name}</span>
                                    </Link>
                                    <div className="absolute right-0 mt-2 w-48 bg-brand-dark/90 backdrop-blur-sm border border-white/10 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                                        <Link to="/dashboard" className={dropdownLinkClasses}>Dashboard</Link>
                                        <Link to="/api-access" className={dropdownLinkClasses}>API Access</Link>
                                        <button onClick={logout} className={dropdownLinkClasses}>Sign Out</button>
                                    </div>
                                </div>
                            </>
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