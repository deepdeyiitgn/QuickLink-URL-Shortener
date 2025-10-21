import React, { useEffect, useState } from 'react';
import { XIcon } from './icons/IconComponents';

interface AdComponentProps {
    type: 'display' | 'multiplex' | 'in-feed';
}

const AdComponent: React.FC<AdComponentProps> = ({ type }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, [type]);

    if (!isVisible) {
        return null;
    }

    const adSlots = {
        display: "3287928373",
        multiplex: "6337597697",
        'in-feed': "2859525296",
    };

    const getAdContent = () => {
        switch (type) {
            case 'display':
                return (
                    <ins className="adsbygoogle"
                         style={{ display: 'block' }}
                         data-ad-client="ca-pub-2533086861741403"
                         data-ad-slot={adSlots.display}
                         data-ad-format="auto"
                         data-full-width-responsive="true"></ins>
                );
            case 'multiplex':
                return (
                    <ins className="adsbygoogle"
                         style={{ display: 'block' }}
                         data-ad-format="autorelaxed"
                         data-ad-client="ca-pub-2533086861741403"
                         data-ad-slot={adSlots.multiplex}></ins>
                );
            case 'in-feed':
                return (
                    <ins className="adsbygoogle"
                         style={{ display: 'block', width: '100%', height: '90px' }}
                         data-ad-client="ca-pub-2533086861741403"
                         data-ad-slot={adSlots['in-feed']}></ins>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="relative bg-black/20 p-2 rounded-lg border border-white/10 text-center">
            <div className="absolute top-0 left-1 text-xs text-gray-600 font-semibold select-none">Ad</div>
            <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-1 right-1 p-1 text-gray-600 hover:text-white rounded-full hover:bg-white/10"
                aria-label="Close ad"
            >
                <XIcon className="h-3 w-3" />
            </button>
            {getAdContent()}
        </div>
    );
};

export default AdComponent;
