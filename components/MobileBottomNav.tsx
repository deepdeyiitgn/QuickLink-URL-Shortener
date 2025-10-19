import React from 'react';
import { LinkIcon, QrGeneratorIcon, QrCodeScannerIcon } from './icons/IconComponents';

interface MobileBottomNavProps {
    currentView: string;
}

const NavItem: React.FC<{ href: string; icon: React.FC<any>; label: string; isActive: boolean; }> = ({ href, icon: Icon, label, isActive }) => {
    const activeClass = 'text-brand-primary';
    const inactiveClass = 'text-gray-400 hover:text-white';

    return (
        <a href={href} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${isActive ? activeClass : inactiveClass}`}>
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
        </a>
    );
};

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView }) => {
    const navItems = [
        { href: '/shortener', icon: LinkIcon, label: 'Shortener' },
        { href: '/qr-generator', icon: QrGeneratorIcon, label: 'Generate' },
        { href: '/qr-scanner', icon: QrCodeScannerIcon, label: 'Scan' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-t border-white/10 md:hidden">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map(item => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        isActive={`/${currentView}` === item.href}
                    />
                ))}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
