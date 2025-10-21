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
      try {
        const [urls, payments] = await Promise.all([
            api.getUrls(),
            api.getPaymentHistory()
        ]);
        setAllUrls(urls);
        setPaymentHistory(payments);
      } catch (error) {
          console.error("Failed to load URL context data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const { activeUrls, expiredUrls } = useMemo(() => {
    const now = Date.now();
    const active: ShortenedUrl[] = [];
    const expired: ShortenedUrl[] = [];
    for (const url of allUrls) {
      if (url.expiresAt === null || url.expiresAt > now) {
        active.push(url);
      } else {
        expired.push(url);
      }
    }
    return { activeUrls: active, expiredUrls: expired };
  }, [allUrls]);
  

  const addUrl = async (newUrl: ShortenedUrl): Promise<void> => {
    // The server handles uniqueness checks and upsert logic atomically.
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
    await api.deleteSingleUrl(urlId);
    setAllUrls(prev => prev.filter(u => u.id !== urlId));
  };
  
  const deleteUrlsByUserId = async (userId: string): Promise<void> => {
    await api.deleteUrlsForUser(userId);
    setAllUrls(prev => prev.filter(u => u.userId !== userId));
  };
  
  const extendUrls = async (urlIds: string[], newExpiresAt: number): Promise<void> => {
    await api.extendMultipleUrls(urlIds, newExpiresAt);
    setAllUrls(prev => prev.map(url => {
        if (urlIds.includes(url.id)) {
            return { ...url, expiresAt: newExpiresAt };
        }
        return url;
    }));
  };

  const addPaymentRecord = async (record: PaymentRecord): Promise<void> => {
    await api.addPaymentRecord(record);
    setPaymentHistory(prev => [...prev, record]);
  };

  const clearAllDynamicUrls = async (): Promise<void> => {
    // This is an admin-only destructive action.
    // For simplicity, we keep the old logic of filtering and saving the result.
    // In a real app, this would be a dedicated, protected API endpoint.
    const updatedUrls = allUrls.filter(u => u.id.startsWith('static-'));
    // This action is not implemented on the backend to avoid accidental data loss.
    // await api.saveUrls(updatedUrls); // This function is removed.
    console.warn("clearAllDynamicUrls is a client-side only operation for this demo.");
    setAllUrls(updatedUrls);
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
