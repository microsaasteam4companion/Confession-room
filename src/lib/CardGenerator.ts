type CardTheme = {
    name: string;
    bgStart: string;
    bgEnd: string;
    accent: string;
    emoji: string;
    pattern: 'circles' | 'hearts' | 'sparks';
};

const THEMES: Record<string, CardTheme> = {
    cyber: {
        name: 'Cyber',
        bgStart: '#0f0f12',
        bgEnd: '#2d1b4d',
        accent: '#a855f7',
        emoji: '“',
        pattern: 'circles'
    },
    love: {
        name: 'Love',
        bgStart: '#1a0510',
        bgEnd: '#4d0b2b',
        accent: '#f43f5e',
        emoji: '❤️',
        pattern: 'hearts'
    },
    wild: {
        name: 'Wild',
        bgStart: '#1a0d05',
        bgEnd: '#4d2d0b',
        accent: '#f59e0b',
        emoji: '🔥',
        pattern: 'sparks'
    }
};

export class CardGenerator {
    private static getTheme(text: string): CardTheme {
        const lowerText = text.toLowerCase();

        // Love Detection
        if (/(love|crush|heart|dating|boyfriend|girlfriend|miss you|kiss|cute|forever|shadi)/i.test(lowerText)) {
            return THEMES.love;
        }

        // Wild Detection
        if (/(wild|party|night|drunk|crazy|dare|truth|bold|secret|illegal|stole|fight)/i.test(lowerText)) {
            return THEMES.wild;
        }

        return THEMES.cyber;
    }

    static async generate(text: string, avatarName: string = "Anonymous"): Promise<string> {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        const theme = this.getTheme(text);

        // Set dimensions
        canvas.width = 1080;
        canvas.height = 1080;

        // 1. Draw Background Gradient
        const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
        grad.addColorStop(0, theme.bgStart);
        grad.addColorStop(1, theme.bgEnd);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1080);

        // 2. Draw Theme Patterns
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = theme.accent;

        if (theme.pattern === 'circles') {
            for (let i = 0; i < 20; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * 1080, Math.random() * 1080, Math.random() * 300, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (theme.pattern === 'hearts') {
            ctx.font = '80px serif';
            for (let i = 0; i < 30; i++) {
                ctx.save();
                ctx.translate(Math.random() * 1080, Math.random() * 1080);
                ctx.rotate(Math.random() * Math.PI);
                ctx.fillText('❤️', 0, 0);
                ctx.restore();
            }
        } else if (theme.pattern === 'sparks') {
            for (let i = 0; i < 50; i++) {
                ctx.beginPath();
                const x = Math.random() * 1080;
                const y = Math.random() * 1080;
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.random() * 20, y + Math.random() * 20);
                ctx.strokeStyle = theme.accent;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1.0;

        // 3. Draw Quotation / Emoji
        ctx.font = 'bold 120px serif';
        ctx.fillStyle = `${theme.accent}33`; // 20% opacity hex
        ctx.textAlign = 'left';
        ctx.fillText(theme.emoji, 80, 180);

        // 4. Draw Main Text (Wrapped)
        ctx.fillStyle = '#ffffff';
        ctx.font = '500 48px "Inter", sans-serif';
        ctx.textAlign = 'center';

        const maxWidth = 800;
        const words = text.split(' ');
        let line = '';
        let lines = [];
        const lineHeight = 65;

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        const startY = (1080 - (lines.length * lineHeight)) / 2;
        lines.forEach((l, i) => {
            ctx.fillText(l.trim(), 540, startY + (i * lineHeight));
        });

        // 5. Draw Avatar/Name with Theme Accent
        ctx.font = 'bold 32px "Inter", sans-serif';
        ctx.fillStyle = theme.accent;
        ctx.fillText(`— ${avatarName}`, 540, startY + (lines.length * lineHeight) + 80);

        // 6. Draw Watermark & Branding
        ctx.font = 'bold 40px "Inter", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.3;
        ctx.fillText('CONFESS ROOM', 540, 980);

        ctx.font = '18px "Inter", sans-serif';
        ctx.fillText('anonymous. ephemeral. safe.', 540, 1010);
        ctx.globalAlpha = 1.0;

        // 7. Decoration Line (Themed)
        ctx.strokeStyle = `${theme.accent}80`; // 50% opacity
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(440, 930);
        ctx.lineTo(640, 930);
        ctx.stroke();

        return canvas.toDataURL('image/png');
    }
}
