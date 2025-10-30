import React from 'react';
import { LinkIcon, QrCodeScannerIcon } from './icons/IconComponents';

const AboutPage: React.FC = () => {
    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in space-y-12">
            <div className="text-center">
                <h2 className="text-4xl font-bold text-white animate-aurora">About QuickLink</h2>
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                    Your all-in-one solution for smart, shareable links and QR codes, built for the modern web.
                </p>
            </div>

            <div className="space-y-8 text-gray-300 max-w-4xl mx-auto">
                <div>
                    <h3 className="text-2xl font-semibold text-brand-primary mb-3">Our Mission</h3>
                    <p className="text-lg leading-relaxed">
                        In a digital world overflowing with information, clarity and simplicity are paramount. Long, cumbersome URLs are not only difficult to remember and share, but they also dilute brand identity and create friction for users. QuickLink was born from a simple yet powerful idea: to make sharing information as seamless, secure, and efficient as possible. We provide a fast, reliable, and feature-rich platform to shorten URLs and generate dynamic QR codes for everyone—from individuals sharing content with friends, to businesses engaging with customers on a global scale.
                    </p>
                </div>

                <div>
                    <h3 className="text-2xl font-semibold text-brand-primary mb-4">What We Offer</h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <LinkIcon className="h-10 w-10 text-brand-secondary flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-white text-xl">Powerful URL Shortening</h4>
                                <p>Instantly convert any long link into a short, manageable one. But we don't stop there. Our service includes:</p>
                                <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1">
                                    <li><strong>Custom Aliases:</strong> Create branded, memorable links that stand out and increase trust.</li>
                                    <li><strong>Link Expiration:</strong> Free users get 24-hour links, while registered users get 7-day links. Subscribers can create links that last for months or even a full year.</li>
                                    <li><strong>Secure Redirects:</strong> All links pass through our branded interstitial page, offering a layer of security and brand consistency.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <QrCodeScannerIcon className="h-10 w-10 text-brand-secondary flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-white text-xl">Comprehensive QR Code Suite</h4>
                                <p>Go beyond simple links. Bridge the physical and digital worlds with our versatile QR code tools:</p>
                                 <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1">
                                    <li><strong>Multiple Data Types:</strong> Generate codes for Websites, Wi-Fi networks, contact cards (vCard), SMS/Phone, calendar events, geographic locations, and even payment systems like UPI and Bitcoin.</li>
                                    <li><strong>Deep Customization:</strong> Make your QR codes an extension of your brand. Change colors, and add your own logo to the center for a professional look.</li>
                                    <li><strong>Integrated Scanner:</strong> Our built-in scanner can read any QR code you encounter, whether you're using your device's camera or uploading an image file.</li>
                                </ul>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-secondary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <div>
                                <h4 className="font-bold text-white text-xl">User-Friendly Dashboards & API</h4>
                                <p>Take control of your digital assets with our powerful management tools:</p>
                                <ul className="list-disc list-inside mt-2 text-gray-400 space-y-1">
                                    <li><strong>Personal Dashboard:</strong> Sign up for a free account to view and manage all your created links, track your subscription status, and see your QR code history.</li>
                                    <li><strong>Developer API:</strong> For our more technical users, we provide a simple, robust API to integrate QuickLink's shortening power directly into your own applications and workflows.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-semibold text-brand-primary mb-3">Who Is QuickLink For?</h3>
                    <p className="mb-4">Our platform is designed to be versatile for a wide range of users:</p>
                     <ul className="list-disc list-inside space-y-2 text-gray-400">
                        <li><strong>Marketers:</strong> Create clean, branded links for your campaigns and track their performance.</li>
                        <li><strong>Content Creators:</strong> Simplify links in your social media bios, video descriptions, and posts.</li>
                        <li><strong>Businesses:</strong> Use QR codes to share Wi-Fi access with customers, provide contact details, or link to menus and promotional materials.</li>
                        <li><strong>Developers:</strong> Automate link creation by integrating our service directly into your applications.</li>
                        <li><strong>Everyday Users:</strong> Shorten a long link from a shopping site or news article to easily share it with friends and family.</li>
                    </ul>
                </div>
                
                 <div>
                    <h3 className="text-2xl font-semibold text-brand-primary mb-3">Our Commitment</h3>
                    <p>
                        We are committed to providing a secure, fast, and intuitive service. We believe in the power of open and accessible tools, which is why our core features will always be free to use. Our platform is built on a foundation of privacy and security, ensuring that your data is handled responsibly. We continuously strive to improve and innovate, adding new features that empower our users. Thank you for choosing QuickLink!
                    </p>
                </div>
            </div>
        </div>
                        <div className="border-t border-gray-700 pt-10">
                    <h3 className="text-2xl font-semibold text-brand-primary mb-3">About the Author</h3>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <img
                            src="https://i.postimg.cc/Ss0GyCZ5/Ufffffffffntitled-design.png"
                            alt="Deep Dey - Founder of QuickLink"
                            className="w-40 h-40 rounded-full object-cover border-2 border-brand-secondary shadow-md"
                        />
                        <div className="text-gray-300 text-lg leading-relaxed">
                            <p className="mb-3">
                                <strong>Deep Dey</strong> — the creator and visionary mind behind <strong>QuickLink</strong>.  
                                A student and JEE aspirant driven by curiosity, precision, and the belief that small ideas can grow into impactful tools.  
                                QuickLink wasn’t built from a business plan — it was born from frustration. Constantly juggling long URLs, broken links, and cluttered sharing methods, Deep set out to build something clean, fast, and human.
                            </p>
                            <p className="mb-3">
                                Starting as a small experiment in web development, QuickLink evolved into a full-fledged platform for link shortening and QR generation.  
                                Every feature — from secure redirects to QR customization — reflects a single question he asked himself:  
                                <em>“How can sharing information feel effortless and smart at the same time?”</em>
                            </p>
                            <p>
                                When he’s not writing code or improving QuickLink, Deep spends time learning about AI, building new projects, and inspiring others chasing their own IIT or tech dreams.  
                                QuickLink is more than a product — it’s proof that vision and persistence can turn an idea into something real.
                            </p>
                        </div>
                    </div>
                </div>

    );
};

export default AboutPage;
