import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import type { User, AuthContextType, AuthModalMode, Subscription, ApiAccess } from '../types';
import { api } from '../api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple User Agent Parser
const parseUserAgent = () => {
    const ua = navigator.userAgent;
    let deviceType = 'Desktop';
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        deviceType = 'Tablet';
    } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        deviceType = 'Mobile';
    }
    
    let browser = 'Unknown';
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("SamsungBrowser")) browser = "Samsung Browser";
    else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
    else if (ua.includes("Trident")) browser = "Internet Explorer";
    else if (ua.includes("Edge")) browser = "Edge";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";

    return { browser, deviceType };
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
    const [isSubscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
    const [isApiSubscriptionModalOpen, setApiSubscriptionModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);

    const getAllUsers = useCallback(async () => {
        try {
            const allUsers = await api.getUsers();
            setUsers(allUsers);
            return allUsers;
        } catch (error) {
            console.error("Failed to fetch all users:", error);
            return [];
        }
    }, []);

    const handleUserUpdate = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const user: User = JSON.parse(storedUser);
                // Immediately set user to avoid UI flicker
                setCurrentUser(user);
                
                // Then, silently refresh data from the server
                try {
                    const freshUser = await api.getUserById(user.id);
                    handleUserUpdate(freshUser); // Use handler to update both state and localStorage
                } catch {
                    // If refresh fails (e.g., user deleted), log out
                    logout();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    // Effect to fetch user details if they are missing
    useEffect(() => {
        const fetchDetails = async () => {
            if (currentUser && !currentUser.ipAddress) {
                setIsFetchingDetails(true);
                try {
                    const { browser, deviceType } = parseUserAgent();
                    const updatedUser = await api.updateUserDetails(currentUser.id, { browser, deviceType });
                    handleUserUpdate(updatedUser);
                } catch (error) {
                    console.error("Failed to update user details:", error);
                } finally {
                    setIsFetchingDetails(false);
                }
            }
        };
        fetchDetails();
    }, [currentUser]);

    // Fetch all users if the current user is an admin
    useEffect(() => {
        if (currentUser?.isAdmin) {
            getAllUsers();
        }
    }, [currentUser?.isAdmin, getAllUsers]);


const login = async (email: string, password: string) => {
  const res = await api.login(email, password);

  // Agar backend token nahi bhej raha, safe fallback
  if ((res as any).token) {
    localStorage.setItem("token", (res as any).token);
  } else {
    console.warn("Backend did not send token");
  }

  handleUserUpdate(res); // kyunki res hi User type hai
  return res; // return user directly
};


    const signup = async (name: string, email: string, password: string): Promise<string> => {
        const response = await api.signup(name, email, password);
        return response.message;
    };

    const loginWithGoogle = async (credential: string) => {
        const user = await api.loginWithGoogle(credential);
        handleUserUpdate(user);
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const openAuthModal = (mode: AuthModalMode) => {
        setAuthModalMode(mode);
        setAuthModalOpen(true);
    };

    const closeAuthModal = () => setAuthModalOpen(false);
    
    const openSubscriptionModal = () => setSubscriptionModalOpen(true);
    const closeSubscriptionModal = () => setSubscriptionModalOpen(false);
    
    const openApiSubscriptionModal = () => setApiSubscriptionModalOpen(true);
    const closeApiSubscriptionModal = () => setApiSubscriptionModalOpen(false);

    const updateUserSubscription = async (planId: Subscription['planId'], expiresAt: number) => {
        if (!currentUser) throw new Error("Not logged in");
        const updatedUser = await api.updateUser(currentUser.id, { subscription: { planId, expiresAt } });
        handleUserUpdate(updatedUser);
    };
    
    const updateUserProfile = async (updates: Partial<User>) => {
        if (!currentUser) throw new Error("Not logged in");
        const updatedUser = await api.updateUser(currentUser.id, updates);
        handleUserUpdate(updatedUser);
    };

    const generateApiKey = async () => {
        if (!currentUser) throw new Error("Not logged in");
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const subscription = { planId: 'trial' as const, expiresAt: Date.now() + thirtyDays };
        // FIX: The backend's special 'newApiKey' flow expects a 'subscription' object with an API plan,
        // which conflicts with the main User['subscription'] type. Casting to 'any' to bypass this
        // specific client-side type error while matching the backend's expectation.
        const updatedUser = await api.updateUser(currentUser.id, { newApiKey: true, subscription } as any);
        handleUserUpdate(updatedUser);
    };

    const purchaseApiKey = async (planId: ApiAccess['subscription']['planId'], expiresAt: number) => {
        if (!currentUser) throw new Error("Not logged in");
        const newApiAccess: ApiAccess = {
            apiKey: currentUser.apiAccess?.apiKey || '', // Should exist, but fallback
            subscription: { planId, expiresAt }
        };
        const updatedUser = await api.updateUser(currentUser.id, { apiAccess: newApiAccess });
        handleUserUpdate(updatedUser);
    };

    const updateUserAsDonor = async (userId: string) => {
        const updatedUser = await api.updateUser(userId, { isDonor: true });
        if (currentUser && currentUser.id === userId) {
            handleUserUpdate(updatedUser);
        } else {
             setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        }
    };

    const updateUserData = async (userId: string, updates: Partial<User>) => {
        const updatedUser = await api.updateUser(userId, updates);
        if (currentUser && currentUser.id === userId) {
            setCurrentUser(updatedUser);
        }
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    };

    const sendPasswordResetLink = async (email: string) => {
        await api.sendPasswordResetLink(email);
    };

    const resetPassword = async (token: string, newPassword: string) => {
        await api.resetPassword(token, newPassword);
    };

    const value = useMemo(() => ({
        currentUser,
        users,
        isAuthModalOpen,
        authModalMode,
        isSubscriptionModalOpen,
        isApiSubscriptionModalOpen,
        loading,
        isFetchingDetails,
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
        updateUserProfile,
        generateApiKey,
        purchaseApiKey,
        updateUserAsDonor,
        getAllUsers,
        updateUserData,
        loginWithGoogle,
        sendPasswordResetLink,
        resetPassword,
    }), [currentUser, users, isAuthModalOpen, authModalMode, isSubscriptionModalOpen, isApiSubscriptionModalOpen, loading, isFetchingDetails, getAllUsers]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
