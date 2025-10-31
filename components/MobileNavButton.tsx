import React, { useState } from 'react';
import { PlusIcon, LinkIcon, QrGeneratorIcon, QrCodeScannerIcon } from './icons/IconComponents';
import { Link } from 'react-router-dom';

const MobileNavButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tools = [
    { to: '/shortener', icon: LinkIcon, label: 'URL Shortener', color: 'bg-brand-primary' },
    { to: '/qr-generator', icon: QrGeneratorIcon, label: 'QR Generator', color: 'bg-brand-secondary' },
    { to: '/qr-scanner', icon: QrCodeScannerIcon, label: 'QR Scanner', color: 'bg-green-500' },
  ];

  return (
    <div className="fixed top-1/2 right-4 -translate-y-1/2 z-50 md:hidden">
      <div className="relative flex flex-col items-center">

        {/* Floating Buttons */}
        <div className="absolute flex flex-col items-center gap-6">
          {tools.map((tool, index) => (
            <Link
              key={tool.to}
              to={tool.to}
              onClick={() => setIsOpen(false)}
              aria-label={tool.label}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg
                transition-all duration-500 ease-out ${tool.color}
                ${isOpen ? 'opacity-100 pointer-events-auto animate-bounce-slight' : 'opacity-0 pointer-events-none'}`}
              style={{
                transform: isOpen
                  ? `translateY(-${(index + 1) * 5.5}rem)` // 🔹 slightly more spacing
                  : 'translateY(0)',
                transitionDelay: isOpen
                  ? `${index * 100}ms`
                  : `${(tools.length - index) * 50}ms`,
              }}
            >
              <tool.icon className="h-6 w-6" />
            </Link>
          ))}
        </div>

        {/* Main Floating Action Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center
            text-brand-primary shadow-xl hover:bg-white/20 transition-all duration-300
            ${isOpen ? 'bg-white/20 rotate-45' : 'bg-white/10 rotate-0'} active:scale-95`}
          aria-expanded={isOpen}
          aria-label="Toggle tools menu"
        >
          <PlusIcon className="h-8 w-8 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default MobileNavButton;
