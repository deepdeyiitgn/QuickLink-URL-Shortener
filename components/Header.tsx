import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { LogoIcon, UserIcon, MenuIcon, XIcon, ChevronDownIcon } from './icons/IconComponents';
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
                        <Link to="/about" className={navLinkClasses}>About</Link>
                        <Link to="/contact" className={navLinkClasses}>Contact</Link>
                        <Link to="/donate" className={`${navLinkClasses} text-brand-secondary hover:text-brand-secondary/80 hover:bg-brand-secondary/10`}>Donate</Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        {currentUser ? (
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