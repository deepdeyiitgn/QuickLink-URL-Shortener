import React from 'react';
import { BulletIcon } from './icons/IconComponents';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const HowToUseFaq: React.FC = () => {
  return (
    <InfoCard title="How to Use">
        <ol className="space-y-4 text-gray-300">
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Browse Questions:</span> Simply scroll through the list of questions to see if yours is listed.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Click to Expand:</span> Click on any question to reveal the answer. The section will expand smoothly to show the information.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Need More Help?:</span> If you can't find your answer here, please reach out to us through our social media channels linked in the footer. We're always happy to help!
            </div>
          </li>
        </ol>
    </InfoCard>
  );
};

export default HowToUseFaq;