import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { XIcon } from './icons/IconComponents';
import { AuthContext } from '../contexts/AuthContext';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navLinks: { name: string; href: string }[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navLinks }) => {
    const auth = useContext(AuthContext);
    const { currentUser, openAuthModal, logout } = auth || {};
    
    const activeLinkClass = "text-brand-primary bg-brand-primary/10";
    const inactiveLinkClass = "text-gray-300 hover:bg-white/10";

    return (
        <div 
            className={`fixed inset-0 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:hidden`}
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            
            {/* Menu Panel */}
            <div className={`fixed top-0 right-0 w-full max-w-xs h-full bg-brand-dark shadow-xl flex flex-col p-6 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between mb-8">
                    <span className="text-xl font-bold text-white">Menu</span>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex flex-col space-y-2 flex-grow">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            onClick={onClose}
                            className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} block px-4 py-3 rounded-lg font-semibold`}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    {currentUser ? (
                         <button onClick={() => { logout?.(); onClose(); }} className="w-full text-left px-4 py-3 font-semibold rounded-lg text-red-400 hover:bg-white/10">
                            Logout
                        </button>
                    ) : (
                        <div className="space-y-2">
                             <button onClick={() => { openAuthModal && openAuthModal('login'); onClose(); }} className="w-full text-center px-4 py-3 font-semibold rounded-lg text-brand-dark bg-brand-primary hover:bg-brand-primary/80">
                                Sign In
                            </button>
                             <button onClick={() => { openAuthModal && openAuthModal('signup'); onClose(); }} className="w-full text-center px-4 py-3 font-semibold rounded-lg text-gray-300 hover:bg-white/10">
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;