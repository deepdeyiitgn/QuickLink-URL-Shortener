import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import { PaymentRecord, RazorpayOrder, RazorpaySuccessResponse } from '../types';
import { XIcon, LoadingIcon, CrownIcon, CheckIcon, WarningIcon } from './icons/IconComponents';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface SubscriptionModalProps {
    onClose: () => void;
}

type PlanId = 'monthly' | 'semi-annually' | 'yearly';

const SUBSCRIPTION_PLANS: Record<PlanId, { price: number; days: number; label: string; description: string }> = {
    'monthly': { price: 50, days: 30, label: 'Monthly', description: 'Great for short-term projects.' },
    'semi-annually': { price: 100, days: 180, label: '6 Months', description: 'Best value for regular use.' },
    'yearly': { price: 500, days: 365, label: '1 Year', description: 'Set it and forget it.' },
};

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
    const auth = useContext(AuthContext);
    const urlContext = useContext(UrlContext);
    const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState<'selection' | 'success' | 'failed' | 'cancelled'>('selection');

    if (!auth || !urlContext || !auth.currentUser) return null;
    const { currentUser, updateUserSubscription } = auth;

    const handlePayment = async () => {
        setIsLoading(true);
        setError('');
        
        const planDetails = SUBSCRIPTION_PLANS[selectedPlan];

        try {
            const orderResponse = await fetch('/api/create-razorpay-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: planDetails.price, currency: 'INR' })
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.error || 'Could not create payment order.');
            }

            const order: RazorpayOrder = await orderResponse.json();

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'QuickLink Subscription',
                description: `${planDetails.label} Plan`,
                order_id: order.id,
                handler: async function (response: RazorpaySuccessResponse) {
                    setIsLoading(true);
                    try {
                        const expiresAt = Date.now() + (planDetails.days * 24 * 60 * 60 * 1000);
                        await updateUserSubscription(selectedPlan, expiresAt);

                        const paymentRecord: PaymentRecord = {
                            id: response.razorpay_payment_id,
                            paymentId: response.razorpay_payment_id,
                            userId: currentUser.id,
                            userEmail: currentUser.email,
                            amount: planDetails.price,
                            currency: 'INR',
                            durationLabel: planDetails.label,
                            createdAt: Date.now(),
                        };
                        await urlContext.addPaymentRecord(paymentRecord);
                        
                        setView('success');
                    } catch (updateError: any) {
                        setError(`Payment was successful, but failed to update subscription. Please contact support. Error: ${updateError.message}`);
                        setView('failed');
                    } finally {
                        setIsLoading(false);
                    }
                },
                prefill: {
                    name: currentUser.name,
                    email: currentUser.email,
                },
                theme: { color: '#00e5ff' },
                modal: {
                    ondismiss: function() {
                        // This function is called when the modal is closed by the user.
                        // We only want to show the 'cancelled' view if a payment wasn't already successful or failed.
                        if (view === 'selection') {
                             setView('cancelled');
                             setIsLoading(false);
                        }
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setIsLoading(false);

        } catch (err: any) {
            console.error("Payment failed:", err);
            setError(`Payment failed: ${err.message}`);
            setView('failed');
            setIsLoading(false);
        }
    };
    
    const planDetails = SUBSCRIPTION_PLANS[selectedPlan];

    const renderContent = () => {
        switch (view) {
            case 'success':
                return (
                    <div className="text-center p-8">
                        <CheckIcon className="mx-auto h-16 w-16 text-green-500 animate-check-pop" />
                        <h2 className="text-3xl font-bold text-white mt-4">Thank You!</h2>
                        <p className="text-gray-400 my-4">Your payment was successful and your subscription is now active.</p>
                        <button onClick={onClose} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80">
                            Close
                        </button>
                    </div>
                );
            case 'failed':
                return (
                    <div className="text-center p-8">
                        <XIcon className="mx-auto h-16 w-16 text-red-500" />
                        <h2 className="text-3xl font-bold text-white mt-4">Payment Failed</h2>
                        <p className="text-gray-400 my-4 break-words">{error || 'An unexpected error occurred. Please try again.'}</p>
                        <button onClick={onClose} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80">
                            Close
                        </button>
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="text-center p-8">
                        <WarningIcon className="mx-auto h-16 w-16 text-yellow-500" />
                        <h2 className="text-3xl font-bold text-white mt-4">Payment Cancelled</h2>
                        <p className="text-gray-400 my-4">Your transaction was cancelled. You can try again anytime.</p>
                        <button onClick={() => setView('selection')} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80">
                            Try Again
                        </button>
                    </div>
                );
            case 'selection':
            default:
                return (
                    <>
                        <div className="text-center">
                            <CrownIcon className="mx-auto h-12 w-12 text-green-400" />
                            <h2 id="sub-modal-title" className="text-3xl font-bold text-white mt-4">Choose Your Plan</h2>
                            <p className="text-gray-400 mb-8">Select a one-time payment for longer-lasting links.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            {Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (
                                <button key={id} onClick={() => setSelectedPlan(id as PlanId)} className={`p-6 rounded-lg border-2 text-left transition-all ${selectedPlan === id ? 'border-brand-primary bg-brand-primary/10 scale-105' : 'border-white/20 bg-black/30 hover:border-white/30'}`}>
                                    <h3 className="text-xl font-bold text-white">{plan.label}</h3>
                                    <p className="text-3xl font-bold text-brand-primary my-2">₹{plan.price}</p>
                                    <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                                    {selectedPlan === id && <CheckIcon className="h-6 w-6 text-brand-primary" />}
                                </button>
                            ))}
                        </div>
                        
                        <button onClick={handlePayment} disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-green-500 px-3 py-4 text-lg font-semibold text-brand-dark shadow-sm hover:bg-green-400 disabled:opacity-50 transition-all mt-4">
                            {isLoading ? <LoadingIcon className="animate-spin h-5 w-5" /> : `Proceed to Pay ₹${planDetails.price}`}
                        </button>
                    </>
                );
        }
    };

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="sub-modal-title">
        <div className="relative w-full max-w-2xl glass-card rounded-2xl p-8" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white" aria-label="Close subscription modal">
                <XIcon className="h-6 w-6"/>
            </button>
            {renderContent()}
        </div>
    </div>
    );
};

export default SubscriptionModal;