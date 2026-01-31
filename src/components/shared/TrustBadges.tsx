'use client';

import { Shield, Award, Clock, Sparkles } from 'lucide-react';

const badges = [
    {
        icon: <Shield size={16} />,
        label: 'Trusted Since 1972',
        color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
        icon: <Award size={16} />,
        label: 'Certified Experts',
        color: 'bg-green-50 text-green-600 border-green-200',
    },
    {
        icon: <Clock size={16} />,
        label: 'On-Time Guarantee',
        color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
        icon: <Sparkles size={16} />,
        label: 'Premium Products',
        color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
];

export default function TrustBadges() {
    return (
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-3">
            {badges.map((badge, index) => (
                <div
                    key={index}
                    className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-medium ${badge.color}`}
                >
                    {badge.icon}
                    <span className="truncate">{badge.label}</span>
                </div>
            ))}
        </div>
    );
}
