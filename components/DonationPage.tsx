import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Donation, RazorpayOrder, RazorpaySuccessResponse, AuthContextType } from '../types';
import { LoadingIcon, XIcon, CheckIcon, WarningIcon } from './icons/IconComponents';
import { api } from '../api';

const DonationPage: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, updateUserAsDonor } = auth || {};

    const [amount, setAmount] = useState(100);
    const [name, setName] = useState(currentUser?.name || '');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [view, setView] = useState<'form' | 'success' | 'failed' | 'cancelled'>('form');

    useEffect(() => {
        api.getDonations().then(setDonations);
    }, []);

    const handlePayment = async () => {
        if (amount < 10) {
            setError('Minimum donation amount is ₹10.');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const orderResponse = await fetch('/api/payments?action=create_order&provider=razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'INR' })
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
                name: 'Donation to QuickLink',
                description: 'Thank you for your support!',
                order_id: order.id,
                handler: async (response: RazorpaySuccessResponse) => {
                    setIsLoading(true);
                    // Show success UI immediately
                    setView('success');

                    // Then handle DB updates in the background
                    try {
                        const donationRecord: Omit<Donation, 'id' | 'createdAt'> = {
                            name: isAnonymous ? 'Anonymous' : name || 'Anonymous Supporter',
                            amount,
                            currency: 'INR',
                            message: message || undefined,
                            isAnonymous,
                        };
                        await api.addDonation(donationRecord);

                        // If user is logged in, mark them as a donor
                        if (currentUser) {
                            await updateUserAsDonor?.(currentUser.id);
                        }

                        // Refresh donation list
                        const freshDonations = await api.getDonations();
                        setDonations(freshDonations);
                    } catch (dbError: any) {
                        // Even if DB fails, user sees success. We log the error.
                        console.error("CRITICAL: Payment successful but failed to record donation in DB.", dbError);
                        setError(`Payment was successful, but failed to record donation. Please contact support. Payment ID: ${response.razorpay_payment_id}`);
                        // Optionally set view to a special 'failed-but-paid' state
                    } finally {
                        setIsLoading(false);
                    }
                },
                prefill: { name: name, email: currentUser?.email },
                theme: { color: '#00e5ff' },
                modal: { ondismiss: () => { if (view === 'form') { setView('cancelled'); setIsLoading(false); } } }
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

    const renderView = () => {
        switch (view) {
            case 'success':
                return (
                    <div className="text-center p-8">
                        <CheckIcon className="mx-auto h-16 w-16 text-green-500 animate-check-pop" />
                        <h2 className="text-3xl font-bold text-white mt-4">Thank You for Your Support!</h2>
                        <p className="text-gray-400 my-4">Your generosity helps keep this platform running.</p>
                        <button onClick={() => setView('form')} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Make another donation</button>
                    </div>
                );
            case 'failed':
                return (
                     <div className="text-center p-8">
                        <XIcon className="mx-auto h-16 w-16 text-red-500" />
                        <h2 className="text-3xl font-bold text-white mt-4">Payment Failed</h2>
                        <p className="text-gray-400 my-4 break-words">{error}</p>
                        <button onClick={() => setView('form')} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Try Again</button>
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="text-center p-8">
                        <WarningIcon className="mx-auto h-16 w-16 text-yellow-500" />
                        <h2 className="text-3xl font-bold text-white mt-4">Payment Cancelled</h2>
                        <p className="text-gray-400 my-4">Your transaction was cancelled.</p>
                        <button onClick={() => setView('form')} className="w-full max-w-xs mx-auto rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark">Go Back</button>
                    </div>
                );
            case 'form':
            default:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-2">
                            {[20, 50, 100].map(val => (
                                <button key={val} onClick={() => setAmount(val)} className={`py-3 rounded-md font-semibold ${amount === val ? 'bg-brand-primary text-brand-dark' : 'bg-black/30 hover:bg-black/50'}`}>₹{val}</button>
                            ))}
                        </div>
                        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary text-center text-lg" placeholder="Enter amount" />
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary" placeholder="Your Name (optional)" />
                        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary" placeholder="Leave a message (optional)" />
                        <label className="flex items-center gap-2 text-gray-400">
                            <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="rounded bg-black/30 border-white/20 text-brand-primary focus:ring-brand-primary" />
                            Donate anonymously
                        </label>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button onClick={handlePayment} disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-green-500 px-3 py-3 font-semibold text-brand-dark shadow-sm hover:bg-green-400 disabled:opacity-50">
                            {isLoading ? <LoadingIcon className="animate-spin h-5 w-5" /> : `Donate ₹${amount}`}
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4 animate-aurora">Support Us</h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Your contribution helps us cover server costs and continue to build and maintain this free service.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
                <div className="glass-card p-6 md:p-8 rounded-2xl">
                    {renderView()}
                </div>
                <div className="glass-card p-6 md:p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Recent Supporters</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {donations.length > 0 ? donations.map(d => (
                            <div key={d.id} className="p-3 bg-black/30 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-brand-light">{d.name}</span>
                                    <span className="font-bold text-green-400">₹{d.amount}</span>
                                </div>
                                {d.message && <p className="text-sm text-gray-400 mt-1 italic">"{d.message}"</p>}
                            </div>
                        )) : <p className="text-gray-500">Be the first to donate!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationPage;
