import React from 'react';
import type { UserBadge } from '../types';
import { BadgeCheckIcon, CrownIcon } from './icons/IconComponents';

interface BlogUserBadgeProps {
    badge: UserBadge;
}

const BADGE_CONFIG: Record<UserBadge, { label: string; className: string; icon: React.FC<any> | null }> = {
    normal: { label: 'User', className: '', icon: null },
    premium: { label: 'Premium', className: 'bg-green-500/20 text-green-400', icon: CrownIcon },
    owner: { label: 'Owner', className: 'bg-yellow-500/20 text-yellow-400', icon: BadgeCheckIcon },
};

const BlogUserBadge: React.FC<BlogUserBadgeProps> = ({ badge }) => {
    const config = BADGE_CONFIG[badge];

    if (!config.icon) {
        return null; // Don't show a badge for normal users
    }
    
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </span>
    );
};

export default BlogUserBadge;
