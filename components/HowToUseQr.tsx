import React from 'react';
import { BulletIcon, QrCodeScannerIcon } from './icons/IconComponents';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const HowToUseQr: React.FC = () => {
  return (
    <InfoCard title="How to Use QR Suite">
        <ol className="space-y-4 text-gray-300">
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Select QR Type:</span> Choose the type of QR code you want to create (URL, Wi-Fi, vCard, etc.) from the icon grid.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Fill in the Details:</span> Enter the required information into the form fields that appear. The QR code will update in real-time.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Customize & Download:</span> Optionally, use the "Customize" accordions to add a logo or change colors, then click "Download PNG" to save your code.
            </div>

          </li>
          <li className="flex items-start mt-6 pt-4 border-t border-white/10">
            <QrCodeScannerIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
                <span className="font-semibold text-white">Scan a Code:</span> Scroll down to the scanner section. You can either use your device's camera or upload an image file to instantly read any QR code.
            </div>
          </li>
        </ol>
    </InfoCard>
  );
};

export default HowToUseQr;