import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { XIcon, LoadingIcon, EyeIcon, EyeSlashIcon, CheckIcon } from './icons/IconComponents';
import { AuthContextType } from '../types';

const AuthModal: React.FC = () => {
  const auth = useContext(AuthContext);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'signup_success'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth?.isAuthModalOpen) {
      setMode(auth.authModalMode === 'signup' ? 'signup' : 'login');
      setError('');
      setSuccessMessage('');
      setName('');
      setEmail('');
      setPassword('');
      setShowPassword(false);
      
      if (window.google) {
        window.google.accounts.id.initialize({
            client_id: process.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn,
        });
        const googleButton = document.getElementById('google-signin-button');
        if (googleButton) {
            window.google.accounts.id.renderButton(
                googleButton,
                { theme: 'outline', size: 'large', width: '350' }
            );
        }
      }
    }
  }, [auth?.isAuthModalOpen, auth?.authModalMode]);

  if (!auth || !auth.isAuthModalOpen) {
    return null;
  }

  const { login, signup, closeAuthModal, sendPasswordResetLink, loginWithGoogle } = auth;
  
  const handleGoogleSignIn = async (response: any) => {
        if (!loginWithGoogle) return;
        setIsLoading(true);
        setError('');
        try {
            await loginWithGoogle(response.credential);
            closeAuthModal();
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed.');
        } finally {
            setIsLoading(false);
        }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      if (mode === 'signup') {
        const message = await signup(name, email, password);
        setSuccessMessage(message);
        setMode('signup_success');
      } else if (mode === 'login') {
        await login(email, password);
        closeAuthModal();
      } else if (mode === 'forgot') {
        await sendPasswordResetLink(email);
        setSuccessMessage('Password reset link sent! Please check your email.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (mode === 'signup_success') {
      return (
        <div className="text-center">
            <CheckIcon className="h-12 w-12 text-green-400 mx-auto mb-4 animate-check-pop" />
            <h2 className="text-2xl font-bold text-center text-white mb-2">Almost there!</h2>
            <p className="text-center text-gray-300 mb-6">{successMessage}</p>
            <button type="button" onClick={closeAuthModal} className="w-full rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80">
                Close
            </button>
        </div>
      );
    }
    
    if (mode === 'forgot') {
      return (
        <>
          <h2 className="text-2xl font-bold text-center text-white mb-2">Reset Password</h2>
          <p className="text-center text-gray-400 mb-6">Enter your email to receive a password reset link.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email-forgot" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input type="email" id="email-forgot" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary" />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            {successMessage && <p className="text-green-400 text-sm text-center">{successMessage}</p>}
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 disabled:opacity-50 transition-all">
              {isLoading ? <LoadingIcon className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
            </button>
             <button type="button" onClick={() => setMode('login')} className="w-full text-center text-sm text-gray-400 hover:text-brand-primary mt-2">Back to Sign In</button>
          </form>
        </>
      );
    }

    return (
      <>
        <div className="flex border-b border-white/20 mb-6">
            <button onClick={() => setMode('login')} className={`w-1/2 py-3 text-lg font-semibold transition-colors ${mode === 'login' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-500'}`}>Sign In</button>
            <button onClick={() => setMode('signup')} className={`w-1/2 py-3 text-lg font-semibold transition-colors ${mode === 'signup' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-500'}`}>Sign Up</button>
        </div>
        <div id="google-signin-button" className="mb-4 flex justify-center"></div>
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or</span>
            <div className="flex-grow border-t border-white/20"></div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">{mode === 'signup' ? 'Create an Account' : 'Welcome Back'}</h2>
        <p className="text-center text-gray-400 mb-6">{mode === 'signup' ? 'Get 7-day links by creating an account.' : 'Sign in to access your benefits.'}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary" />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary" />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">
                {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
              </button>
            </div>
          </div>
           {mode === 'login' && (
              <div className="text-right">
                <button type="button" onClick={() => setMode('forgot')} className="text-sm text-gray-400 hover:text-brand-primary focus:outline-none">Forgot Password?</button>
              </div>
          )}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 disabled:opacity-50 transition-all">
            {isLoading ? <LoadingIcon className="animate-spin h-5 w-5" /> : (mode === 'signup' ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
      </>
    );
  };

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto"
        onClick={closeAuthModal}
    >
      <div 
        className="relative w-full max-w-md glass-card rounded-2xl p-8 my-8"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <XIcon className="h-6 w-6"/>
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthModal;
