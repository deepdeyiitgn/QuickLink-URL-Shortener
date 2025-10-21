import React from 'react';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const AboutQr: React.FC = () => {
  return (
    <InfoCard title="What is This?">
        <div className="space-y-4 text-gray-300">
          <p>
            The QuickLink QR Generator is a versatile tool for creating a wide array of QR codes. Go beyond simple links and generate codes for Wi-Fi, vCards, events, and more.
          </p>
          <p>
            Customize your QR codes with colors and logos to match your brand. It’s a fast, free, and powerful way to connect the physical and digital worlds.
          </p>
        </div>
    </InfoCard>
  );
};

export default AboutQr;
