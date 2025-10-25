import React from 'react';
import { Link } from 'react-router-dom';
import { LinkIcon, QrCodeScannerIcon, QrGeneratorIcon } from './icons/IconComponents';
import AdComponent from './AdComponent'; // Import the ad component

const FeatureCard: React.FC<{ icon: React.FC<any>; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="glass-card p-6 rounded-2xl text-center flex flex-col items-center">
        <Icon className="h-12 w-12 text-brand-secondary mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{children}</p>
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="space-y-24">
            {/* Hero Section */}
            <div className="text-center pt-16 pb-8">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-down">
                    Shorten URLs, Create QR Codes, <span className="animate-aurora">Share Instantly</span>.
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 animate-fade-in-up">
                    The ultimate all-in-one platform for creating short, custom links and dynamic QR codes. Fast, free, and powerful.
                </p>
                <Link to="/tools" className="inline-block px-10 py-4 bg-brand-primary text-brand-dark text-lg font-semibold rounded-lg hover:bg-brand-primary/80 transition-all transform hover:scale-105 shadow-[0_0_20px_#00e5ff]">
                    Get Started for Free
                </Link>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard icon={LinkIcon} title="Powerful URL Shortener">
                    Transform long, ugly links into short, memorable URLs. Use custom aliases to brand your links and make them stand out.
                </FeatureCard>
                <FeatureCard icon={QrGeneratorIcon} title="Versatile QR Generator">
                    Create QR codes for anything: websites, Wi-Fi, vCards, events, and more. Customize them with colors and your logo.
                </FeatureCard>
                <FeatureCard icon={QrCodeScannerIcon} title="Instant QR Scanner">
                    Scan any QR code on the fly using your device's camera or by uploading an image. No app needed—it works right in your browser.
                </FeatureCard>
            </div>
            
            {/* Ad Section */}
            <div className="my-16">
                 <AdComponent type="multiplex" />
            </div>

            {/* Call to Action */}
            <div className="glass-card p-10 rounded-2xl text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Ready to Elevate Your Links?</h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-8">
                    Join thousands of users who trust QuickLink to manage their digital presence. Sign up for a free account to get started.
                </p>
                 <Link to="/tools" className="inline-block px-8 py-3 bg-brand-secondary text-white text-lg font-semibold rounded-lg hover:bg-brand-secondary/80 transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(132,108,255,0.6)]">
                    Explore All Tools
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
