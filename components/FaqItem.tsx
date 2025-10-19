
import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/IconComponents';

interface FaqItemProps {
    question: string;
    answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-5 px-2 focus:outline-none focus-visible:ring focus-visible:ring-brand-primary focus-visible:ring-opacity-75"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-semibold text-white">{question}</span>
                <ChevronDownIcon
                    className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="pb-5 px-2 text-gray-300" dangerouslySetInnerHTML={{ __html: answer }} />
            </div>
        </div>
    );
};

export default FaqItem;
