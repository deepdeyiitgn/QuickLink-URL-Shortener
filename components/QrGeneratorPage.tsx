import React from 'react';
import QrCodeGenerator from './QrCodeGenerator';
import AboutQr from './AboutQr';
import HowToUseQr from './HowToUseQr';

const QrGeneratorPage: React.FC = () => {
  return (
    <div className="space-y-12">
        <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">
                Dynamic QR Code Suite
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Create, customize, and download QR codes for everything from websites to Wi-Fi access.
            </p>
        </div>
      
        <div className="glass-card p-6 md:p-8 rounded-2xl">
            <QrCodeGenerator />
        </div>

        <div className="grid gap-12 md:grid-cols-2">
            <AboutQr />
            <HowToUseQr />
        </div>
    </div>
  );
};

export default QrGeneratorPage;
