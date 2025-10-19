import React, { useState } from 'react';
import { LinkIcon, QrCodeScannerIcon } from './icons/IconComponents';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="feature-card p-6 rounded-xl">
        <div className="flex items-center gap-4 mb-3">
            {icon}
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400">{children}</p>
    </div>
);

const LandingPage: React.FC = () => {
    const [isExiting, setIsExiting] = useState(false);

    const handleNavigate = () => {
        setIsExiting(true);
        setTimeout(() => {
            window.history.pushState({}, '', '/tools');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }, 500); // Duration must match the CSS animation
    };

    return (
        <div className={`text-center ${isExiting ? 'boom-out' : 'animate-fade-in'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                The Ultimate Link & QR Toolkit
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                Quickly shorten long URLs, create custom QR codes for anything, and scan codes instantly. One platform for all your linking needs.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 text-left">
                <FeatureCard icon={<LinkIcon className="h-8 w-8 text-brand-primary"/>} title="URL Shortener">
                    Transform long, unwieldy web addresses into short, memorable, and shareable links perfect for social media, marketing campaigns, and more.
                </FeatureCard>
                <FeatureCard icon={<QrCodeScannerIcon className="h-8 w-8 text-brand-secondary"/>} title="QR Code Suite">
                    Generate custom QR codes for websites, Wi-Fi, contacts, events, and payments. Then, use our integrated scanner to read any code with ease.
                </FeatureCard>
                <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} title="Secure & Fast">
                    Built for speed and security. Your links are generated instantly and redirect through our safe, branded interstitial page.
                </FeatureCard>
            </div>

            <button
                onClick={handleNavigate}
                className="px-10 py-4 text-lg font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80 transition-all transform hover:scale-105 shadow-[0_0_20px_#00e5ff]"
            >
                Let's Go
            </button>
        </div>
    );
};

export default LandingPage;
