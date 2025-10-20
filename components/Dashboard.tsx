import React, { useContext } from 'react';
// FIX: Corrected import path for AuthContext
import { AuthContext } from '../contexts/AuthContext';
import ProfileSettings from './ProfileSettings';
import SubscriptionStatus from './SubscriptionStatus';
import OwnerDashboard from './OwnerDashboard';
import { AuthContextType } from '../types';

const Dashboard: React.FC = () => {
    // FIX: Cast context to the correct type to resolve property errors
    const auth = useContext(AuthContext) as AuthContextType;
    const { currentUser, openAuthModal } = auth || {};

    if (!currentUser) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-white">Access Denied</h1>
                <p className="text-gray-400 mt-4">You must be logged in to view your dashboard.</p>
                <button onClick={() => openAuthModal && openAuthModal('login')} className="mt-8 px-6 py-3 bg-brand-primary text-brand-dark font-semibold rounded-md hover:bg-brand-primary/80 transition-all shadow-[0_0_10px_#00e5ff]">
                    Log In or Sign Up
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-2 animate-aurora">Welcome, {currentUser.name}!</h1>
                <p className="text-lg text-gray-400">Manage your profile, subscription, and links here.</p>
            </div>

            <SubscriptionStatus />
            <ProfileSettings />

            {currentUser.isAdmin && (
                <OwnerDashboard />
            )}

            {/* In a real app, URL and QR history would be here */}
            <div className="glass-card p-6 md:p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Your Links & QR Codes</h2>
                <p className="text-gray-400">Link and QR code management functionality will be displayed here in a future update.</p>
            </div>
        </div>
    );
};

export default Dashboard;
