import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { CrownIcon } from './icons/IconComponents';

const PRICING_MAP: Record<string, { label: string }> = {
    'monthly': { label: 'Monthly' },
    'semi-annually': { label: '6-Month' },
    'yearly': { label: 'Yearly' },
};

const SubscriptionStatus: React.FC = () => {
    const auth = useContext(AuthContext);

    if (!auth || !auth.currentUser) return null;

    const { currentUser, openSubscriptionModal } = auth;
    const { subscription } = currentUser;
    const isSubscribed = subscription && subscription.expiresAt > Date.now();

    return (
        <div className={`p-6 rounded-2xl mb-8 border ${isSubscribed ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <CrownIcon className={`h-10 w-10 flex-shrink-0 ${isSubscribed ? 'text-green-400' : 'text-gray-500'}`} />
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {isSubscribed && subscription ? `You are on the ${PRICING_MAP[subscription.planId].label} Plan!` : 'Subscription Status'}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {isSubscribed && subscription ? `Your benefits are active until ${new Date(subscription.expiresAt).toLocaleDateString()}.` : 'Subscribe to get longer-lasting links.'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={openSubscriptionModal}
                    className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-brand-dark bg-green-500 rounded-md hover:bg-green-400 transition-all transform hover:scale-105 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                >
                    {isSubscribed ? 'Manage Subscription' : 'Subscribe Now'}
                </button>
            </div>
        </div>
    );
};

export default SubscriptionStatus;