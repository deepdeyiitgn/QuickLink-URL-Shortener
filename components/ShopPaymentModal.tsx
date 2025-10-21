import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Product, RazorpayOrder, AuthContextType } from '../types';
import { XIcon, LoadingIcon, CheckIcon, WarningIcon } from './icons/IconComponents';
import CouponInput from './CouponInput';
import { api } from '../api';

interface ShopPaymentModalProps {
    product: Product;
    onClose: () => void;
}

const ShopPaymentModal: React.FC<ShopPaymentModalProps> = ({ product, onClose }) => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser } = auth;
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState<'selection' | 'success' | 'failed' | 'cancelled'>('selection');
    
    const [couponCode, setCouponCode] = useState<string>('');
    const [discountAmount, setDiscountAmount] = useState(0);

    if (!currentUser) {
        // This modal should only open for logged-in users.
        // A simple message and close button if state is somehow broken.
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                 <div className="relative w-full max-w-md glass-card rounded-2xl p-8">
                     <p>Please log in to make a purchase.</p>
                     <button onClick={onClose} className="mt-4">Close</button>
                 </div>
            </div>
        )
    }

    const finalPrice = Math.max(0, product.price - discountAmount);

     const handleApplyCoupon = async (code: string) => {
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

    const handlePayment = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const orderResponse = await fetch('/api/payments?action=create_order&provider=razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: product.price, currency: 'INR', userId: currentUser.id, couponCode })
            });
            if (!orderResponse.ok) throw new Error((await orderResponse.json()).error);
            const order: RazorpayOrder = await orderResponse.json();

            const options = {
                key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: product.name,
                description: 'QuickLink Shop Purchase',
                order_id: order.id,
                handler: async function (response: any) {
                    setIsLoading(true);
                    try {
                        await api.fulfillPurchase({ 
                            userId: currentUser.id,
                            productId: product.id,
                            paymentId: response.razorpay_payment_id,
                            couponCode: couponCode || undefined
                        });
                        setView('success');
                    } catch (err: any) {
                        setError(`Payment was successful, but failed to apply benefit. Please contact support. Error: ${err.message}`);
                        setView('failed');
                    } finally {
                        setIsLoading(false);
                    }
                },
                prefill: { name: currentUser.name, email: currentUser.email },
                theme: { color: '#00e5ff' },
                modal: { ondismiss: () => { if (view === 'selection') { setView('cancelled'); setIsLoading(false); } } }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
            setIsLoading(false);
        } catch (err: any) {
            setError(`Payment failed: ${err.message}`);
            setView('failed');
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'success': return (<div className="text-center p-8"><CheckIcon className="mx-auto h-16 w-16 text-green-500 animate-check-pop" /><h2 className="text-3xl font-bold text-white mt-4">Purchase Complete!</h2><p className="text-gray-400 my-4">Thank you for your purchase. Your new benefits are now active.</p><button onClick={onClose} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Close</button></div>);
            case 'failed': return (<div className="text-center p-8"><XIcon className="mx-auto h-16 w-16 text-red-500" /><h2 className="text-3xl font-bold text-white mt-4">Payment Failed</h2><p className="text-gray-400 my-4 break-words">{error}</p><button onClick={onClose} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Close</button></div>);
            case 'cancelled': return (<div className="text-center p-8"><WarningIcon className="mx-auto h-16 w-16 text-yellow-500" /><h2 className="text-3xl font-bold text-white mt-4">Payment Cancelled</h2><p className="text-gray-400 my-4">Your transaction was cancelled.</p><button onClick={() => setView('selection')} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Try Again</button></div>);
            default: return (
                <>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mt-4">Confirm Your Purchase</h2>
                        <p className="text-gray-400 mb-6">You are about to purchase: <span className="font-bold text-brand-primary">{product.name}</span></p>
                    </div>

                    <div className="p-4 my-4 bg-black/30 rounded-lg space-y-2">
                        <div className="flex justify-between text-gray-400 text-sm"><span>Base Price:</span><span>₹{product.price.toFixed(2)}</span></div>
                        {discountAmount > 0 && <div className="flex justify-between text-green-400 text-sm"><span>Coupon Discount:</span><span>- ₹{discountAmount.toFixed(2)}</span></div>}
                        <div className="flex justify-between text-white font-bold text-lg border-t border-white/20 pt-2 mt-2"><span>Final Price:</span><span>₹{finalPrice.toFixed(2)}</span></div>
                    </div>

                    <div className="my-6">
                        <CouponInput onApply={handleApplyCoupon} />
                    </div>

                    <div className="mt-4">
                        <button onClick={handlePayment} disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-green-500 px-3 py-3 text-base font-semibold text-brand-dark shadow-sm hover:bg-green-400 disabled:opacity-50">
                            {isLoading ? <LoadingIcon className="animate-spin h-5 w-5" /> : `Pay ₹${finalPrice.toFixed(2)} with Razorpay`}
                        </button>
                    </div>
                </>
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="relative w-full max-w-md glass-card rounded-2xl p-8 my-8" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><XIcon className="h-6 w-6"/></button>
                {renderContent()}
            </div>
        </div>
    );
};

export default ShopPaymentModal;
