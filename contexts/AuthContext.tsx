// contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api';
import type { User, AuthContextType, AuthModalMode } from '../types';

// Super simple mock hash for demo purposes. DO NOT USE IN PRODUCTION.
const mockHash = (str: string) => `hashed_${str}`;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
    const [isSubscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
    const [isApiSubscriptionModalOpen, setApiSubscriptionModalOpen] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = localStorage.getItem('currentUser');
            let user = null;
            if (storedUser) {
                user = JSON.parse(storedUser);
                setCurrentUser(user);
            }
            if (user?.isAdmin) {
                await getAllUsers();
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const handleUserUpdate = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    const login = async (email: string, password: string) => {
        const user = await api.login(email, mockHash(password));
        handleUserUpdate(user);
    };

    const signup = async (name: string, email: string, password: string) => {
        const user = await api.signup(name, email, password);
        handleUserUpdate(user);
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const getAllUsers = async (): Promise<User[]> => {
        const allUsers = await api.getAllUsers();
        setUsers(allUsers);
        return allUsers;
    }
    
    // ... modal functions
    const openAuthModal = (mode: AuthModalMode) => { setAuthModalMode(mode); setAuthModalOpen(true); };
    const closeAuthModal = () => setAuthModalOpen(false);
    const openSubscriptionModal = () => setSubscriptionModalOpen(true);
    const closeSubscriptionModal = () => setSubscriptionModalOpen(false);
    const openApiSubscriptionModal = () => setApiSubscriptionModalOpen(true);
    const closeApiSubscriptionModal = () => setApiSubscriptionModalOpen(false);
    
    // User data updates
    const updateUserData = async (userId: string, data: Partial<User>): Promise<User> => {
        const updatedUser = await api.updateUser(userId, data);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedUser } : u));
        if (currentUser?.id === userId) {
            handleUserUpdate({ ...currentUser, ...updatedUser });
        }
        return updatedUser;
    };

    const updateUserProfile = async (data: { name: string, profilePictureUrl?: string }): Promise<User> => {
        if (!currentUser) throw new Error("Not logged in");
        return updateUserData(currentUser.id, data);
    };
    
    const updateUserSubscription = async (planId: 'monthly' | 'semi-annually' | 'yearly', expiresAt: number) => {
        if (!currentUser) throw new Error("Not logged in");
        await updateUserData(currentUser.id, { subscription: { planId, expiresAt } });
    };

    const generateApiKey = async () => {
        if (!currentUser) throw new Error("Not logged in");
        const apiKey = `qk_test_${Date.now().toString(36)}`;
        const trialExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
        await updateUserData(currentUser.id, {
            apiAccess: {
                apiKey,
                subscription: { planId: 'trial', expiresAt: trialExpiresAt }
            }
        });
    };

    const purchaseApiKey = async (planId: 'basic' | 'pro', expiresAt: number) => {
        if (!currentUser) throw new Error("Not logged in");
        const apiKey = currentUser.apiAccess?.apiKey || `qk_prod_${Date.now().toString(36)}`;
        await updateUserData(currentUser.id, {
            apiAccess: {
                apiKey,
                subscription: { planId, expiresAt }
            }
        });
    };
    
    const updateUserAsDonor = async (userId: string) => {
        await updateUserData(userId, { isDonor: true });
    };

    const value: AuthContextType = {
        currentUser, users, loading,
        isAuthModalOpen, authModalMode, openAuthModal, closeAuthModal,
        isSubscriptionModalOpen, openSubscriptionModal, closeSubscriptionModal,
        isApiSubscriptionModalOpen, openApiSubscriptionModal, closeApiSubscriptionModal,
        login, signup, logout,
        updateUserData, updateUserProfile,
        generateApiKey, purchaseApiKey, updateUserSubscription,
        updateUserAsDonor,
        getAllUsers,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
