import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../api';
import { LoadingIcon } from './icons/IconComponents';
import { timeAgo } from '../utils/time';
import { User } from '../types';

const StatusIndicator: React.FC<{ label: string; status: 'Operational' | 'Degraded' | 'Offline' }> = ({ label, status }) => {
    const color = status === 'Operational' ? 'bg-green-500' : status === 'Degraded' ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-white/10">
            <span className="text-gray-300 text-sm">{label}</span>
            <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
                <span className={`text-xs ${color.replace('bg-', 'text-')}`}>{status}</span>
            </div>
        </div>
    );
};

const LiveActivityDashboard: React.FC = () => {
    const auth = useContext(AuthContext);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth?.currentUser?.isAdmin) return;

        const fetchData = async () => {
            try {
                const dashboardData = await api.getAdminDashboardData(auth.currentUser.id);
                setData(dashboardData);
            } catch (error) {
                console.error("Failed to fetch admin dashboard data:", error);
            } finally {
                setLoading(false); // Only set loading to false on the first fetch
            }
        };

        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [auth?.currentUser]);

    if (loading) {
        return <div className="text-center py-10"><LoadingIcon className="h-8 w-8 animate-spin mx-auto text-brand-secondary" /></div>;
    }

    if (!data) {
        return <p className="text-center text-red-400">Failed to load live activity data.</p>;
    }

    const onlineUsers = data.allUsers.filter((user: User) => (Date.now() - user.lastActive) < 5 * 60 * 1000);
    const { systemStatus } = data;
    
    const dbServiceStatus = systemStatus.db.status === 'ok' ? 'Operational' : 'Offline';
    const authServiceStatus = systemStatus.auth.status === 'ok' ? 'Operational' : 'Offline';
    const urlServiceStatus = systemStatus.urls.status === 'ok' ? 'Operational' : 'Offline';
    const paymentServiceStatus = systemStatus.payments.status === 'ok' ? 'Operational' : 'Degraded';

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Live System Status</h3>
                 <div className="space-y-2">
                    <StatusIndicator label="Database Connection" status={dbServiceStatus} />
                    <StatusIndicator label="User Authentication" status={authServiceStatus} />
                    <StatusIndicator label="URL Services" status={urlServiceStatus} />
                    <StatusIndicator label="Payment Gateway" status={paymentServiceStatus} />
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Online Users ({onlineUsers.length})</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {onlineUsers.length > 0 ? onlineUsers.map((user: User) => (
                            <div key={user.id} className="p-2 bg-black/40 rounded flex justify-between items-center">
                                <p className="text-sm text-gray-300">{user.name}</p>
                                <span className="text-xs text-green-400">Online</span>
                            </div>
                        )) : <p className="text-sm text-gray-500">No users currently online.</p>}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                     <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {data.activityLogs.length > 0 ? data.activityLogs.map((log: any) => (
                            <div key={log._id} className="p-2 bg-black/40 rounded">
                                <p className="text-sm text-gray-300">
                                    <span className="font-semibold text-white">{log.userName}</span> just logged in.
                                </p>
                                <p className="text-xs text-gray-500">{timeAgo(log.timestamp)}</p>
                            </div>
                        )) : <p className="text-sm text-gray-500">No recent user activity.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveActivityDashboard;
