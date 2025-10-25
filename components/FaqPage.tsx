import React from 'react';
import { faqData } from '../faqData';
import FaqItem from './FaqItem';
import AboutFaq from './AboutFaq';
import HowToUseFaq from './HowToUseFaq';

const FaqPage: React.FC = () => {
    return (
        <div className="space-y-12">
            <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-aurora">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Have questions? We've got answers. If you can't find what you're looking for, feel free to reach out to us on our social media channels.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto">
                    {faqData.map((item, index) => (
                        <FaqItem key={index} question={item.question} answer={item.answer} />
                    ))}
                </div>
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-2">
                <AboutFaq />
                <HowToUseFaq />
            </div>
        </div>
    );
};

export default FaqPage;