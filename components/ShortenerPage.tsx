import React from 'react';
import UrlShortener from './UrlShortener';
import UrlStats from './UrlStats';
import RecentLinks from './RecentLinks';
import About from './About';
import HowToUse from './HowToUse';
import AdComponent from './AdComponent'; // Import AdComponent

const ShortenerPage: React.FC = () => {
    return (
        <div className="space-y-12 overflow-x-hidden">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">URL Shortener</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">Create short, custom, and memorable links in seconds.</p>
            </div>

            <UrlShortener />
            
            {/* In-feed Ad placement */}
            <div className="my-12">
                <AdComponent type="in-feed" />
            </div>

            <UrlStats />

            <div className="mt-16 grid gap-12 md:grid-cols-2">
                <About />
                <HowToUse />
            </div>

            <RecentLinks />
        </div>
    );
};

export default ShortenerPage;
