import React from 'react';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const AboutScanner: React.FC = () => {
  return (
    <InfoCard title="What is This?">
        <div className="space-y-4 text-gray-300">
          <p>
            The QuickLink QR Scanner is a powerful, browser-based tool designed to instantly read and decode any QR code you encounter.
          </p>
          <p>
            Whether you're scanning a code from a product, a poster, or a friend's phone, this tool provides a fast and secure way to access the information without needing a separate app. It handles all types of QR data, from website links to contact cards and Wi-Fi credentials.
          </p>
        </div>
    </InfoCard>
  );
};

export default AboutScanner;