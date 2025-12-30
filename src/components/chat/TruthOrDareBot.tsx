import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, messageSquare } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PROMPTS = {
    truth: [
        "What's your biggest fear?",
        "What's the last lie you told?",
        "What's a secret you've never told anyone?",
        "Who is your secret crush?",
        "What's the most embarrassing thing you've ever done?",
        "What's your biggest regret?",
        "If you could trade lives with one person for a day, who would it be?",
        "What's the most trouble you've ever been in?",
        "What's one thing you wish you could change about yourself?",
        "What's the worst date you've ever been on?"
    ],
    dare: [
        "Send a funny selfie right now.",
        "Type your next message with your nose.",
        "Confess your love to the 3rd person in the participants list.",
        "Send a voice note singing a song (if voice is supported) or type the lyrics.",
        "Reveal your battery percentage.",
        "Tell a bad joke.",
        "Describe your current outfit in detail.",
        "Type the first 5 words suggested by your predictive text.",
        "Send a message entirely in emojis.",
        "Dare to be honest: Rate this room from 1-10."
    ]
};

interface TruthOrDareBotProps {
    onSend: (message: string) => void;
}

export function TruthOrDareBot({ onSend }: TruthOrDareBotProps) {
    const getPrompt = (type: 'truth' | 'dare') => {
        const prompts = PROMPTS[type];
        const random = prompts[Math.floor(Math.random() * prompts.length)];
        const text = `🤖 BOT (${type.toUpperCase()}): ${random}`;
        onSend(text);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" title="Truth or Dare Bot">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 glass-card">
                <DropdownMenuItem onClick={() => getPrompt('truth')} className="cursor-pointer">
                    🤔 Truth
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => getPrompt('dare')} className="cursor-pointer">
                    🔥 Dare
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
