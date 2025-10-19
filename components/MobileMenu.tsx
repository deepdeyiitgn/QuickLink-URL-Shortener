import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { XIcon, LinkIcon, QrGeneratorIcon, QrCodeScannerIcon, NewspaperIcon, QuestionMarkCircleIcon, UserIcon, ShieldCheckIcon } from './icons/IconComponents';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    currentView: string;
}

const NavLink: React.FC<{ href: string; icon: React.FC<any>; label: string; isActive: boolean; onClick: () => void; }> = ({ href, icon: Icon, label, isActive, onClick }) => {
    const activeClass = 'bg-brand-primary/10 text-brand-primary';
    const inactiveClass = 'text-gray-300 hover:bg-white/5 hover:text-white';
    return (
        <a href={href} onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-md transition-colors ${isActive ? activeClass : inactiveClass}`}>
            <Icon className="h-6 w-6" />
            <span className="font-semibold">{label}</span>
        </a>
    );
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, currentView }) => {
    const auth = useContext(AuthContext);
    const { currentUser, openAuthModal, logout } = auth || {};
    
    const handleLogout = () => {
        if (logout) logout();
        onClose();
    };

    const handleOpenAuthModal = (mode: 'login' | 'signup') => {
        if (openAuthModal) openAuthModal(mode);
        onClose();
    }

    const navItems = [
        { href: '/shortener', icon: LinkIcon, label: 'URL Shortener' },
        { href: '/qr-generator', icon: QrGeneratorIcon, label: 'QR Generator' },
        { href: '/qr-scanner', icon: QrCodeScannerIcon, label: 'QR Scanner' },
        { href: '/blog', icon: NewspaperIcon, label: 'Blog' },
        { href: '/faq', icon: QuestionMarkCircleIcon, label: 'FAQ' },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Menu Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-brand-dark border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal="true"
            >
                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-lg text-white">Menu</span>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white" aria-label="Close menu">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <nav className="flex-grow space-y-2">
                        {navItems.map(item => (
                            <NavLink key={item.href} {...item} isActive={`/${currentView}` === item.href} onClick={onClose} />
                        ))}
                    </nav>

                    <div className="pt-4 border-t border-white/20">
                        {currentUser ? (
                            <div className="space-y-2">
                                {currentUser.isAdmin ? (
                                    <NavLink href="/owner" icon={ShieldCheckIcon} label="Admin Dashboard" isActive={currentView === 'owner'} onClick={onClose} />
                                ) : (
                                    <NavLink href="/dashboard" icon={UserIcon} label="Dashboard" isActive={currentView === 'dashboard'} onClick={onClose} />
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 rounded-md font-semibold text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleOpenAuthModal('login')}
                                    className="w-full text-left px-4 py-3 rounded-md font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => handleOpenAuthModal('signup')}
                                    className="w-full text-left px-4 py-3 rounded-md font-semibold text-brand-dark bg-brand-primary hover:bg-brand-primary/80 transition-colors"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;