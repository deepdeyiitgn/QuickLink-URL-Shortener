import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LoadingIcon, CheckIcon, EyeIcon, EyeSlashIcon } from './icons/IconComponents';

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const auth = useContext(AuthContext);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setStatus('error');
            return;
        }
        if (!token || !auth) {
            setMessage('Invalid request. No reset token found.');
            setStatus('error');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            await auth.resetPassword(token, password);
            setStatus('success');
            setMessage('Your password has been successfully reset! You can now log in with your new password.');
        } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'Failed to reset password. The link may be invalid or expired.');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="glass-card p-8 rounded-2xl animate-fade-in">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Set New Password</h1>
                {status === 'success' ? (
                    <div className="text-center">
                        <CheckIcon className="h-12 w-12 mx-auto text-green-400 mb-4" />
                        <p className="text-green-300">{message}</p>
                        <Link to="/" onClick={() => auth?.openAuthModal('login')} className="mt-6 inline-block px-6 py-2 bg-brand-primary text-brand-dark font-semibold rounded-md">
                            Go to Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="new-password"className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    id="new-password" 
                                    value={password} 
                                    onChange={e => setPassword(e.target.value)} 
                                    required 
                                    className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary pr-10"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                </button>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                id="confirm-password" 
                                value={confirmPassword} 
                                onChange={e => setConfirmPassword(e.target.value)} 
                                required 
                                className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary"
                            />
                        </div>

                        {status === 'error' && <p className="text-red-400 text-sm text-center">{message}</p>}

                        <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 disabled:opacity-50 transition-all">
                            {status === 'loading' ? <LoadingIcon className="animate-spin h-5 w-5" /> : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
