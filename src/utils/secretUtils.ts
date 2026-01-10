import { CATEGORIES, Category } from '../data/categories';

export interface SecretData {
    text: string;
    categoryId: string;
    identity: {
        avatar: string;
        name: string;
    };
    reactions?: {
        hug: number;
        shock: number;
        relatable: number;
    };
    expiresAt?: string; // ISO Date String
    views?: number;
    replies?: {
        text: string;
        timestamp: string;
        identity?: {
            name: string;
            avatar: string;
        };
    }[];
}

export function parseSecretContent(content: string): SecretData {
    try {
        // Try to parse as JSON
        if (content.trim().startsWith('{')) {
            const parsed = JSON.parse(content);
            if (parsed.text && parsed.categoryId) {
                return {
                    text: parsed.text,
                    categoryId: parsed.categoryId,
                    identity: parsed.identity || { avatar: '👻', name: 'Anonymous Ghost' },
                    reactions: parsed.reactions || { hug: 0, shock: 0, relatable: 0 },
                    expiresAt: parsed.expiresAt,
                    views: parsed.views || 0,
                    replies: parsed.replies || []
                };
            }
        }
    } catch (e) {
        // Ignore error, treat as legacy
    }

    // Legacy or plain text fallback
    return {
        text: content,
        categoryId: 'void',
        identity: {
            avatar: '👻',
            name: 'Anonymous Guest'
        },
        reactions: { hug: 0, shock: 0, relatable: 0 },
        views: 0,
        replies: []
    };
}

export function getCategory(id: string): Category {
    return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]; // Default to Void
}
