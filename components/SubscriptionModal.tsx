import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import { PaymentRecord, RazorpayOrder, RazorpaySuccessResponse, CashfreeOrder, AuthContextType } from '../types';
import { XIcon, LoadingIcon, CrownIcon, CheckIcon, WarningIcon } from './icons/IconComponents';
import CouponInput from './CouponInput';
import { api } from '../api';

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
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cashfree' | null>(null);

    // Coupon State
    const [couponCode, setCouponCode] = useState<string>('');
    const [discountAmount, setDiscountAmount] = useState(0);

    if (!auth || !urlContext || !auth.currentUser) return null;
    const { currentUser, updateUserSubscription } = auth;

    const planDetails = SUBSCRIPTION_PLANS[selectedPlan];
    const finalPrice = Math.max(0, planDetails.price - discountAmount);
    
    const handleApplyCoupon = async (code: string) => {
        try {
            const response = await fetch(`/api/shop?type=coupon&action=verify&code=${code}&userId=${currentUser.id}&basePrice=${planDetails.price}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setDiscountAmount(data.discountAmount);
            setCouponCode(data.isValid ? code : '');
            return { isValid: data.isValid, message: data.message, discountAmount: data.discountAmount };

        } catch (err: any) {
            setDiscountAmount(0);
            setCouponCode('');
            return { isValid: false, message: err.message, discountAmount: 0 };
        }
    };

    const handleRazorpayPayment = async () => {
        setIsLoading(true);
        setError('');
        setPaymentMethod('razorpay');
        
        try {
            const orderResponse = await fetch('/api/payments?action=create_order&provider=razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: planDetails.price, currency: 'INR', userId: currentUser.id, couponCode })
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.error || 'Could not create payment order.');
            }

            const order: RazorpayOrder = await orderResponse.json();

            const options = {
                key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID,
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
                            amount: finalPrice,
                            currency: 'INR',
                            durationLabel: planDetails.label,
                            couponCode: couponCode || undefined,
                            createdAt: Date.now(),
                        };
                        await urlContext.addPaymentRecord(paymentRecord);
                        
                        setView('success');
                    } catch (updateError: any) {
                        setError(`Payment was successful, but failed to update subscription. Please contact support. Error: ${updateError.message}`);
                        setView('failed');
                    } finally {
                        setIsLoading(false);
                        setPaymentMethod(null);
                    }
                },
                prefill: { name: currentUser.name, email: currentUser.email },
                theme: { color: '#00e5ff' },
                modal: { ondismiss: () => { if (view === 'selection') { setView('cancelled'); setIsLoading(false); setPaymentMethod(null); } } }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setIsLoading(false);

        } catch (err: any) {
            console.error("Payment failed:", err);
            setError(`Payment failed: ${err.message}`);
            setView('failed');
            setIsLoading(false);
            setPaymentMethod(null);
        }
    };
    
    const renderContent = () => {
        switch (view) {
            case 'success': return (<div className="text-center p-8"><CheckIcon className="mx-auto h-16 w-16 text-green-500 animate-check-pop" /><h2 className="text-3xl font-bold text-white mt-4">Thank You!</h2><p className="text-gray-400 my-4">Your subscription is now active.</p><button onClick={onClose} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Close</button></div>);
            case 'failed': return (<div className="text-center p-8"><XIcon className="mx-auto h-16 w-16 text-red-500" /><h2 className="text-3xl font-bold text-white mt-4">Payment Failed</h2><p className="text-gray-400 my-4 break-words">{error}</p><button onClick={onClose} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Close</button></div>);
            case 'cancelled': return (<div className="text-center p-8"><WarningIcon className="mx-auto h-16 w-16 text-yellow-500" /><h2 className="text-3xl font-bold text-white mt-4">Payment Cancelled</h2><p className="text-gray-400 my-4">Your transaction was cancelled.</p><button onClick={() => setView('selection')} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Try Again</button></div>);
            default: return (<><div className="text-center"><CrownIcon className="mx-auto h-12 w-12 text-green-400" /><h2 id="sub-modal-title" className="text-3xl font-bold text-white mt-4">Choose Your Plan</h2><p className="text-gray-400 mb-8">Select a one-time payment for longer-lasting links.</p></div><div className="grid md:grid-cols-3 gap-4 mb-6">{Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (<button key={id} onClick={() => setSelectedPlan(id as PlanId)} className={`p-6 rounded-lg border-2 text-left transition-all ${selectedPlan === id ? 'border-brand-primary bg-brand-primary/10 scale-105' : 'border-white/20 bg-black/30 hover:border-white/30'}`}><h3 className="text-xl font-bold text-white">{plan.label}</h3><p className="text-3xl font-bold text-brand-primary my-2">₹{plan.price}</p><p className="text-sm text-gray-400 mb-4">{plan.description}</p>{selectedPlan === id && <CheckIcon className="h-6 w-6 text-brand-primary" />}</button>))}</div><div className="p-4 my-4 bg-black/30 rounded-lg space-y-2"><div className="flex justify-between text-gray-400 text-sm"><span>Base Price:</span><span>₹{planDetails.price.toFixed(2)}</span></div>{discountAmount > 0 && <div className="flex justify-between text-green-400 text-sm"><span>Coupon Discount:</span><span>- ₹{discountAmount.toFixed(2)}</span></div>}<div className="flex justify-between text-white font-bold text-lg border-t border-white/20 pt-2 mt-2"><span>Final Price:</span><span>₹{finalPrice.toFixed(2)}</span></div></div><div className="my-6"><CouponInput onApply={handleApplyCoupon} /></div><div className="mt-4"><button onClick={handleRazorpayPayment} disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-green-500 px-3 py-3 text-base font-semibold text-brand-dark shadow-sm hover:bg-green-400 disabled:opacity-50">{isLoading && paymentMethod === 'razorpay' ? <LoadingIcon className="animate-spin h-5 w-5" /> : `Pay ₹${finalPrice.toFixed(2)} with Razorpay`}</button></div></>);
        }
    };

    return (<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="sub-modal-title"><div className="relative w-full max-w-2xl glass-card rounded-2xl p-8 my-8" onClick={e => e.stopPropagation()}><button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white" aria-label="Close subscription modal"><XIcon className="h-6 w-6"/></button>{renderContent()}</div></div>);
};

export default SubscriptionModal;
