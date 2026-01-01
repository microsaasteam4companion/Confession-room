import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sparkles
} from 'lucide-react';
import type { Message } from '@/types';
import promptsData from '../../../truth-and-dare.json';

const TOPIC_KEYWORDS: Record<string, string[]> = {
    Icebreaker: ["hi", "hello", "hey", "food", "movie", "weather", "intro", "basics", "song", "app"],
    friends: ["friend", "bestie", "group", "trust", "buddy", "squad", "late", "advice"],
    party: ["party", "dance", "club", "music", "drink", "dj", "night", "song", "toast"],
    couple: ["love", "partner", "relationship", "date", "together", "marriage", "crush", "hug"],
    crush: ["crush", "crushing", "attractive", "shy", "cute", "handsome", "pretty"],
    office_work: ["work", "office", "job", "boss", "task", "deadline", "professional", "company", "colleague"],
    family: ["family", "mom", "dad", "home", "parent", "sister", "brother", "cousin", "tradition"],
    self_discovery: ["myself", "alone", "growth", "habit", "personality", "life", "goal"],
    deep_psychological: ["fear", "psychological", "anxiety", "deep", "mind", "trauma", "vulnerable", "insecure", "healing"]
};

interface TruthOrDareBotProps {
    onSend: (message: string) => void;
    messages?: Message[];
}

export function TruthOrDareBot({ onSend, messages = [] }: TruthOrDareBotProps) {
    const detectTopic = (): string | null => {
        if (!messages.length) return null;

        // Take last 5 messages
        const recentText = messages
            .slice(-5)
            .map(m => m.content.toLowerCase())
            .join(' ');

        let bestTopic: string | null = null;
        let maxCount = 0;

        for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
            let count = 0;
            keywords.forEach(kw => {
                if (recentText.includes(kw)) count++;
            });

            if (count > maxCount) {
                maxCount = count;
                bestTopic = topic;
            }
        }

        return maxCount > 0 ? bestTopic : null;
    };

    const getPrompt = (type: 'truth' | 'dare') => {
        const detectedTopic = detectTopic();
        const categories = promptsData.categories;

        // Find categories that match the detected topic or pick a random one
        let selectedCategory: any;
        if (detectedTopic) {
            selectedCategory = categories.find((c: any) => (c.id === detectedTopic || c.category === detectedTopic));
        }

        // If no topic detected or category not found, pick random
        if (!selectedCategory) {
            selectedCategory = categories[Math.floor(Math.random() * categories.length)];
        }

        const categoryName = selectedCategory.id || selectedCategory.category;
        let prompts: string[] = [];

        // Handle inconsistent JSON structure
        if (selectedCategory.levels) {
            // Pick a random level (basic, advanced, pro)
            const levels = Object.values(selectedCategory.levels);
            const randomLevel: any = levels[Math.floor(Math.random() * levels.length)];
            prompts = type === 'truth' ? randomLevel.truth : randomLevel.dare;
        } else {
            // Flat structure (like Icebreaker)
            prompts = type === 'truth' ? selectedCategory.truths : selectedCategory.dares;
        }

        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        const text = randomPrompt;
        onSend(text);
    };

    const detectedTopic = detectTopic();

    return (
        <div className="flex flex-col gap-2">
            {/* Floating Prompt Chips */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => getPrompt('truth')}
                    className="h-8 rounded-full bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-[10px] md:text-xs"
                >
                    🤔 Ask Truth
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => getPrompt('dare')}
                    className="h-8 rounded-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 text-[10px] md:text-xs"
                >
                    🔥 Give Dare
                </Button>

                {detectedTopic && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] md:text-xs text-primary animate-pulse">
                        <Sparkles className="w-2.5 h-2.5" />
                        Vibe: {detectedTopic}
                    </div>
                )}
            </div>

        </div>
    );
}
