import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import { api } from '../api';
import { PaymentRecord, RazorpayOrder, RazorpaySuccessResponse, CashfreeOrder, AuthContextType, Product } from '../types';
import { XIcon, LoadingIcon, CheckIcon, WarningIcon } from './icons/IconComponents';
import CouponInput from './CouponInput';

interface ShopPaymentModalProps {
    product: Product;
    onClose: () => void;
}

const ShopPaymentModal: React.FC<ShopPaymentModalProps> = ({ product, onClose }) => {
    const auth = useContext(AuthContext) as AuthContextType;
    const urlContext = useContext(UrlContext);
    const { currentUser, openAuthModal, updateUserData } = auth || {};

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState<'selection' | 'success' | 'failed' | 'cancelled'>('selection');
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cashfree' | null>(null);

    // Coupon State
    const [couponCode, setCouponCode] = useState<string>('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const finalPrice = Math.max(0, product.price - discountAmount);

    if (!urlContext) return null;

    const handleApplyCoupon = async (code: string) => {
        if (!currentUser) {
            openAuthModal?.('login');
            return { isValid: false, message: 'You must be logged in to use a coupon.', discountAmount: 0 };
        }
        // This is a mock verification for UI. Real verification happens server-side.
        try {
            const response = await fetch(`/api/shop?type=coupon&action=verify&code=${code}&userId=${currentUser.id}&basePrice=${product.price}`);
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
    
    const onPaymentSuccess = async (paymentId: string) => {
        if (!currentUser) return;

        setView('success');
        setIsLoading(false);
        setPaymentMethod(null);

        try {
            await api.fulfillPurchase({
                userId: currentUser.id,
                productId: product.id,
                paymentId: paymentId,
                couponCode: couponCode || undefined
            });

            await urlContext.addPaymentRecord({
                id: paymentId,
                paymentId: paymentId,
                userId: currentUser.id,
                userEmail: currentUser.email,
                amount: finalPrice,
                currency: 'INR',
                durationLabel: `Shop: ${product.name}`,
                couponCode: couponCode || undefined,
                createdAt: Date.now(),
            });
            
            // Refetch user data to update subscription status in UI
            const user = await api.login(currentUser.email, currentUser.passwordHash); // Mock re-login
            updateUserData(user.id, user);

        } catch (err: any) {
             console.error(`Post-purchase fulfillment failed, but user was shown success. Error: ${err.message}`);
        }
    };

    const handleRazorpayPayment = async () => {
        if (!currentUser) { openAuthModal?.('login'); return; }
        setIsLoading(true);
        setError('');
        setPaymentMethod('razorpay');
        
        try {
            const res = await fetch('/api/payments?action=create_order&provider=razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: product.price, currency: 'INR', userId: currentUser.id, couponCode })
            });
            if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
            const order: RazorpayOrder = await res.json();

            const options = {
                key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: product.name,
                description: `Purchase from QuickLink Shop`,
                order_id: order.id,
                handler: async (response: RazorpaySuccessResponse) => {
                    setIsLoading(true);
                    await onPaymentSuccess(response.razorpay_payment_id);
                },
                prefill: { name: currentUser.name, email: currentUser.email },
                theme: { color: '#00e5ff' },
                modal: { ondismiss: () => { if (view === 'selection') { setView('cancelled'); setIsLoading(false); setPaymentMethod(null); } } }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setIsLoading(false);
        } catch (err: any) {
            setError(`Payment failed: ${err.message}`);
            setView('failed');
            setIsLoading(false);
            setPaymentMethod(null);
        }
    };

     const renderContent = () => {
        switch (view) {
            case 'success': return (<div className="text-center p-8"><CheckIcon className="mx-auto h-16 w-16 text-green-500 animate-check-pop" /><h2 className="text-3xl font-bold text-white mt-4">Thank You!</h2><p className="text-gray-400 my-4">Your purchase was successful. Your benefits have been applied.</p><button onClick={onClose} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Close</button></div>);
            case 'failed': return (<div className="text-center p-8"><XIcon className="mx-auto h-16 w-16 text-red-500" /><h2 className="text-3xl font-bold text-white mt-4">Payment Failed</h2><p className="text-gray-400 my-4 break-words">{error}</p><button onClick={onClose} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Close</button></div>);
            case 'cancelled': return (<div className="text-center p-8"><WarningIcon className="mx-auto h-16 w-16 text-yellow-500" /><h2 className="text-3xl font-bold text-white mt-4">Payment Cancelled</h2><p className="text-gray-400 my-4">Your transaction was cancelled.</p><button onClick={() => setView('selection')} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Try Again</button></div>);
            default: return (<><div className="text-center"><h2 className="text-3xl font-bold text-white mt-4">Complete Your Purchase</h2><p className="text-gray-400 mb-2">{product.name}</p></div><div className="p-4 my-4 bg-black/30 rounded-lg space-y-2 text-sm"><div className="flex justify-between text-gray-400"><span>Base Price:</span><span>₹{product.price.toFixed(2)}</span></div>{discountAmount > 0 && <div className="flex justify-between text-green-400"><span>Coupon Discount:</span><span>- ₹{discountAmount.toFixed(2)}</span></div>}<div className="flex justify-between text-white font-bold text-lg border-t border-white/20 pt-2 mt-2"><span>Final Price:</span><span>₹{finalPrice.toFixed(2)}</span></div></div><div className="mb-6"><CouponInput onApply={handleApplyCoupon} /></div><div className="mt-4 space-y-4"><button onClick={handleRazorpayPayment} disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-green-500 px-3 py-3 font-semibold text-brand-dark hover:bg-green-400 disabled:opacity-50">{isLoading && paymentMethod === 'razorpay' ? <LoadingIcon className="animate-spin h-5 w-5" /> : `Pay ₹${finalPrice.toFixed(2)} with Razorpay`}</button></div></>);
        }
    };

    return (<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}><div className="relative w-full max-w-md glass-card rounded-2xl p-8 my-8" onClick={e => e.stopPropagation()}><button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><XIcon className="h-6 w-6"/></button>{renderContent()}</div></div>);
};

export default ShopPaymentModal;
