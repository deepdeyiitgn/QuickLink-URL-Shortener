import React, { useState } from 'react';
import { PlusIcon, LinkIcon, QrGeneratorIcon, QrCodeScannerIcon } from './icons/IconComponents';

const MobileNavButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const tools = [
        { href: '/shortener', icon: LinkIcon, label: 'URL Shortener', color: 'bg-brand-primary' },
        { href: '/qr-generator', icon: QrGeneratorIcon, label: 'QR Generator', color: 'bg-brand-secondary' },
        { href: '/qr-scanner', icon: QrCodeScannerIcon, label: 'QR Scanner', color: 'bg-green-500' },
    ];

    return (
        <div className="fixed top-1/2 right-4 -translate-y-1/2 z-50 md:hidden">
            <div className="relative flex flex-col items-center gap-4">
                {/* Tool Buttons */}
                {tools.map((tool, index) => (
                    <a
                        key={tool.href}
                        href={tool.href}
                        aria-label={tool.label}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${tool.color} ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                        style={{
                            transform: isOpen ? `translateY(-${(index + 1) * 4}rem)` : 'translateY(0)',
                            transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                        }}
                    >
                        <tool.icon className="h-6 w-6" />
                    </a>
                ))}
                
                {/* Main FAB */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-brand-primary shadow-xl hover:bg-white/20 transition-all duration-300"
                    aria-expanded={isOpen}
                    aria-label="Toggle tools menu"
                >
                    <PlusIcon className={`h-8 w-8 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
                </button>
            </div>
        </div>
    );
};

export default MobileNavButton;
