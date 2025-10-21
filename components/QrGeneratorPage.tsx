import React from 'react';
import QrCodeGenerator from './QrCodeGenerator';
import AboutQr from './AboutQr';
import HowToUseQr from './HowToUseQr';
import AdComponent from './AdComponent'; // Import AdComponent

const QrGeneratorPage: React.FC = () => {
    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">QR Code Generator</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">Create custom QR codes for websites, Wi-Fi, contacts, and more.</p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl">
                <QrCodeGenerator />
            </div>
            
            {/* In-feed Ad placement */}
            <div className="my-12">
                <AdComponent type="in-feed" />
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-2">
                <AboutQr />
                <HowToUseQr />
            </div>
        </div>
    );
};

export default QrGeneratorPage;
