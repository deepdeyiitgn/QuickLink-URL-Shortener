import React, { useState, useContext } from 'react';
import type { ShortenedUrl } from '../types';
import { CopyIcon, LinkIcon, LoadingIcon, CheckIcon } from './icons/IconComponents';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import ShareButtons from './ShareButtons';

const SUBSCRIPTION_LABELS = {
    'monthly': '1 Month',
    'semi-annually': '6 Months',
    'yearly': '1 Year',
};

const UrlShortener: React.FC = () => {
  const auth = useContext(AuthContext);
  const urlContext = useContext(UrlContext);
  const { currentUser, openAuthModal, openSubscriptionModal } = auth || {};
  const { addUrl } = urlContext || {};

  const [longUrl, setLongUrl] = useState<string>('');
  const [alias, setAlias] = useState<string>('');
  const [result, setResult] = useState<ShortenedUrl | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // State for custom expiration controls for admins/privileged users
  const [isPermanent, setIsPermanent] = useState(false);
  const [customExpiryValue, setCustomExpiryValue] = useState(1);
  const [customExpiryUnit, setCustomExpiryUnit] = useState<'days'|'months'|'years'>('months');

  const canSetCustomExpiry = currentUser?.isAdmin || currentUser?.canSetCustomExpiry;

  const generateRandomAlias = (): string => {
    return Math.random().toString(36).substring(2, 8);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return /^(http|https):\/\/[^ "]+$/.test(url);
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    setTimeout(async () => {
      try {
        if (!isValidUrl(longUrl)) {
          throw new Error('Please enter a valid URL (e.g., https://example.com).');
        }
        
        const trimmedLongUrl = longUrl.trim();
        const finalAlias = alias.trim().toLowerCase() || generateRandomAlias();
        
        const now = Date.now();
        let expiresAt: number | null;

        if (canSetCustomExpiry) {
            if (isPermanent) {
                expiresAt = null; // Use null for permanent links
            } else {
                const date = new Date();
                if (customExpiryUnit === 'days') date.setDate(date.getDate() + customExpiryValue);
                if (customExpiryUnit === 'months') date.setMonth(date.getMonth() + customExpiryValue);
                if (customExpiryUnit === 'years') date.setFullYear(date.getFullYear() + customExpiryValue);
                expiresAt = date.getTime();
            }
        } else {
            const oneDay = 24 * 60 * 60 * 1000;
            let expirationDuration;

            const subscription = currentUser?.subscription;
            const isSubscribed = subscription && subscription.expiresAt > now;

            if (isSubscribed) {
                switch (subscription.planId) {
                    case 'monthly': expirationDuration = 30 * oneDay; break;
                    case 'semi-annually': expirationDuration = 180 * oneDay; break;
                    case 'yearly': expirationDuration = 365 * oneDay; break;
                    default: expirationDuration = 7 * oneDay;
                }
            } else if (currentUser) {
                expirationDuration = 7 * oneDay;
            } else {
                expirationDuration = oneDay;
            }
            expiresAt = now + expirationDuration;
        }

        const newUrl: ShortenedUrl = {
          id: new Date().getTime().toString(),
          longUrl: trimmedLongUrl,
          alias: finalAlias,
          shortUrl: `${window.location.origin}/${finalAlias}`,
          createdAt: now,
          expiresAt: expiresAt,
          userId: currentUser ? currentUser.id : null,
        };
        
        if (addUrl) {
          await addUrl(newUrl);
        }
        setResult(newUrl);
        setLongUrl('');
        setAlias('');
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="glass-card p-6 md:p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="longUrl" className="block text-sm font-medium text-gray-300 mb-2">
              Enter Long URL
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LinkIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input type="url" id="longUrl" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} placeholder="https://your-super-long-url.com/goes-here" className="block w-full rounded-md border-0 bg-black/30 py-3 pl-10 text-brand-light shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6 transition-all" required/>
            </div>
          </div>
          
          <div>
            <label htmlFor="alias" className="block text-sm font-medium text-gray-300 mb-2">Custom Alias (Optional)</label>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-white/20 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-primary sm:text-sm sm:leading-6 bg-black/30 transition-all">
                <span className="flex select-none items-center pl-3 text-gray-500 whitespace-nowrap">{`${window.location.origin}/`}</span>
                <input type="text" id="alias" value={alias} onChange={(e) => setAlias(e.target.value.replace(/[^a-z0-9-]/gi, ''))} placeholder="my-cool-link" className="block flex-1 border-0 bg-transparent py-3 pl-1 text-brand-light placeholder:text-gray-500 focus:ring-0" />
            </div>
          </div>

          {canSetCustomExpiry && (
            <div className="p-4 border border-brand-secondary/30 rounded-lg space-y-4 bg-brand-secondary/10">
                <h4 className="font-semibold text-brand-secondary">Admin: Custom Expiration</h4>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input id="isPermanent" type="checkbox" checked={isPermanent} onChange={(e) => setIsPermanent(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-brand-secondary focus:ring-brand-secondary" />
                        <label htmlFor="isPermanent" className="text-sm text-gray-300">Set as Permanent</label>
                    </div>
                </div>
                {!isPermanent && (
                    <div className="flex items-center gap-2">
                        <input type="number" value={customExpiryValue} onChange={(e) => setCustomExpiryValue(Math.max(1, parseInt(e.target.value, 10)))} min="1" className="w-24 bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary" />
                        <select value={customExpiryUnit} onChange={(e) => setCustomExpiryUnit(e.target.value as any)} className="bg-black/30 rounded-md border-white/20 text-white focus:ring-brand-primary">
                            <option value="days">Days</option>
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                        </select>
                    </div>
                )}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 rounded-md bg-brand-primary px-3 py-3 text-sm font-semibold text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.5)] hover:bg-brand-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
            {isLoading ? (<><LoadingIcon className="animate-spin h-5 w-5" /> Shortening...</>) : ('Generate Short URL')}
          </button>
        </form>
        
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        
        {result && (
          <div className="mt-6 p-4 bg-black/30 border border-brand-primary/30 rounded-lg animate-fade-in">
            <p className="text-sm text-center text-gray-300 mb-2">Your short link is ready!</p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 p-3 rounded-md">
              <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-lg text-brand-primary break-all hover:underline">{result.shortUrl}</a>
              <button onClick={handleCopy} className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 text-sm font-medium text-brand-dark bg-brand-light rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-light transition-all">
                {copied ? (<CheckIcon className="h-5 w-5 text-green-500 animate-check-pop" />) : (<CopyIcon className="h-4 w-4" />)}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
             <p className="text-xs text-center text-gray-500 mt-3">
              {(currentUser?.subscription && currentUser.subscription.expiresAt > Date.now()) ? (
                `As a subscriber, this link will expire in ${SUBSCRIPTION_LABELS[currentUser.subscription.planId as keyof typeof SUBSCRIPTION_LABELS]}.`
              ) : currentUser ? (
                <>Note: This link will expire in 7 days. <button onClick={() => openSubscriptionModal && openSubscriptionModal()} className="text-green-400 hover:underline">Subscribe for longer links.</button></>
              ) : (
                <>Note: This link will expire in 24 hours. <button onClick={() => openAuthModal && openAuthModal('signup')} className="text-brand-primary/80 hover:underline">Sign up for 7-day links.</button></>
              )}
            </p>
            <ShareButtons shortUrl={result.shortUrl} longUrl={result.longUrl} />
          </div>
        )}
      </div>
    </>
  );
};

export default UrlShortener;