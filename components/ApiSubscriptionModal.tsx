

// FIX: Removed reference to vite/client types to resolve "Cannot find type definition" error.
import React, { useState, useContext } from 'react';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext'; // For payment records
// FIX: Corrected import path for types
import { PaymentRecord, RazorpayOrder, RazorpaySuccessResponse, CashfreeOrder, AuthContextType } from '../types';
import { XIcon, LoadingIcon, CrownIcon, CheckIcon, WarningIcon } from './icons/IconComponents';

interface ApiSubscriptionModalProps {
    onClose: () => void;
}

type ApiPlanId = 'basic' | 'pro';

const API_PLANS: Record<ApiPlanId, { price: number; months: number; label: string; description: string }> = {
    'basic': { price: 500, months: 6, label: '6 Months', description: 'Perfect for growing projects.' },
    'pro': { price: 1000, months: 12, label: '1 Year', description: 'For power users and businesses.' },
};

const ApiSubscriptionModal: React.FC<ApiSubscriptionModalProps> = ({ onClose }) => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const urlContext = useContext(UrlContext);
    const [selectedPlan, setSelectedPlan] = useState<ApiPlanId>('pro');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState<'selection' | 'success' | 'failed' | 'cancelled'>('selection');
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cashfree' | null>(null);

    if (!auth || !urlContext || !auth.currentUser) return null;
    const { currentUser, purchaseApiKey } = auth;

    const handleRazorpayPayment = async () => {
        setIsLoading(true);
        setError('');
        setPaymentMethod('razorpay');
        
        const planDetails = API_PLANS[selectedPlan];

        try {
            const orderResponse = await fetch('/api/payments?action=create_order&provider=razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: planDetails.price, currency: 'INR' })
            });

            if (!orderResponse.ok) {
                let errorText;
                try {
                    const errorData = await orderResponse.json();
                    errorText = errorData.error || 'Could not create payment order.';
                } catch (e) {
                    errorText = 'An unexpected server error occurred. Please try again later.';
                }
                throw new Error(errorText);
            }

            let order: RazorpayOrder;
            try {
                order = await orderResponse.json();
            } catch(e) {
                throw new Error('Received an invalid response from the payment server.');
            }

            const options = {
                // FIX: Use type assertion to silence TypeScript error about import.meta.env in non-Vite environments.
                key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'QuickLink API Plan',
                description: `API ${planDetails.label} Plan`,
                order_id: order.id,
                handler: async function (response: RazorpaySuccessResponse) {
                    setIsLoading(true);
                    try {
                        const days = planDetails.months * 30;
                        const expiresAt = Date.now() + (days * 24 * 60 * 60 * 1000);
                        
                        await purchaseApiKey(selectedPlan, expiresAt);
                        
                        const paymentRecord: PaymentRecord = {
                            id: response.razorpay_payment_id,
                            paymentId: response.razorpay_payment_id,
                            userId: currentUser.id,
                            userEmail: currentUser.email,
                            amount: planDetails.price,
                            currency: 'INR',
                            durationLabel: `API ${planDetails.label} Plan`,
                            createdAt: Date.now(),
                        };
                        await urlContext.addPaymentRecord(paymentRecord);

                        setView('success');
                    } catch (updateError: any) {
                        setError(`Payment was successful, but failed to update API plan. Please contact support. Error: ${updateError.message}`);
                        setView('failed');
                    } finally {
                        setIsLoading(false);
                        setPaymentMethod(null);
                    }
                },
                prefill: {
                    name: currentUser.name,
                    email: currentUser.email,
                },
                theme: { color: '#00e5ff' },
                modal: {
                    ondismiss: function() {
                        if (view === 'selection') {
                            setView('cancelled');
                            setIsLoading(false);
                            setPaymentMethod(null);
                        }
                    }
                }
            };
            
            // FIX: Rely on global type declaration from types.ts
            const rzp = new window.Razorpay(options);
            rzp.open();
            setIsLoading(false);

        } catch (err: any) {
            console.error('API Plan Payment Failed:', err);
            setError(`Payment failed: ${err.message}`);
            setView('failed');
            setIsLoading(false);
            setPaymentMethod(null);
        }
    };
    
    const handleCashfreePayment = async () => {
        setIsLoading(true);
        setError('');
        setPaymentMethod('cashfree');
        const planDetails = API_PLANS[selectedPlan];

        try {
            const orderResponse = await fetch('/api/payments?action=create_order&provider=cashfree', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: planDetails.price, currency: 'INR', user: currentUser })
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.error || 'Could not create Cashfree payment order.');
            }

            const order: CashfreeOrder = await orderResponse.json();
            
            // FIX: Rely on global type declaration from types.ts
            const cashfree = new window.Cashfree({ mode: "production" });

            cashfree.checkout({
                paymentSessionId: order.payment_session_id,
                components: ["upi"],
            }).then(async (result: any) => {
                if (result.error) {
                    setError(`Payment failed: ${result.error.message}`);
                    setView('failed');
                    setIsLoading(false);
                    setPaymentMethod(null);
                    return;
                }

                if (result.paymentDetails && result.paymentDetails.paymentStatus === 'SUCCESS') {
                    setIsLoading(true);
                    try {
                        const days = planDetails.months * 30;
                        const expiresAt = Date.now() + (days * 24 * 60 * 60 * 1000);
                        await purchaseApiKey(selectedPlan, expiresAt);

                        const paymentRecord: PaymentRecord = {
                            id: result.paymentDetails.cfPaymentId,
                            paymentId: result.paymentDetails.cfPaymentId,
                            userId: currentUser.id,
                            userEmail: currentUser.email,
                            amount: planDetails.price,
                            currency: 'INR',
                            durationLabel: `API ${planDetails.label} Plan`,
                            createdAt: Date.now(),
                        };
                        await urlContext.addPaymentRecord(paymentRecord);
                        setView('success');
                    } catch (updateError: any) {
                        setError(`Payment was successful, but failed to update API plan. Please contact support. Error: ${updateError.message}`);
                        setView('failed');
                    } finally {
                        setIsLoading(false);
                        setPaymentMethod(null);
                    }
                } else {
                    setError(`Payment was not successful. Status: ${result.paymentDetails?.paymentStatus}. Please try again.`);
                    setView('cancelled');
                    setIsLoading(false);
                    setPaymentMethod(null);
                }
            });

        } catch (err: any) {
            console.error('Cashfree API Plan Payment Failed:', err);
            setError(`Payment failed: ${err.message}`);
            setView('failed');
            setIsLoading(false);
            setPaymentMethod(null);
        }
    };
    
    const planDetails = API_PLANS[selectedPlan];

    const renderContent = () => {
        switch (view) {
            case 'success':
                return (
                    <div className="text-center p-8">
                        <CheckIcon className="mx-auto h-16 w-16 text-green-500 animate-check-pop" />
                        <h2 className="text-3xl font-bold text-white mt-4">Upgrade Successful!</h2>
                        <p className="text-gray-400 my-4">Thank you! Your API key has been upgraded with the {planDetails.label} plan.</p>
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
                            <h2 className="text-3xl font-bold text-white mt-4">Upgrade API Access</h2>
                            <p className="text-gray-400 mb-8">Choose a plan to continue using the API.</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {Object.entries(API_PLANS).map(([id, plan]) => (
                                <button 
                                    key={id} 
                                    onClick={() => setSelectedPlan(id as ApiPlanId)}
                                    className={`p-6 rounded-lg border-2 text-left transition-all ${selectedPlan === id ? 'border-brand-primary bg-brand-primary/10 scale-105' : 'border-white/20 bg-black/30 hover:border-white/30'}`}
                                >
                                    <h3 className="text-xl font-bold text-white">{plan.label}</h3>
                                    <p className="text-3xl font-bold text-brand-primary my-2">₹{plan.price}</p>
                                    <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                                    {selectedPlan === id && <CheckIcon className="h-6 w-6 text-brand-primary" />}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 space-y-4">
                            <p className="text-center text-sm text-gray-400">Choose a payment method to proceed:</p>
                             <button onClick={handleRazorpayPayment} disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-green-500 px-3 py-3 text-base font-semibold text-brand-dark shadow-sm hover:bg-green-400 disabled:opacity-50 transition-all">
                                {isLoading && paymentMethod === 'razorpay' ? <LoadingIcon className="animate-spin h-5 w-5" /> : `Pay ₹${planDetails.price} with Razorpay (All Options)`}
                            </button>
                            <button onClick={handleCashfreePayment} disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-blue-600 px-3 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 transition-all">
                                {isLoading && paymentMethod === 'cashfree' ? <LoadingIcon className="animate-spin h-5 w-5" /> : `Pay ₹${planDetails.price} with Cashfree (UPI Only)`}
                            </button>
                        </div>
                    </>
                );
        }
    };


    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto" onClick={onClose} role="dialog">
        <div className="relative w-full max-w-xl glass-card rounded-2xl p-8 my-8" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                <XIcon className="h-6 w-6"/>
            </button>
            {renderContent()}
        </div>
    </div>
    );
};

export default ApiSubscriptionModal;
