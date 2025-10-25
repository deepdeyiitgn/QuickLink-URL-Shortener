import React from 'react';
import { BulletIcon } from './icons/IconComponents';

const InfoCard: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="glass-card p-6 rounded-2xl h-full">
        <h3 className="text-2xl font-bold text-brand-primary mb-4">{title}</h3>
        {children}
    </div>
);

const HowToUseBlog: React.FC = () => {
  return (
    <InfoCard title="How to Use">
        <ol className="space-y-4 text-gray-300">
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Create a Post:</span> If you're logged in, you can use the "Create a New Post" form. Add a title, your content, and optionally upload up to two images or one audio file.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Interact with Posts:</span> Logged-in users can like posts and add comments. Use the icons at the bottom of each post to share your appreciation and join the conversation.
            </div>
          </li>
          <li className="flex items-start">
            <BulletIcon className="h-6 w-6 text-brand-secondary flex-shrink-0 mr-3 mt-1" />
            <div>
              <span className="font-semibold text-white">Understand the Badges:</span> Keep an eye out for badges next to usernames. 'Premium' badges are for our subscribers, and the 'Owner' badge identifies posts from the QuickLink team.
            </div>
          </li>
        </ol>
    </InfoCard>
  );
};

export default HowToUseBlog;