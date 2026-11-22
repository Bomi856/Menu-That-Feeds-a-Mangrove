// Synthesized cutesy music + real instrumental MP3 tracks (Magnetic & Illegal) + kawaii SFX

export type MusicTrackId = 'cafe' | 'lullaby' | 'magnetic' | 'illegal';

const MP3_TRACKS: Partial<Record<MusicTrackId, string>> = {
  magnetic: '/assets/aistudio/ILLIT________Magnetic__Instrumental_-_ONECOER__128k__893f18e2.mp3',
  illegal: '/assets/aistudio/PinkPantheress_-_Illegal__Official_Instrumental__-_dan__128k__653cb1e5.mp3',
};

class CuteAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private trackId: MusicTrackId = 'magnetic';
  private timer: number | null = null;
  private step = 0;
  private nextNoteTime = 0;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private htmlAudio: HTMLAudioElement | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.65;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 1.0;
      this.sfxGain.connect(this.ctx.destination);

      this.delayNode = this.ctx.createDelay(0.5);
      this.delayNode.delayTime.value = 0.24;
      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.value = 0.22;

      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 1800;

      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      delayFilter.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private playBell(
    freq: number,
    time: number,
    duration: number,
    volume: number,
    withEcho = true,
    isSfx = false
  ) {
    const ctx = this.ctx;
    const output = isSfx ? this.sfxGain : this.masterGain;
    if (!ctx || !output) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, time);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.14, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(gain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(gain);

    gain.connect(output);
    if (withEcho && this.delayNode && !isSfx) {
      const send = ctx.createGain();
      send.gain.value = 0.26;
      gain.connect(send);
      send.connect(this.delayNode);
    }

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.04);
    osc2.stop(time + duration + 0.04);
  }

  private playKalimba(
    freq: number,
    time: number,
    duration: number,
    volume: number,
    isSfx = false
  ) {
    const ctx = this.ctx;
    const output = isSfx ? this.sfxGain : this.masterGain;
    if (!ctx || !output) return;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isSfx ? 2400 : 1400, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(output);

    osc.start(time);
    osc.stop(time + duration + 0.04);
  }

  private playBrushTick(time: number, volume: number) {
    const ctx = this.ctx;
    if (!ctx || !this.masterGain) return;
    const len = Math.floor(ctx.sampleRate * 0.035);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 5200;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(time);
  }

  private schedule = () => {
    const ctx = this.ctx;
    if (!ctx || !this.isPlaying || MP3_TRACKS[this.trackId]) return;

    if (this.trackId === 'cafe') {
      const sp16 = 60 / 102 / 4;
      const bass = [174.61, 196.0, 164.81, 220.0];
      const chords = [
        [349.23, 440.0, 523.25, 659.25],
        [392.0, 493.88, 587.33, 659.25],
        [329.63, 392.0, 493.88, 587.33],
        [220.0, 329.63, 392.0, 523.25],
      ];
      const lead = [
        [659.25, 0, 587.33, 0, 523.25, 0, 659.25, 0, 880.0, 0, 783.99, 0, 659.25, 0, 523.25, 0],
        [587.33, 0, 659.25, 0, 783.99, 0, 659.25, 0, 587.33, 0, 523.25, 0, 493.88, 0, 0, 0],
        [659.25, 0, 783.99, 0, 987.77, 0, 880.0, 0, 783.99, 0, 659.25, 0, 587.33, 0, 659.25, 0],
        [880.0, 0, 783.99, 0, 659.25, 0, 523.25, 0, 587.33, 0, 659.25, 0, 523.25, 0, 0, 0],
      ];

      while (this.nextNoteTime < ctx.currentTime + 0.25) {
        const bar = Math.floor(this.step / 16) % 4;
        const s = this.step % 16;
        const t = this.nextNoteTime;

        if (s === 0 || s === 6 || s === 8 || s === 14) {
          this.playKalimba(bass[bar] * (s === 6 || s === 14 ? 1.5 : 1), t, 0.24, 0.08);
        }
        if (s % 4 === 2) {
          chords[bar].forEach((note, idx) => {
            this.playKalimba(note, t + idx * 0.018, 0.22, 0.028);
          });
        }
        if (s % 2 === 0) {
          this.playBrushTick(t, s % 4 === 2 ? 0.015 : 0.008);
        }
        const mel = lead[bar][s];
        if (mel) {
          this.playBell(mel, t, 0.34, 0.065, true);
        }

        this.step++;
        this.nextNoteTime += sp16;
      }
    } else if (this.trackId === 'lullaby') {
      const sp8 = 60 / 88 / 2;
      const chords = [
        [261.63, 329.63, 392.0, 493.88],
        [349.23, 440.0, 523.25, 659.25],
        [293.66, 349.23, 440.0, 523.25],
        [196.0, 293.66, 392.0, 493.88],
      ];
      const lead = [
        [523.25, 659.25, 783.99, 659.25, 0, 523.25, 659.25, 783.99, 1046.5, 987.77, 783.99, 0],
        [880.0, 783.99, 659.25, 587.33, 0, 523.25, 659.25, 880.0, 783.99, 659.25, 587.33, 0],
        [659.25, 587.33, 523.25, 440.0, 0, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 0],
        [587.33, 659.25, 783.99, 587.33, 0, 493.88, 523.25, 587.33, 659.25, 0, 523.25, 0],
      ];

      while (this.nextNoteTime < ctx.currentTime + 0.25) {
        const bar = Math.floor(this.step / 12) % 4;
        const s = this.step % 12;
        const t = this.nextNoteTime;

        if (s % 2 === 0) {
          const arpNote = chords[bar][(s / 2) % 4];
          this.playKalimba(arpNote, t, 0.35, 0.036);
        }
        const mel = lead[bar][s];
        if (mel) {
          this.playBell(mel, t, 0.48, 0.06, true);
        }

        this.step++;
        this.nextNoteTime += sp8;
      }
    }
  };

  private ensureHtmlAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.htmlAudio) {
      this.htmlAudio = new Audio();
      this.htmlAudio.loop = true;
      this.htmlAudio.volume = 0.42;
      this.htmlAudio.preload = 'auto';
      this.htmlAudio.addEventListener('ended', () => {
        if (this.isPlaying && MP3_TRACKS[this.trackId] && this.htmlAudio) {
          this.htmlAudio.currentTime = 0;
          void this.htmlAudio.play().catch(() => {
            // Ignore autoplay restriction errors
          });
        }
      });
    }
    return this.htmlAudio;
  }

  private stopHtmlAudio() {
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.currentTime = 0;
    }
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    }
    this.startMusic();
    return true;
  }

  public startMusic() {
    this.stopMusic();
    this.isPlaying = true;

    const mp3Src = MP3_TRACKS[this.trackId];
    if (mp3Src) {
      const audio = this.ensureHtmlAudio();
      if (audio) {
        audio.loop = true;
        if (audio.getAttribute('data-track') !== this.trackId) {
          audio.src = mp3Src;
          audio.setAttribute('data-track', this.trackId);
        }
        void audio.play().catch(() => {
          // Ignore autoplay restriction errors until next user gesture
        });
      }
      return;
    }

    const ctx = this.ensureContext();
    if (!ctx) return;
    this.step = 0;
    this.nextNoteTime = ctx.currentTime + 0.06;
    this.schedule();
    this.timer = window.setInterval(this.schedule, 65);
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.stopHtmlAudio();
  }

  public setTrack(track: MusicTrackId) {
    const wasPlaying = this.isPlaying;
    this.trackId = track;
    this.step = 0;
    if (wasPlaying) {
      this.startMusic();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public async tryAutoStart(): Promise<boolean> {
    this.stopMusic();
    this.isPlaying = true;

    const mp3Src = MP3_TRACKS[this.trackId];
    if (mp3Src) {
      const audio = this.ensureHtmlAudio();
      if (audio) {
        audio.loop = true;
        if (audio.getAttribute('data-track') !== this.trackId) {
          audio.src = mp3Src;
          audio.setAttribute('data-track', this.trackId);
        }
        try {
          await audio.play();
          return true;
        } catch {
          this.isPlaying = false;
          return false;
        }
      }
    }

    const ctx = this.ensureContext();
    if (!ctx || ctx.state === 'suspended') {
      this.isPlaying = false;
      return false;
    }
    this.step = 0;
    this.nextNoteTime = ctx.currentTime + 0.06;
    this.schedule();
    this.timer = window.setInterval(this.schedule, 65);
    return true;
  }

  public playPop(pitch = 660) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.playBell(pitch, ctx.currentTime + 0.005, 0.13, 0.32, false, true);
  }

  public playSplash() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t = ctx.currentTime + 0.005;
    this.playBell(523.25, t, 0.16, 0.3, false, true);
    this.playBell(783.99, t + 0.07, 0.2, 0.3, false, true);
    this.playBell(1046.5, t + 0.14, 0.26, 0.26, false, true);
  }

  public playStir(stepIndex: number) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const freq = scale[stepIndex % scale.length];
    this.playBell(freq, ctx.currentTime + 0.005, 0.18, 0.32, false, true);
  }

  public playSparkle() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t = ctx.currentTime + 0.01;
    [659.25, 783.99, 987.77, 1318.51].forEach((f, i) => {
      this.playBell(f, t + i * 0.075, 0.34, 0.3, false, true);
    });
  }

  public playOops() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const t = ctx.currentTime + 0.01;
    this.playKalimba(329.63, t, 0.16, 0.36, true);
    this.playKalimba(261.63, t + 0.1, 0.2, 0.36, true);
  }
}

export const cuteAudio = new CuteAudioEngine();
