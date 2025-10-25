import React from 'react';
import { BulletIcon } from './icons/IconComponents';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const HowToUseDashboard: React.FC = () => {
  return (
    <InfoCard title="How to Use Your Dashboard">
        <ol className="space-y-4 text-gray-300">
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Use the Tabs:</span> Navigate between sections using the "Profile & Subscription" and "My Tickets" tabs at the top.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Manage Your Profile:</span> In the main tab, you can update your display name, change your profile picture, and view your current subscription benefits.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Track Support Tickets:</span> Go to the "My Tickets" tab to create new support requests, view the status of existing tickets, and read and send replies.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Admin Panel:</span> If you are an admin, a special "Admin Panel" will appear at the bottom, giving you access to site-wide user and content management tools.
            </div>
          </li>
        </ol>
    </InfoCard>
  );
};

export default HowToUseDashboard;
