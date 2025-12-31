export class AudioUX {
    private static context: AudioContext | null = null;

    private static init() {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    static playTick(frequency: number = 800, duration: number = 0.05) {
        try {
            this.init();
            if (!this.context) return;

            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, this.context.currentTime);

            gain.gain.setValueAtTime(0.05, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.context.destination);

            osc.start();
            osc.stop(this.context.currentTime + duration);
        } catch (e) {
            console.warn('Audio UX failed:', e);
        }
    }
}
