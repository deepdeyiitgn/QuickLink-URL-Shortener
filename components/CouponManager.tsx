import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api';
import { Coupon, AuthContextType } from '../types';
import { LoadingIcon, TrashIcon, PlusIcon } from './icons/IconComponents';

const CouponManager: React.FC = () => {
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser } = auth;
    
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
        code: '',
        discount: { type: 'PERCENT', value: 10 },
        onePerUser: true,
    });

    const fetchCoupons = () => {
        if(!currentUser) return;
        api.getCoupons(currentUser.id).then(setCoupons).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCoupons();
    }, [currentUser]);

    const handleDelete = async (couponId: string) => {
        if (!currentUser || !window.confirm('Are you sure you want to delete this coupon?')) return;
        await api.deleteCoupon(couponId, currentUser.id);
        fetchCoupons();
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !newCoupon.code) return;
        await api.addCoupon({ ...newCoupon, code: newCoupon.code.toUpperCase() } as any, currentUser.id);
        setShowForm(false);
        setNewCoupon({ code: '', discount: { type: 'PERCENT', value: 10 }, onePerUser: true });
        fetchCoupons();
    };

    if (loading) return <div className="text-center py-10"><LoadingIcon className="h-8 w-8 animate-spin mx-auto" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Manage Coupons</h3>
                <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-primary rounded-md hover:bg-brand-primary/80">
                    <PlusIcon className="h-5 w-5" /> {showForm ? 'Cancel' : 'New Coupon'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="p-4 bg-black/30 rounded-lg mb-4 space-y-3">
                    <input type="text" placeholder="Coupon Code (e.g., SAVE10)" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} required className="w-full bg-black/40 rounded-md" />
                    <div className="flex gap-2">
                        <select value={newCoupon.discount?.type} onChange={e => setNewCoupon({...newCoupon, discount: { ...newCoupon.discount!, type: e.target.value as any }})} className="bg-black/40 rounded-md">
                            <option value="PERCENT">Percent (%)</option>
                            <option value="FLAT">Flat (₹)</option>
                        </select>
                        <input type="number" placeholder="Value" value={newCoupon.discount?.value} onChange={e => setNewCoupon({...newCoupon, discount: { ...newCoupon.discount!, value: Number(e.target.value) }})} required className="w-full bg-black/40 rounded-md" />
                    </div>
                    <button type="submit" className="w-full py-2 bg-brand-secondary rounded-md">Save Coupon</button>
                </form>
            )}

            <div className="space-y-2">
                {coupons.map(coupon => (
                    <div key={coupon.id} className="p-3 bg-black/30 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-white font-mono">{coupon.code}</p>
                            <p className="text-xs text-gray-400">
                                {coupon.discount.type === 'PERCENT' ? `${coupon.discount.value}% off` : `₹${coupon.discount.value} off`}
                                 - Used {coupon.uses} times
                            </p>
                        </div>
                        <button onClick={() => handleDelete(coupon.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full"><TrashIcon className="h-5 w-5"/></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CouponManager;
