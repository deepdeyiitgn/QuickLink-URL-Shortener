import React, { useState } from 'react';
import { LoadingIcon, CheckIcon } from './icons/IconComponents';

interface CouponInputProps {
    onApply: (code: string) => Promise<{ isValid: boolean; message: string; discountAmount: number }>;
}

const CouponInput: React.FC<CouponInputProps> = ({ onApply }) => {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleApply = async () => {
        if (!code.trim()) return;
        setStatus('loading');
        setMessage('');

        const result = await onApply(code.trim().toUpperCase());
        
        setMessage(result.message);
        setStatus(result.isValid ? 'success' : 'error');
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        setStatus('idle');
                        setMessage('');
                    }}
                    placeholder="Enter Coupon Code"
                    className="flex-grow bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary text-sm"
                />
                <button
                    type="button"
                    onClick={handleApply}
                    disabled={status === 'loading' || !code.trim()}
                    className="px-4 py-2 text-sm font-semibold text-brand-dark bg-brand-light rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                    {status === 'loading' ? <LoadingIcon className="h-4 w-4 animate-spin" /> : 'Apply'}
                </button>
            </div>
            {message && (
                <p className={`text-xs ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default CouponInput;
