
// FIX: Corrected import path for types
import type { User, UserBadge } from '../types';

export const getUserBadge = (user: User | null): UserBadge => {
    if (!user) return 'normal';
    if (user.status === 'banned') return 'blacklist';
    if (user.isAdmin) return 'owner';
    if (user.canModerate) return 'moderator';
    
    const hasActiveSub = (user.subscription && user.subscription.expiresAt > Date.now()) || 
                         (user.apiAccess?.subscription && user.apiAccess.subscription.expiresAt > Date.now());

    if (hasActiveSub || user.isDonor) return 'premium';

    return 'normal';
};