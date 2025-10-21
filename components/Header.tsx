
import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LogoIcon, UserIcon, MenuIcon, SunIcon, MoonIcon } from './icons/IconComponents';
import MobileMenu from './MobileMenu';
import NotificationPrompt from './NotificationPrompt';

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme') as 'dark' | 'light';
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Toggle theme">
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
        </button>
    );
};

const Header: React.FC = () => {
    const auth = useContext(AuthContext);
    const { currentUser, logout, openAuthModal } = auth || {};
    
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const profileMenuRef = React.useRef<HTMLDivElement>(null);
    // Simple hook to close profile dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [profileMenuRef]);


    const navLinks = [
        { name: 'Tools', href: '/tools' },
        { name: 'Shop', href: '/shop' },
        { name: 'Blog', href: '/blog' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Donate', href: '/donate' }
    ];

    const activeLinkClass = "text-brand-primary";
    const inactiveLinkClass = "text-gray-300 hover:text-brand-light";

    return (
        <>
            <header className="sticky top-0 z-40 bg-brand-dark/80 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                            <LogoIcon className="h-8 w-8 text-brand-primary" />
                            <span className="text-2xl font-bold text-white">QuickLink</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navLinks.map(link => (
                                <NavLink
                                    key={link.name}
                                    to={link.href}
                                    className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} font-semibold transition-colors`}
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Auth Buttons / User Menu */}
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            {currentUser ? (
                                <div className="relative" ref={profileMenuRef}>
                                    <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center focus:outline-none">
                                        {currentUser.profilePictureUrl ? (
                                            <img src={currentUser.profilePictureUrl} alt="Profile" className="h-10 w-10 rounded-full object-cover border-2 border-brand-primary" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-brand-secondary flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 text-white" />
                                            </div>
                                        )}
                                    </button>
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-brand-dark border border-white/10 rounded-lg shadow-lg py-1 animate-fade-in-down">
                                            <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10" onClick={() => setProfileMenuOpen(false)}>Dashboard</Link>
                                            <Link to="/notifications" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10" onClick={() => setProfileMenuOpen(false)}>Notifications</Link>
                                            <button onClick={() => { logout?.(); setProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10">
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => openAuthModal && openAuthModal('login')}
                                    className="hidden md:inline-block px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80"
                                >
                                    Sign In
                                </button>
                            )}

                            {/* Mobile Menu Button */}
                            <div className="md:hidden">
                                <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10">
                                    <MenuIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} navLinks={navLinks} />
            <NotificationPrompt />
        </>
    );
};

export default Header;