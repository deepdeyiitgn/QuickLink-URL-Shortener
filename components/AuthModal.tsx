import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { XIcon, LoadingIcon } from './icons/IconComponents';

const AuthModal: React.FC = () => {
  const auth = useContext(AuthContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (auth?.isAuthModalOpen) {
      setIsSignUp(auth.authModalMode === 'signup');
      setError('');
      setName('');
      setEmail('');
      setPassword('');
    }
  }, [auth?.isAuthModalOpen, auth?.authModalMode]);

  if (!auth || !auth.isAuthModalOpen) {
    return null;
  }

  const { login, signup, closeAuthModal } = auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isSignUp) {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={closeAuthModal}
    >
      <div 
        className="relative w-full max-w-md glass-card rounded-2xl p-8"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <XIcon className="h-6 w-6"/>
        </button>

        <div className="flex border-b border-white/20 mb-6">
            <button onClick={() => setIsSignUp(false)} className={`w-1/2 py-3 text-lg font-semibold transition-colors ${!isSignUp ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-500'}`}>Sign In</button>
            <button onClick={() => setIsSignUp(true)} className={`w-1/2 py-3 text-lg font-semibold transition-colors ${isSignUp ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-500'}`}>Sign Up</button>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
        <p className="text-center text-gray-400 mb-6">{isSignUp ? 'Get 7-day links by creating an account.' : 'Sign in to access your benefits.'}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
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
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary" />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_10px_#00e5ff] hover:bg-brand-primary/80 disabled:opacity-50 transition-all">
            {isLoading ? <LoadingIcon className="animate-spin h-5 w-5" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;