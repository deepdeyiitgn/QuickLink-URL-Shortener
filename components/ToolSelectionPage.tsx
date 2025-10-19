import React from 'react';
import { LinkIcon, QrCodeScannerIcon } from './icons/IconComponents';

const ToolSelectionPage: React.FC = () => {
    return (
        <div className="text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Tool</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-12">
                Select one of our powerful tools to get started.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <a href="/shortener" className="tool-card">
                    <LinkIcon className="h-16 w-16 text-brand-primary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">URL Shortener</h3>
                    <p className="text-gray-400">Create short, custom, and shareable links from long URLs in seconds.</p>
                </a>
                <a href="/qr-generator" className="tool-card">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5A2.25 2.25 0 016 2.25h12A2.25 2.25 0 0120.25 4.5v12A2.25 2.25 0 0118 18.75H6A2.25 2.25 0 013.75 16.5v-12z" />
                    </svg>
                    <h3 className="text-2xl font-bold mb-2">QR Generator</h3>
                    <p className="text-gray-400">Generate custom QR codes for websites, Wi-Fi, contacts, and more.</p>
                </a>
                <a href="/qr-scanner" className="tool-card">
                    <QrCodeScannerIcon className="h-16 w-16 text-green-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">QR Scanner</h3>
                    <p className="text-gray-400">Instantly scan and decode any QR code using your camera or an image file.</p>
                </a>
            </div>
        </div>
    );
};

export default ToolSelectionPage;
