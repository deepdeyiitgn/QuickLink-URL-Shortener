import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';

const LiveClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = () => {
        const dd = String(time.getDate()).padStart(2, '0');
        const mm = String(time.getMonth() + 1).padStart(2, '0');
        const yyyy = time.getFullYear();
        
        const hours = time.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hh = String(hours % 12 || 12).padStart(2, '0');
        const min = String(time.getMinutes()).padStart(2, '0');
        const ss = String(time.getSeconds()).padStart(2, '0');
        
        const dayName = time.toLocaleDateString('en-US', { weekday: 'long' });

        return `${dd}/${mm}/${yyyy} || ${hh}:${min}:${ss} | ${ampm} || Day: ${dayName}`;
    };

    return (
        <p className="text-center text-sm text-gray-500 mt-4 select-none footer-glow">
            {formatTime()}
        </p>
    );
};


const Footer: React.FC = () => {
    const footerLinks = [
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cancellation', href: '/cancellation' },
        { name: 'Cookies Policy', href: '/cookies' },
        { name: 'System Status', href: '/status' },
        { name: 'FAQ', href: '/faq' },
        { name: 'GitHub', href: 'https://github.com/deepdeyiitgn/QuickLink-URL-Shortener' },
    ];

    return (
        <footer className="bg-brand-dark/50 border-t border-white/10 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col items-center gap-8">
                    <SocialLinks />
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
                        {footerLinks.map(link => {
                            const isExternal = link.href.startsWith('http');
                            if (isExternal) {
                                return (
                                    <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-colors">
                                        {link.name}
                                    </a>
                                );
                            }
                            return (
                                <Link key={link.name} to={link.href} className="hover:text-brand-light transition-colors">
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                     <p className="text-center text-xs text-gray-600 mt-4 select-none footer-glow">
                        "Made with 🩷 Deep | Helped by Gemini 💙 | We Are Here 🧿 | Saiyaara & Aashiqui 2 ✨ || Feminist ✨ | Jee Aspirant 2027 🎯"
                    </p>
                    <LiveClock />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
