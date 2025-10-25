import React from 'react';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const AboutBlog: React.FC = () => {
  return (
    <InfoCard title="What is this?">
        <div className="space-y-4 text-gray-300">
          <p>
            Welcome to the QuickLink community blog! This is a space for users, creators, and the QuickLink team to share stories, updates, helpful tips, and interesting ideas.
          </p>
          <p>
            Whether it's an announcement about a new feature, a guide on digital marketing, or a creative project from one of our users, this is the place to connect and share with the community.
          </p>
        </div>
    </InfoCard>
  );
};

export default AboutBlog;