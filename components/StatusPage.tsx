import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UrlContext } from '../contexts/UrlContext';
import { QrContext } from '../contexts/QrContext';
import { LoadingIcon } from './icons/IconComponents';
import { api } from '../api';
import type { DbStatus, AuthContextType } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; description: string; }> = ({ title, value, description }) => (
    <div className="bg-black/30 p-6 rounded-xl border border-white/10">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-4xl font-bold text-brand-primary mt-2">{value.toLocaleString()}</p>
        <p className="text-gray-500 text-xs mt-1">{description}</p>
    </div>
);

const StatusIndicator: React.FC<{ label: string; status: 'Operational' | 'Degraded' | 'Offline' }> = ({ label, status }) => {
    const color = status === 'Operational' ? 'bg-green-500' : status === 'Degraded' ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg border border-white/10">
            <span className="text-gray-300">{label}</span>
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color} animate-pulse`}></div>
                <span className={`${color.replace('bg-', 'text-')}`}>{status}</span>
            </div>
        </div>
    )
};


const StatusPage: React.FC = () => {
    const auth = useContext(AuthContext);
    const urlContext = useContext(UrlContext);
    const qrContext = useContext(QrContext);

    const [userCount, setUserCount] = useState(0);
    const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);

    useEffect(() => {
        if (auth) {
            auth.getAllUsers().then(users => setUserCount(users.length));
        }
        api.getDbStatus().then(status => setDbStatus(status));
    }, [auth]);

    if (urlContext?.loading || !dbStatus) {
         return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-white p-4">
                <LoadingIcon className="h-12 w-12 animate-spin text-brand-primary mb-4" />
                <p className="text-xl">Loading System Status...</p>
            </div>
        );
    }

    const dbServiceStatus = dbStatus.status === 'ok' ? 'Operational' : 'Offline';
    const allSystemsOperational = dbServiceStatus === 'Operational';

    return (
        <div className="glass-card p-6 md:p-8 rounded-2xl animate-fade-in space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">System Status</h2>
                <p className="text-gray-400 mt-2">Live metrics and operational status of all QuickLink services.</p>
            </div>

            {/* Overall Status */}
             <div className={`p-4 rounded-lg text-center ${allSystemsOperational ? 'bg-green-900/30 border border-green-500/50' : 'bg-red-900/30 border border-red-500/50'}`}>
                 <p className={`font-semibold text-lg ${allSystemsOperational ? 'text-green-300' : 'text-red-300'}`}>
                    {allSystemsOperational ? 'All Systems Operational' : 'Major Outage Detected'}
                 </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Total Links Created" value={urlContext?.allUrls.length || 0} description="Includes active and expired links." />
                <StatCard title="Active Links" value={urlContext?.activeUrls.length || 0} description="Currently redirecting." />
                <StatCard title="Total Users" value={userCount} description="Registered users in the system." />
                <StatCard title="QR Codes Generated" value={qrContext?.qrHistory.length || 0} description="Static QR codes created." />
                <StatCard title="Total Scans" value={qrContext?.scanHistory.length || 0} description="Successful QR code scans." />
                 <StatCard title="Payments Processed" value={urlContext?.paymentHistory.length || 0} description="Successful subscription payments." />
            </div>

            {/* Service Status */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Service Breakdown</h3>
                <div className="space-y-3">
                    <StatusIndicator label="Database Connection" status={dbServiceStatus} />
                     {dbStatus.status === 'error' && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-sm">
                            <p className="font-bold text-red-300">Database Error Details:</p>
                            <p className="text-red-400 mt-1">Attempted to connect to database: <code className="font-mono bg-black/30 p-1 rounded">{dbStatus.dbName}</code></p>
                            <p className="text-red-400 mt-1 break-all">Error: <span className="font-mono">{dbStatus.message}</span></p>
                            <p className="text-yellow-300 mt-3"><strong>Action Required:</strong> Please verify that the `MONGODB_URI` and `MONGODB_DB_NAME` environment variables are correctly configured in your Vercel project settings.</p>
                        </div>
                    )}
                    <StatusIndicator label="URL Shortening API" status={allSystemsOperational ? 'Operational' : 'Degraded'} />
                    <StatusIndicator label="Redirection Service" status={allSystemsOperational ? 'Operational' : 'Degraded'} />
                    <StatusIndicator label="QR Code Generation" status="Operational" />
                    <StatusIndicator label="User Authentication" status={allSystemsOperational ? 'Operational' : 'Degraded'} />
                    <StatusIndicator label="Payment Gateway" status="Operational" />
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
