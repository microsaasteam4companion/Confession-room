import {
    Moon,
    Flame,
    Briefcase,
    Users,
    Ghost,
    HeartCrack,
    LucideIcon
} from 'lucide-react';

export interface Category {
    id: string;
    label: string;
    description: string; // "Regrets", "Work Rants"
    color: string; // Tailwind class for text/bg
    borderColor: string;
    gradient: string;
    icon: LucideIcon;
}

export const CATEGORIES: Category[] = [
    {
        id: 'regret',
        label: 'The Regret Room',
        description: 'Regrets',
        color: 'text-purple-400',
        borderColor: 'border-purple-500/50',
        gradient: 'from-purple-900/50 to-indigo-900/50',
        icon: HeartCrack
    },
    {
        id: 'hot_take',
        label: 'The Hot Take',
        description: 'Unpopular Opinions',
        color: 'text-orange-500',
        borderColor: 'border-orange-500/50',
        gradient: 'from-orange-900/50 to-red-900/50',
        icon: Flame
    },
    {
        id: 'office',
        label: 'The Office Bitch-Room',
        description: 'Work Rants',
        color: 'text-slate-400',
        borderColor: 'border-slate-500/50',
        gradient: 'from-slate-800/50 to-gray-800/50',
        icon: Briefcase
    },
    {
        id: 'family',
        label: 'The Family Drama',
        description: 'Family Issues',
        color: 'text-teal-400',
        borderColor: 'border-teal-500/50',
        gradient: 'from-teal-900/50 to-emerald-900/50',
        icon: Users
    },
    {
        id: 'midnight',
        label: '3 AM Thoughts',
        description: 'Midnight Thoughts',
        color: 'text-indigo-300',
        borderColor: 'border-indigo-500/50',
        gradient: 'from-indigo-950 to-blue-950',
        icon: Moon
    },
    {
        id: 'void',
        label: 'Into The Void',
        description: 'Uncategorized',
        color: 'text-pink-500',
        borderColor: 'border-pink-500/50',
        gradient: 'from-pink-900/20 to-rose-900/20',
        icon: Ghost
    },
    {
        id: 'incinerator',
        label: 'Digital Incinerator',
        description: 'Read Fast. It Burns.',
        color: 'text-red-600',
        borderColor: 'border-red-600/50',
        gradient: 'from-red-950 to-orange-950',
        icon: Flame
    }
];
