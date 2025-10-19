import React from 'react';
import { BulletIcon } from './icons/IconComponents';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const HowToUseScanner: React.FC = () => {
  return (
    <InfoCard title="How to Use">
        <ol className="space-y-4 text-gray-300">
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">To Scan with Camera:</span> Click the "Use Camera" button. You may need to grant camera permissions to your browser. Simply point your device's camera at a QR code, and the result will appear instantly.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">To Scan from an Image:</span> Click the "Upload Image" button and select a picture from your device that contains a QR code. Our tool will automatically find and decode the code within the image.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">View the Result:</span> Once a scan is successful, the decoded information will be displayed on the screen. If the content is a web link, an "Open Link" button will appear for easy access.
            </div>
          </li>
        </ol>
    </InfoCard>
  );
};

export default HowToUseScanner;