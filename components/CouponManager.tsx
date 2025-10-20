import React, { useState, useEffect, useContext } from 'react';
import { Coupon, AuthContextType } from '../types';
import { api } from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { LoadingIcon, PlusIcon, TrashIcon } from './icons/IconComponents';

const CouponManager: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState<'PERCENT' | 'FLAT'>('PERCENT');
    const [discountValue, setDiscountValue] = useState(10);
    const [quantityLimit, setQuantityLimit] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [onePerUser, setOnePerUser] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const fetchCoupons = async () => {
        if (!auth.currentUser) return;
        setLoading(true);
        const fetchedCoupons = await api.getCoupons(auth.currentUser.id);
        setCoupons(fetchedCoupons);
        setLoading(false);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (couponId: string) => {
        if (!auth.currentUser) return;
        if (window.confirm('Are you sure you want to permanently delete this coupon?')) {
            await api.deleteCoupon(couponId, auth.currentUser.id);
            await fetchCoupons();
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.currentUser) return;
        setIsCreating(true);

        const newCoupon: Omit<Coupon, 'id' | 'createdAt' | 'uses'> = {
            code: code.toUpperCase(),
            discount: { type: discountType, value: Number(discountValue) },
            quantityLimit: quantityLimit ? Number(quantityLimit) : undefined,
            expiresAt: expiresAt ? new Date(expiresAt).getTime() : undefined,
            onePerUser,
        };

        await api.addCoupon(newCoupon, auth.currentUser.id);
        
        setCode('');
        await fetchCoupons();
        setIsCreating(false);
    };
    
    return (
        <div className="space-y-8">
            <div className="bg-black/20 p-4 rounded-lg">
                 <h3 className="text-xl font-bold text-white mb-4">Create New Coupon</h3>
                 <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="COUPONCODE" required className="admin-input" />
                    <select value={discountType} onChange={e => setDiscountType(e.target.value as any)} className="admin-input">
                        <option value="PERCENT">Percentage (%)</option>
                        <option value="FLAT">Flat Amount (INR)</option>
                    </select>
                    <input type="number" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} placeholder="Discount Value" required className="admin-input" />
                    <input type="number" value={quantityLimit} onChange={e => setQuantityLimit(e.target.value)} placeholder="Total Uses (optional)" className="admin-input" />
                     <div className="md:col-span-2">
                        <label className="text-xs text-gray-400">Expires At (optional)</label>
                        <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="admin-input w-full" />
                    </div>
                     <div className="md:col-span-2 flex items-center gap-2">
                        <input id="onePerUser" type="checkbox" checked={onePerUser} onChange={e => setOnePerUser(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-brand-primary focus:ring-brand-primary" />
                        <label htmlFor="onePerUser">Limit to one use per user</label>
                    </div>
                    <button type="submit" disabled={isCreating} className="md:col-span-2 w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-2 font-semibold text-brand-dark hover:bg-brand-primary/80 disabled:opacity-50">
                        {isCreating ? <LoadingIcon className="h-5 w-5 animate-spin" /> : <><PlusIcon className="h-5 w-5" /> Create Coupon</>}
                    </button>
                 </form>
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Existing Coupons</h3>
                {loading ? <LoadingIcon className="h-6 w-6 animate-spin" /> : (
                    <div className="space-y-2">
                        {coupons.map(c => (
                            <div key={c.id} className="bg-black/20 p-3 rounded-lg flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-semibold font-mono text-white">{c.code}</p>
                                    <p className="text-xs text-gray-400">
                                        {c.discount.value}{c.discount.type === 'PERCENT' ? '%' : ' INR'} off | Used {c.uses} / {c.quantityLimit || '∞'} times
                                    </p>
                                </div>
                                <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4" /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponManager;
