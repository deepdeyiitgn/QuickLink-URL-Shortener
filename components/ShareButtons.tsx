import React from 'react';
import { TwitterIcon, FacebookIcon, WhatsappIcon, LinkedInIcon, TelegramIcon, InstagramIcon } from './icons/IconComponents';

interface ShareButtonsProps {
    shortUrl: string;
    longUrl: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ shortUrl, longUrl }) => {
    const watermark = "Made with 🩷 Deep | Helped by Google Gemini 💙 | We Are Here 🧿";
    const text = `Check out this link I shortened with QuickLink!\n\n${watermark}`;
    const encodedShortUrl = encodeURIComponent(shortUrl);
    const encodedText = encodeURIComponent(text);
    const encodedLongUrl = encodeURIComponent(longUrl);

    const shareLinks = [
        {
            name: 'Twitter',
            url: `https://twitter.com/intent/tweet?url=${encodedShortUrl}&text=${encodedText}`,
            icon: TwitterIcon,
            color: 'text-sky-400',
            hover: 'hover:text-sky-300'
        },
        {
            name: 'Facebook',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedShortUrl}`,
            icon: FacebookIcon,
            color: 'text-blue-600',
            hover: 'hover:text-blue-500'
        },
        {
            name: 'WhatsApp',
            url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedShortUrl}`,
            icon: WhatsappIcon,
            color: 'text-green-500',
            hover: 'hover:text-green-400'
        },
        {
            name: 'LinkedIn',
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedShortUrl}&title=${encodedText}&summary=${encodedLongUrl}`,
            icon: LinkedInIcon,
            color: 'text-blue-700',
            hover: 'hover:text-blue-600'
        },
        {
            name: 'Telegram',
            url: `https://t.me/share/url?url=${encodedShortUrl}&text=${encodedText}`,
            icon: TelegramIcon,
            color: 'text-sky-500',
            hover: 'hover:text-sky-400'
        },
        {
            name: 'Instagram',
            url: `https://www.instagram.com`,
            icon: InstagramIcon,
            color: 'text-pink-500',
            hover: 'hover:text-pink-400'
        }
    ];

    return (
        <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-center text-gray-400 mb-3">Share on social media:</p>
            <div className="flex justify-center items-center flex-wrap gap-4">
                {shareLinks.map(({ name, url, icon: Icon, color, hover }) => (
                    <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Share on ${name}`}
                        className={`${color} ${hover} transition-transform duration-300 hover:scale-125`}
                        title={name === 'Instagram' ? 'Copy link for Instagram Bio/Story' : `Share on ${name}`}
                    >
                        <Icon className="h-8 w-8" />
                    </a>
                ))}
            </div>
            <p className="text-center text-xs text-gray-600 mt-4 select-none">
                Made with 🩷 Deep | Helped by Google Gemini 💙 | We Are Here 🧿
            </p>
        </div>
    );
};

export default ShareButtons;