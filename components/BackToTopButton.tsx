import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ArrowUpIcon } from './icons/IconComponents';

const BackToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const portalRoot = document.getElementById('portal-root');

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    if (!portalRoot) {
        return null;
    }

    return ReactDOM.createPortal(
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 p-3 rounded-full bg-brand-primary/80 backdrop-blur-sm text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.6)] hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-offset-2 focus:ring-offset-brand-dark transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            aria-label="Go to top"
        >
            <ArrowUpIcon className="h-6 w-6" />
        </button>,
        portalRoot
    );
};

export default BackToTopButton;