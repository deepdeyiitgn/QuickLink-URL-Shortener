import React from 'react';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const AboutDashboard: React.FC = () => {
  return (
    <InfoCard title="What is this?">
        <div className="space-y-4 text-gray-300">
          <p>
            This is your personal dashboard, the central hub for managing your QuickLink account and activities.
          </p>
          <p>
            From here, you can update your profile, check your subscription status, manage your support tickets, and if you're an admin, access powerful site management tools.
          </p>
        </div>
    </InfoCard>
  );
};

export default AboutDashboard;
