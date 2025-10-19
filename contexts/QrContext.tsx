

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { QrCodeRecord, ScanRecord, QrContextType as IQrContextType } from '../types';
import { api } from '../api';

export const QrContext = createContext<IQrContextType | undefined>(undefined);

export const QrProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [qrHistory, setQrHistory] = useState<QrCodeRecord[]>([]);
    const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true);
            const [qrs, scans] = await Promise.all([
                api.getQrHistory(),
                api.getScanHistory()
            ]);
            setQrHistory(qrs);
            setScanHistory(scans);
            setLoading(false);
        };
        loadHistory();
    }, []);

    const addQrCode = async (qr: Omit<QrCodeRecord, 'id' | 'createdAt'>) => {
        const newRecord: QrCodeRecord = {
            ...qr,
            id: `qr_${Date.now()}`,
            createdAt: Date.now(),
        };
        await api.addQrRecord(newRecord);
        setQrHistory(prev => [...prev, newRecord]);
    };

    const addScan = async (scan: Omit<ScanRecord, 'id' | 'scannedAt'>) => {
        const newRecord: ScanRecord = {
            ...scan,
            id: `scan_${Date.now()}`,
            scannedAt: Date.now(),
        };
        await api.addScanRecord(newRecord);
        setScanHistory(prev => [...prev, newRecord]);
    };

    const value: IQrContextType = {
        qrHistory,
        scanHistory,
        addQrCode,
        addScan,
    };

    return (
        <QrContext.Provider value={value}>
            {children}
        </QrContext.Provider>
    );
};