import React from 'react';
import { YoutubeIcon, WebsiteIcon, DiscordIcon, AppsIcon, InstagramIcon } from './icons/IconComponents';

const socialLinks = [
  { name: 'YouTube', url: 'https://www.youtube.com/channel/UCrh1Mx5CTTbbkgW5O6iS2Tw/', icon: YoutubeIcon },
  { name: 'Website', url: 'https://www.deepdeyiitk.com/', icon: WebsiteIcon },
  { name: 'Discord Study Bot', url: 'https://bots.deepdeyiitk.com/', icon: DiscordIcon },
  { name: 'Apps', url: 'https://apps.deepdeyiitk.com/', icon: AppsIcon },
  { name: 'Instagram', url: 'https://www.instagram.com/deepdey.official/', icon: InstagramIcon },
];

const SocialLinks: React.FC = () => {
  return (
    <div className="flex justify-center items-center flex-wrap gap-4 md:gap-6">
      {socialLinks.map(({ name, url, icon: Icon }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="text-gray-400 hover:text-brand-primary transition-transform duration-300 hover:scale-110"
        >
          <Icon className="h-8 w-8" />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;