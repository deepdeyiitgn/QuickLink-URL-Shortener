import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, AuthContextType, UserSettings, ApiSubscription } from '../types';
import { api } from '../api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A simple mock for password hashing. In a real app, use a proper library like bcrypt.
const pseudoHash = async (password: string): Promise<string> => {
    return `hashed_${password}`;
};
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return `hashed_${password}` === hash;
};

// Simple UUID generator for API keys
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
    const [isSubscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
    const [isApiSubscriptionModalOpen, setApiSubscriptionModalOpen] = useState(false);

    useEffect(() => {
        const loadAuthData = async () => {
            const storedUsers = await api.getUsers();
            setUsers(storedUsers);
            const currentUserId = localStorage.getItem('currentUserId');
            if (currentUserId) {
                const user = storedUsers.find(u => u.id === currentUserId);
                setCurrentUser(user || null);
            }
            setLoading(false);
        };
        loadAuthData();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            throw new Error("User not found.");
        }
        const isMatch = await verifyPassword(password, user.passwordHash);
        if (!isMatch) {
            throw new Error("Invalid credentials.");
        }
        setCurrentUser(user);
        localStorage.setItem('currentUserId', user.id);
    };

    const signup = async (name: string, email: string, password: string): Promise<void> => {
        const passwordHash = await pseudoHash(password);
        const newUser: User = {
            id: `user_${Date.now()}`,
            name,
            email,
            passwordHash,
            createdAt: Date.now(),
            apiAccess: null,
            settings: { warningThreshold: 24 },
            isAdmin: false,
            canSetCustomExpiry: false,
            canModerate: false,
            ipAddress: 'pending', // Placeholder; server will set the real IP
        };
        
        // Use atomic API call to add the new user to the database
        const createdUser = await api.addUser(newUser);
        
        // Optimistically update local state and auto-login
        setUsers(prevUsers => [...prevUsers, createdUser]);
        setCurrentUser(createdUser);
        localStorage.setItem('currentUserId', createdUser.id);
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUserId');
    };
    
    const getAllUsers = async (): Promise<User[]> => {
        return api.getUsers();
    };

    const openAuthModal = (mode: 'login' | 'signup') => {
        setAuthModalMode(mode);
        setAuthModalOpen(true);
    };
    const closeAuthModal = () => setAuthModalOpen(false);

    const openSubscriptionModal = () => setSubscriptionModalOpen(true);
    const closeSubscriptionModal = () => setSubscriptionModalOpen(false);
    
    const openApiSubscriptionModal = () => setApiSubscriptionModalOpen(true);
    const closeApiSubscriptionModal = () => setApiSubscriptionModalOpen(false);

    const updateUserSubscription = useCallback(async (planId: 'monthly' | 'semi-annually' | 'yearly', expiresAt: number) => {
        if (!currentUser) return;
        const updatedUser: User = {
            ...currentUser,
            subscription: { planId, expiresAt },
        };
        await api.updateUser(updatedUser);
        setUsers(users => users.map(u => u.id === currentUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
    }, [currentUser, users]);
    
    const updateUserSettings = useCallback(async (settings: Partial<UserSettings>) => {
        if (!currentUser) return;
        const existingSettings = currentUser.settings || { warningThreshold: 24 };
        const updatedUser: User = {
            ...currentUser,
            settings: { ...existingSettings, ...settings },
        };
        await api.updateUser(updatedUser);
        setUsers(users => users.map(u => u.id === currentUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
    }, [currentUser, users]);

    const updateUserProfile = useCallback(async (profileData: { name?: string; profilePictureUrl?: string }) => {
        if (!currentUser) return;
        const updatedUser: User = { ...currentUser, ...profileData };
        await api.updateUser(updatedUser);
        setUsers(users => users.map(u => u.id === currentUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
    }, [currentUser, users]);

    const generateApiKey = useCallback(async () => {
        if (!currentUser || currentUser.apiAccess) return;
        const newApiKey = `qk_live_${generateUUID()}`;
        const subscription: ApiSubscription = {
            planId: 'free',
            expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        };
        const updatedUser: User = {
            ...currentUser,
            apiAccess: { apiKey: newApiKey, subscription },
        };
        await api.updateUser(updatedUser);
        setUsers(users => users.map(u => u.id === currentUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
    }, [currentUser, users]);

    const purchaseApiKey = useCallback(async (planId: 'basic' | 'pro', expiresAt: number) => {
        if (!currentUser) return;
        const apiKey = currentUser.apiAccess?.apiKey || `qk_live_${generateUUID()}`;
        const subscription: ApiSubscription = { planId, expiresAt };
        const updatedUser: User = {
            ...currentUser,
            apiAccess: { apiKey, subscription },
        };
        await api.updateUser(updatedUser);
        setUsers(users => users.map(u => u.id === currentUser.id ? updatedUser : u));
        setCurrentUser(updatedUser);
    }, [currentUser, users]);

    const updateUserPermissions = useCallback(async (userId: string, permissions: Partial<Pick<User, 'isAdmin' | 'canSetCustomExpiry' | 'canModerate'>>) => {
        const userToUpdate = users.find(u => u.id === userId);
        if (!userToUpdate) throw new Error("User not found to update permissions.");
        
        if (userToUpdate.email === import.meta.env?.VITE_OWNER_EMAIL && permissions.isAdmin === false) {
            throw new Error("Cannot remove admin status from the site owner.");
        }

        const updatedUser = { ...userToUpdate, ...permissions };
        await api.updateUser(updatedUser);
        
        const updatedUsers = users.map(u => u.id === userId ? updatedUser : u);
        setUsers(updatedUsers);

        if (currentUser?.id === userId) {
            setCurrentUser(updatedUser);
        }
    }, [users, currentUser]);


    const value: AuthContextType = {
        currentUser,
        users,
        isAuthModalOpen,
        authModalMode,
        isSubscriptionModalOpen,
        isApiSubscriptionModalOpen,
        login,
        signup,
        logout,
        openAuthModal,
        closeAuthModal,
        openSubscriptionModal,
        closeSubscriptionModal,
        openApiSubscriptionModal,
        closeApiSubscriptionModal,
        updateUserSubscription,
        updateUserSettings,
        updateUserProfile,
        getAllUsers,
        generateApiKey,
        purchaseApiKey,
        updateUserPermissions,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
