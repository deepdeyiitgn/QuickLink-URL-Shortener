import React from 'react';
import { LinkIcon, QrCodeScannerIcon } from './icons/IconComponents';

const AboutPage: React.FC = () => {
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-white animate-aurora">About QuickLink</h2>
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                    Your all-in-one solution for smart, shareable links and QR codes.
                </p>
            </div>

            <div className="space-y-6 text-gray-300 max-w-3xl mx-auto">
                <div>
                    <h3 className="text-2xl font-semibold text-brand-primary mb-3">Our Mission</h3>
                    <p>
                        In a digital world overflowing with information, clarity and simplicity are paramount. Long, cumbersome URLs are difficult to share and remember. QuickLink was born from a simple idea: to make sharing links as easy and efficient as possible. We provide a fast, reliable, and feature-rich platform to shorten URLs and generate dynamic QR codes for everyone, from individuals to businesses.
                    </p>
                </div>

                <div>
                    <h3 className="text-2xl font-semibold text-brand-primary mb-3">What We Offer</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <LinkIcon className="h-8 w-8 text-brand-secondary flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-white">Powerful URL Shortening</h4>
                                <p>Instantly convert any long link into a short, manageable one. Use our optional custom aliases to create branded, memorable links that stand out.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <QrCodeScannerIcon className="h-8 w-8 text-brand-secondary flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-white">Comprehensive QR Code Suite</h4>
                                <p>Go beyond simple links. Create QR codes for Wi-Fi networks, contact cards (vCard), calendar events, payment details, and much more. Customize them with colors and logos to match your brand. Our built-in scanner can read any QR code you throw at it.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-secondary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                            <div>
                                <h4 className="font-bold text-white">User-Friendly Dashboards</h4>
                                <p>Sign up for a free account to manage your links, track your subscription status, and access our Developer API to integrate QuickLink into your own applications.</p>
                            </div>
                        </div>
                    </div>
                </div>
                 <div>
                    <h3 className="text-2xl font-semibold text-brand-primary mb-3">Our Commitment</h3>
                    <p>
                        We are committed to providing a secure, fast, and intuitive service. We believe in the power of open and accessible tools, which is why our core features will always be free to use. Thank you for choosing QuickLink!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
