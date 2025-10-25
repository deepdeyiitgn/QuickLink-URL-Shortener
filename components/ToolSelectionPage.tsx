
import React from 'react';
// FIX: Changed single quotes to double quotes for the import.
import { Link } from "react-router-dom";
import { LinkIcon, QrCodeScannerIcon, QrGeneratorIcon } from './icons/IconComponents';

const ToolSelectionPage: React.FC = () => {
    return (
        <div className="text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Tool</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-12">
                Select one of our powerful tools to get started.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <Link to="/shortener" className="tool-card">
                    <LinkIcon className="h-16 w-16 text-brand-primary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">URL Shortener</h3>
                    <p className="text-gray-400">Create short, custom, and shareable links from long URLs in seconds.</p>
                </Link>
                <Link to="/qr-generator" className="tool-card">
                    <QrGeneratorIcon className="h-16 w-16 text-brand-secondary mb-4" />
                    <h3 className="text-2xl font-bold mb-2">QR Generator</h3>
                    <p className="text-gray-400">Generate custom QR codes for websites, Wi-Fi, contacts, and more.</p>
                </Link>
                <Link to="/qr-scanner" className="tool-card">
                    <QrCodeScannerIcon className="h-16 w-16 text-green-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">QR Scanner</h3>
                    <p className="text-gray-400">Instantly scan and decode any QR code using your camera or an image file.</p>
                </Link>
            </div>
        </div>
    );
};

export default ToolSelectionPage;