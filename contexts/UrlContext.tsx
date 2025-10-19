
import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import type { ShortenedUrl, PaymentRecord, UrlContextType } from '../types';
import { api } from '../api';

export const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allUrls, setAllUrls] = useState<ShortenedUrl[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [urls, payments] = await Promise.all([
        api.getUrls(),
        api.getPaymentHistory()
      ]);
      setAllUrls(urls);
      setPaymentHistory(payments);
      setLoading(false);
    };

    loadData();
  }, []);

  const { activeUrls, expiredUrls } = useMemo(() => {
    const now = Date.now();
    const active: ShortenedUrl[] = [];
    const expired: ShortenedUrl[] = [];
    for (const url of allUrls) {
      if (url.expiresAt === Infinity || url.expiresAt > now) {
        active.push(url);
      } else {
        expired.push(url);
      }
    }
    return { activeUrls: active, expiredUrls: expired };
  }, [allUrls]);
  

  const addUrl = async (newUrl: ShortenedUrl): Promise<void> => {
    // The server now handles uniqueness checks and upsert logic atomically.
    // The `addSingleUrl` function will throw an error on failure (e.g., alias taken),
    // which will be caught by the UI component to display the error message.
    await api.addSingleUrl(newUrl);

    // On success, update the local state to reflect the change immediately.
    setAllUrls(prevUrls => {
        const existingIndex = prevUrls.findIndex(u => u.alias === newUrl.alias);
        if (existingIndex > -1) {
            // Replace the existing URL (which must have been expired).
            const updatedUrls = [...prevUrls];
            updatedUrls[existingIndex] = newUrl;
            return updatedUrls;
        } else {
            // Or add the new URL if no previous version existed.
            return [...prevUrls, newUrl];
        }
    });
  };

  const deleteUrl = async (urlId: string): Promise<void> => {
    const updatedUrls = allUrls.filter(u => u.id !== urlId);
    setAllUrls(updatedUrls);
    await api.saveUrls(updatedUrls);
  };
  
  const deleteUrlsByUserId = async (userId: string): Promise<void> => {
    const updatedUrls = allUrls.filter(u => u.userId !== userId);
    setAllUrls(updatedUrls);
    await api.saveUrls(updatedUrls);
  };
  
  // Fix: Implement the `extendUrls` function to update the expiration dates of specified URLs.
  const extendUrls = async (urlIds: string[], newExpiresAt: number): Promise<void> => {
    const updatedUrls = allUrls.map(url => {
        if (urlIds.includes(url.id)) {
            return { ...url, expiresAt: newExpiresAt };
        }
        return url;
    });
    setAllUrls(updatedUrls);
    await api.saveUrls(updatedUrls);
  };

  const addPaymentRecord = async (record: PaymentRecord): Promise<void> => {
    const updatedHistory = [...paymentHistory, record];
    setPaymentHistory(updatedHistory);
    await api.savePaymentHistory(updatedHistory);
  };

  const clearAllDynamicUrls = async (): Promise<void> => {
    const updatedUrls = allUrls.filter(u => u.id.startsWith('static-'));
    setAllUrls(updatedUrls);
    await api.saveUrls(updatedUrls);
  };

  const value: UrlContextType = {
    allUrls,
    activeUrls,
    expiredUrls,
    paymentHistory,
    addUrl,
    deleteUrl,
    deleteUrlsByUserId,
    extendUrls,
    addPaymentRecord,
    clearAllDynamicUrls,
    loading
  };

  return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>;
};