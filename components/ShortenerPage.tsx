import React from 'react';
import UrlShortener from './UrlShortener';
import UrlStats from './UrlStats';
import About from './About';
import HowToUse from './HowToUse';
import RecentLinks from './RecentLinks';
import SubscriptionStatus from './SubscriptionStatus';

const ShortenerPage: React.FC = () => {
  return (
    <div className="space-y-12">
        <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">
                The Quickest Link in the Chain
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Transform long, cumbersome URLs into short, shareable, and trackable links in seconds.
            </p>
        </div>
      
        <div className="max-w-3xl mx-auto">
            <UrlShortener />
            <UrlStats />
        </div>
        
        <SubscriptionStatus />

        <div className="grid gap-12 md:grid-cols-2">
            <About />
            <HowToUse />
        </div>

        <RecentLinks />
    </div>
  );
};

export default ShortenerPage;
