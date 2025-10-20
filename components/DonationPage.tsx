
// FIX: Removed reference to vite/client types to resolve "Cannot find type definition" error.
import React, { useState, useContext, useEffect, useMemo } from 'react';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
// FIX: Corrected import path for types
import { Donation, RazorpayOrder, RazorpaySuccessResponse, CashfreeOrder, AuthContextType } from '../types';
import { XIcon, LoadingIcon, HeartIcon, CheckIcon, WarningIcon } from './icons/IconComponents';
// FIX: Corrected import path for api
import { api } from '../api';

const PRESET_AMOUNTS = [10, 50, 100, 500, 1000];

const DonationPage: React.FC = () => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, updateUserAsDonor, openAuthModal } = auth || {};
    
    const [amount, setAmount] = useState(100);
    const [customAmount, setCustomAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState<'selection' | 'success' | 'failed' | 'cancelled'>('selection');
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cashfree' | null>(null);
    const [donations, setDonations] = useState<Donation[]>([]);

    useEffect(() => {
        api.getDonations().then(setDonations);
    }, []);

    const handleAmountClick = (value: number) => {
        setAmount(value);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const numValue = parseInt(value, 10);
        if (value === '' || (numValue >= 1 && numValue <= 2000)) {
            setCustomAmount(value);
            if (value !== '') {
                setAmount(numValue);
            }
        }
    };
    
    const handlePayment = (method: 'razorpay' | 'cashfree') => {
        if (!currentUser) {
            openAuthModal?.('login');
            return;
        }
        if (method === 'razorpay') handleRazorpayPayment();
        if (method === 'cashfree') handleCashfreePayment();
    };

    const onPaymentSuccess = async () => {
        if (!currentUser) return;
        try {
            await api.addDonation({
                userId: currentUser.id,
                userName: currentUser.name,
                amount: amount,
            });
            await updateUserAsDonor?.(currentUser.id);
            const latestDonations = await api.getDonations();
            setDonations(latestDonations);
            setView('success');
        } catch (updateError: any) {
            setError(`Payment was successful, but failed to record donation. Please contact support. Error: ${updateError.message}`);
            setView('failed');
        } finally {
            setIsLoading(false);
            setPaymentMethod(null);
        }
    };

    const handleRazorpayPayment = async () => {
        setIsLoading(true);
        setError('');
        setPaymentMethod('razorpay');
        
        try {
            const orderResponse = await fetch('/api/create-razorpay-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'INR' })
            });

            if (!orderResponse.ok) throw new Error('Could not create payment order.');
            const order: RazorpayOrder = await orderResponse.json();

            const options = {
                // FIX: Use type assertion to silence TypeScript error about import.meta.env in non-Vite environments.
                key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'QuickLink Donation',
                description: `Thank you for your support!`,
                order_id: order.id,
                handler: async (response: RazorpaySuccessResponse) => {
                    setIsLoading(true);
                    await onPaymentSuccess();
                },
                prefill: { name: currentUser?.name, email: currentUser?.email },
                theme: { color: '#ff2e63' },
                modal: { ondismiss: () => { if (view === 'selection') { setView('cancelled'); setIsLoading(false); setPaymentMethod(null); } } }
            };

            // FIX: Rely on global type declaration from types.ts
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
    
    const handleCashfreePayment = async () => {
        setIsLoading(true);
        setError('');
        setPaymentMethod('cashfree');

        try {
            const orderResponse = await fetch('/api/create-cashfree-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'INR', user: currentUser })
            });
            if (!orderResponse.ok) throw new Error('Could not create payment order.');
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
                } else if (result.paymentDetails && result.paymentDetails.paymentStatus === 'SUCCESS') {
                    setIsLoading(true);
                    await onPaymentSuccess();
                } else {
                    setView('cancelled');
                }
                setIsLoading(false);
                setPaymentMethod(null);
            });
        } catch (err: any) {
             setError(`Payment failed: ${err.message}`);
            setView('failed');
            setIsLoading(false);
            setPaymentMethod(null);
        }
    };
    
    const donationStats = useMemo(() => {
        const total = donations.reduce((sum, d) => sum + d.amount, 0);
        const donorIds = new Set(donations.map(d => d.userId));
        // FIX: Add explicit type to reduce accumulator to fix type inference issue.
        const leaderboard = Object.values(donations.reduce((acc: Record<string, { userId: string; userName: string; total: number }>, d) => {
            if (!d.userId || !d.userName) return acc;
            if (!acc[d.userId]) {
                acc[d.userId] = { userId: d.userId, userName: d.userName, total: 0 };
            }
            acc[d.userId].total += d.amount;
            return acc;
        }, {}))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10);
        
        return { total, count: donorIds.size, leaderboard };
    }, [donations]);

    const renderContent = () => {
        switch (view) {
            case 'success':
                return (<div className="text-center p-8"><CheckIcon className="mx-auto h-16 w-16 text-green-500 animate-check-pop" /><h2 className="text-3xl font-bold text-white mt-4">Thank You!</h2><p className="text-gray-400 my-4">Your generous donation is greatly appreciated. It helps us keep QuickLink running.</p><button onClick={() => setView('selection')} className="w-full max-w-xs mx-auto rounded-md bg-brand-secondary px-3 py-3 text-sm font-semibold text-white">Make another donation</button></div>);
            case 'failed':
                return (<div className="text-center p-8"><XIcon className="mx-auto h-16 w-16 text-red-500" /><h2 className="text-3xl font-bold text-white mt-4">Payment Failed</h2><p className="text-gray-400 my-4 break-words">{error}</p><button onClick={() => setView('selection')} className="w-full max-w-xs mx-auto rounded-md bg-brand-secondary px-3 py-3 text-sm font-semibold text-white">Try Again</button></div>);
            case 'cancelled':
                return (<div className="text-center p-8"><WarningIcon className="mx-auto h-16 w-16 text-yellow-500" /><h2 className="text-3xl font-bold text-white mt-4">Payment Cancelled</h2><p className="text-gray-400 my-4">Your transaction was cancelled.</p><button onClick={() => setView('selection')} className="w-full max-w-xs mx-auto rounded-md bg-brand-secondary px-3 py-3 text-sm font-semibold text-white">Try Again</button></div>);
            default:
                return (<><div className="text-center"><HeartIcon className="mx-auto h-12 w-12 text-brand-secondary" /><h2 className="text-3xl font-bold text-white mt-4">Support QuickLink</h2><p className="text-gray-400 mb-8">Your donations help us cover server costs and continue developing new features.</p></div><div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">{PRESET_AMOUNTS.map(val => (<button key={val} onClick={() => handleAmountClick(val)} className={`p-4 rounded-lg border-2 text-center transition-all ${amount === val && customAmount === '' ? 'border-brand-secondary bg-brand-secondary/10 scale-105' : 'border-white/20 bg-black/30 hover:border-white/30'}`}><span className="text-xl font-bold text-white">₹{val}</span></button>))}</div><input type="text" value={customAmount} onChange={handleCustomAmountChange} placeholder="Or enter a custom amount (₹1-2000)" className={`block w-full rounded-md border-2 bg-black/30 py-3 px-4 text-center text-xl font-bold text-brand-light shadow-sm placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-secondary sm:text-lg transition-all ${customAmount !== '' ? 'border-brand-secondary' : 'border-white/20'}`} /><div className="mt-8 space-y-4"><p className="text-center text-sm text-gray-400">Choose a payment method:</p><button onClick={() => handlePayment('razorpay')} disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-green-500 px-3 py-3 text-base font-semibold text-brand-dark hover:bg-green-400 disabled:opacity-50">{isLoading && paymentMethod === 'razorpay' ? <LoadingIcon className="animate-spin h-5 w-5" /> : `Donate ₹${amount} with Razorpay`}</button><button onClick={() => handlePayment('cashfree')} disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-blue-600 px-3 py-3 text-base font-semibold text-white hover:bg-blue-500 disabled:opacity-50">{isLoading && paymentMethod === 'cashfree' ? <LoadingIcon className="animate-spin h-5 w-5" /> : `Donate ₹${amount} with UPI (Cashfree)`}</button></div></>);
        }
    };
    
    return (<div className="space-y-12 animate-fade-in"><div className="glass-card p-6 md:p-8 rounded-2xl max-w-xl mx-auto">{renderContent()}</div><div className="glass-card p-6 md:p-8 rounded-2xl max-w-xl mx-auto"><h3 className="text-2xl font-bold text-white text-center mb-6">Community Support</h3><div className="grid grid-cols-2 gap-4 text-center mb-6"><div className="bg-black/30 p-4 rounded-lg"><p className="text-gray-400 text-sm">Total Raised</p><p className="text-3xl font-bold text-brand-secondary">₹{donationStats.total.toLocaleString()}</p></div><div className="bg-black/30 p-4 rounded-lg"><p className="text-gray-400 text-sm">Total Donors</p><p className="text-3xl font-bold text-brand-secondary">{donationStats.count}</p></div></div><h4 className="font-semibold text-lg text-white mb-2">Top Donors</h4><div className="space-y-2">{donationStats.leaderboard.length > 0 ? donationStats.leaderboard.map((d, i) => (<div key={d.userId} className="flex justify-between items-center bg-black/20 p-3 rounded-md"><div className="flex items-center gap-3"><span className="font-bold text-gray-400 w-6">#{i+1}</span><p className="text-white font-semibold">{d.userName}</p></div><p className="font-bold text-brand-secondary">₹{d.total.toLocaleString()}</p></div>)) : <p className="text-gray-500 text-center">No donations yet. Be the first!</p>}</div></div></div>);
};

export default DonationPage;