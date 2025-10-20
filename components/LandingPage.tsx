
import React, { useState } from 'react';
// FIX: Changed single quotes to double quotes for the import.
import { useNavigate } from "react-router-dom";
import { LinkIcon, QrCodeScannerIcon } from './icons/IconComponents';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="feature-card p-6 rounded-xl h-full">
        <div className="flex items-center gap-4 mb-3">
            {icon}
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400">{children}</p>
    </div>
);

const LandingPage: React.FC = () => {
    const [isExiting, setIsExiting] = useState(false);
    const navigate = useNavigate();

    const handleNavigate = () => {
        setIsExiting(true);
        setTimeout(() => {
            navigate('/tools');
        }, 500); // Duration must match the CSS animation
    };

    return (
        <div className={`text-center ${isExiting ? 'boom-out' : 'animate-fade-in'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                Simplify, Brand, and Connect: Your All-in-One Link Platform
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                Tired of long, clunky URLs and basic QR codes? QuickLink empowers you to create short, powerful, and branded links, generate dynamic QR codes for any purpose, and scan them instantly. Elevate your digital presence with a tool that's fast, secure, and incredibly easy to use.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 text-left">
                <FeatureCard icon={<LinkIcon className="h-8 w-8 text-brand-primary"/>} title="Advanced URL Shortener">
                    Go beyond simple shortening. Create custom, memorable aliases that boost brand recognition and click-through rates. Our service is perfect for social media bios, marketing campaigns, email signatures, and any situation where a clean link matters.
                </FeatureCard>
                <FeatureCard icon={<QrCodeScannerIcon className="h-8 w-8 text-brand-secondary"/>} title="Comprehensive QR Suite">
                    Unlock the full potential of QR codes. Our generator lets you create codes for websites, Wi-Fi, vCards, events, payments, and more. Customize colors and add your logo for a professional touch. Our integrated scanner makes reading any code a breeze.
                </FeatureCard>
                <FeatureCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} title="Secure & Performant">
                    Your security is our priority. Every link is generated on our robust infrastructure and passes through a secure interstitial page to protect users from malicious content. Our platform is built on modern technology for blazing-fast performance.
                </FeatureCard>
            </div>
            
            <div className="my-20">
                <h2 className="text-4xl font-bold text-white mb-4">Why QuickLink is the Smarter Choice</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-10">We've built a platform that's not just a tool, but a complete solution for managing your digital connections.</p>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
                    <div className="feature-card p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-brand-primary mb-2">Free Core Features</h3>
                        <p className="text-gray-400">Our powerful URL shortener and QR code generator are free to use, offering generous limits for everyone, because we believe powerful tools should be accessible.</p>
                    </div>
                    <div className="feature-card p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-brand-primary mb-2">User-Focused Dashboard</h3>
                        <p className="text-gray-400">Sign up for a free account to manage all your created links and QR codes, view history, and access your personal developer API key from one central location.</p>
                    </div>
                    <div className="feature-card p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-brand-primary mb-2">Developer-Friendly API</h3>
                        <p className="text-gray-400">Integrate our powerful shortening service into your own applications with our simple and well-documented REST API, complete with a free trial to get you started.</p>
                    </div>
                </div>
            </div>


            <button
                onClick={handleNavigate}
                className="px-10 py-4 text-lg font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80 transition-all transform hover:scale-105 shadow-[0_0_20px_#00e5ff]"
            >
                Get Started for Free
            </button>
        </div>
    );
};

export default LandingPage;