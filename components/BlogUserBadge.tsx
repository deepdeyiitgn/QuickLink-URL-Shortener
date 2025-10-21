

import React from 'react';
// FIX: Corrected import path for types
import type { UserBadge } from '../types';
import { BadgeCheckIcon, CrownIcon, WarningIcon, ShieldCheckIcon } from './icons/IconComponents';

interface BlogUserBadgeProps {
    badge: UserBadge;
}

const BADGE_CONFIG: Record<UserBadge, { label: string; className: string; icon: React.FC<any> }> = {
    normal: { label: 'User', className: 'text-green-400', icon: BadgeCheckIcon },
    premium: { label: 'Premium', className: 'text-pink-400', icon: BadgeCheckIcon },
    moderator: { label: 'Admin', className: 'text-blue-400', icon: BadgeCheckIcon },
    owner: { label: 'Owner', className: 'text-yellow-400', icon: CrownIcon },
    blacklist: { label: 'Blacklisted', className: 'text-red-400', icon: WarningIcon },
};

const BlogUserBadge: React.FC<BlogUserBadgeProps> = ({ badge }) => {
    // Hide badge for normal users to reduce clutter
    if (badge === 'normal') {
        return null;
    }

    // Special case for owner: Crown + Blue Tick
    if (badge === 'owner') {
        const ownerConfig = BADGE_CONFIG.owner;
        const moderatorConfig = BADGE_CONFIG.moderator; // for blue tick color
        return (
            <span className="inline-flex items-center gap-1">
                <span title={ownerConfig.label} className={ownerConfig.className}><ownerConfig.icon className="h-4 w-4" /></span>
                <span title="Verified Admin" className={moderatorConfig.className}><BadgeCheckIcon className="h-4 w-4" /></span>
            </span>
        );
    }
    
    const config = BADGE_CONFIG[badge];
    if (!config) return null;
    
    const Icon = config.icon;

    return (
        <span title={config.label} className={`inline-flex items-center gap-1.5 ${config.className}`}>
            <Icon className="h-4 w-4" />
        </span>
    );
};

export default BlogUserBadge;