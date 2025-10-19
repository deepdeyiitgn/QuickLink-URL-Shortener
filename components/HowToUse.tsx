import React from 'react';
import { BulletIcon } from './icons/IconComponents';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);


const HowToUse: React.FC = () => {
  return (
    <InfoCard title="How to Use">
        <ol className="space-y-4 text-gray-300">
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Paste your URL:</span> Start by pasting your long, cumbersome URL into the "Enter Long URL" field.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Create a Custom Alias (Optional):</span> If you want a memorable link, type a custom alias. If you leave it blank, we'll generate a random one for you.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Generate & Copy:</span> Click the "Generate Short URL" button. Your new, shorter link will appear below. Just click "Copy" and you're ready to share!
            </div>
          </li>
        </ol>
    </InfoCard>
  );
};

export default HowToUse;