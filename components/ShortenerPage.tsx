import React from 'react';
import UrlShortener from './UrlShortener';
import UrlStats from './UrlStats';
import RecentLinks from './RecentLinks';
import About from './About';
import HowToUse from './HowToUse';

const ShortenerPage: React.FC = () => (
    <>
        <UrlShortener />
        <UrlStats />
        <RecentLinks />
        <div className="mt-16 grid gap-12 md:grid-cols-2">
            <About />
            <HowToUse />
        </div>
    </>
);

export default ShortenerPage;
