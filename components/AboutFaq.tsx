import React from 'react';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const AboutFaq: React.FC = () => {
  return (
    <InfoCard title="What is this?">
        <div className="space-y-4 text-gray-300">
          <p>
            This is our Frequently Asked Questions (FAQ) page. We've compiled a list of the most common questions our users have about QuickLink's features, usage, and policies.
          </p>
          <p>
            Our goal is to provide clear, concise answers to help you get the most out of our service. If you have a question, there's a good chance you'll find the answer right here.
          </p>
        </div>
    </InfoCard>
  );
};

export default AboutFaq;