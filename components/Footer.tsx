
import React from 'react';
// FIX: Changed single quotes to double quotes for the import.
import { Link } from "react-router-dom";
import SocialLinks from './SocialLinks';

const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-dark/50 border-t border-white/10 mt-16 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
                <div className="mb-8">
                     <p className="text-lg font-semibold footer-glow select-none">
                        "Made with 🩷 Deep | Helped by Gemini 💙 | We Are Here 🧿 | Saiyaara & Aashiqui 2 ✨ || Feminist ✨ | Jee Aspirant 2027 🎯"
                    </p>
                </div>
                <div className="mb-8">
                    <SocialLinks />
                </div>
                <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-sm mb-8">
                    <Link to="/about" className="hover:text-white transition-colors">About</Link>
                    <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link>
                    <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                    <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                </div>
                <p className="text-xs text-gray-500">
                    &copy; {new Date().getFullYear()} QuickLink. All rights reserved. Built by Deep Dey.
                </p>
            </div>
        </footer>
    );
};

export default Footer;