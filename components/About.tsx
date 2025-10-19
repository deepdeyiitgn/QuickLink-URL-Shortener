import React from 'react';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const About: React.FC = () => {
  return (
    <InfoCard title="What is This?">
        <div className="space-y-4 text-gray-300">
          <p>
            QuickLink is a simple and powerful tool to transform long, messy URLs into short, memorable, and shareable links.
          </p>
          <p>
            Whether you're sharing a link in a social media post or a presentation, a short link is easier to manage and looks cleaner. This app runs entirely in your browser, providing a fast and private experience.
          </p>
        </div>
    </InfoCard>
  );
};

export default About;