import React from 'react';
import QrCodeScanner from './QrCodeScanner';

const ScannerPage: React.FC = () => {
  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">QR Code Scanner</h2>
        <p className="text-gray-400 mb-6">Need to read a QR code? Scan it here using your camera or by uploading an image.</p>
      </div>
      <QrCodeScanner />
    </div>
  );
};

export default ScannerPage;
