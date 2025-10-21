import React from 'react';
import QrCodeScanner from './QrCodeScanner';
import AboutScanner from './AboutScanner';
import HowToUseScanner from './HowToUseScanner';
import AdComponent from './AdComponent'; // Import AdComponent

const ScannerPage: React.FC = () => {
    return (
        <div className="space-y-12">
             <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">QR Code Scanner</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">Instantly scan any QR code with your camera or an image file.</p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl">
                 <QrCodeScanner />
            </div>

             {/* In-feed Ad placement */}
            <div className="my-12">
                <AdComponent type="in-feed" />
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-2">
                <AboutScanner />
                <HowToUseScanner />
            </div>
        </div>
    );
};

export default ScannerPage;
