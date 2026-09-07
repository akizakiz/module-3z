/**
 * Moteur Audio Procédural Web Audio pour « Les Chroniques du Croissant Fertile »
 * Sons d'instruments anciens (harpe, flûte antique, oud, percussions orientales, réverbération de pierre)
 * Ambiances par chapitre, soundscapes continus de scène, contrôles de volume séparés et SFX de jauges.
 */

class AncientSoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgMusicPlaying = false;
        this.bgMusicTimer = null;
        this.currentChapter = 1;
        this.currentSceneBg = null;
        
        this.masterVolume = 0.6;
        this.musicVolume = 0.4;
        this.sfxVolume = 0.7;

        this.masterGainNode = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.ambientGain = null;
        this.ambientSource = null;
        this.reverbNode = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGainNode = this.ctx.createGain();
        this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        this.masterGainNode.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        this.musicGain.connect(this.masterGainNode);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGainNode);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGainNode);

        this.reverbNode = this.createStoneReverb(1.2);
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMusicVolume(vol) {
        this.musicVolume = parseFloat(vol);
        const label = document.getElementById("vol-music-val");
        if (label) label.innerText = `${Math.round(this.musicVolume * 100)}%`;
        if (this.musicGain && this.ctx) {
            this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
        }
    }

    setSfxVolume(vol) {
        this.sfxVolume = parseFloat(vol);
        const label = document.getElementById("vol-sfx-val");
        if (label) label.innerText = `${Math.round(this.sfxVolume * 100)}%`;
        if (this.sfxGain && this.ctx) {
            this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGainNode && this.ctx) {
            this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    createStoneReverb(duration = 1.0) {
        if (!this.ctx) return null;
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.ctx.createBuffer(2, length, sampleRate);
        const left = impulse.getChannelData(0);
        const right = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const decay = Math.exp(-i / (sampleRate * (duration / 3)));
            left[i] = (Math.random() * 2 - 1) * decay;
            right[i] = (Math.random() * 2 - 1) * decay;
        }

        const convolver = this.ctx.createConvolver();
        convolver.buffer = impulse;
        return convolver;
    }

    // ==========================================
    // MUSIQUE D'AMBIANCE PROCÉDURALE PAR CHAPITRE
    // ==========================================
    startAtmosphere() {
        this.init();
        this.resume();
        if (this.bgMusicPlaying) return;
        this.bgMusicPlaying = true;
        this.playAtmosphereLoop();
    }

    setChapter(chap) {
        let num = 1;
        if (typeof chap === "string") {
            if (chap.includes("V") || chap.includes("5")) num = 5;
            else if (chap.includes("IV") || chap.includes("4")) num = 4;
            else if (chap.includes("III") || chap.includes("3")) num = 3;
            else if (chap.includes("II") || chap.includes("2")) num = 2;
            else num = 1;
        } else {
            num = chap;
        }
        this.currentChapter = num;
    }

    playAtmosphereLoop() {
        if (!this.bgMusicPlaying || this.isMuted) return;

        if (this.currentChapter <= 2) {
            this.playAtmosphere_CH1_2();
        } else if (this.currentChapter === 3) {
            this.playAtmosphere_CH3();
        } else if (this.currentChapter === 4) {
            this.playAtmosphere_CH4();
        } else {
            this.playAtmosphere_CH5();
        }

        const nextInterval = 4500 + Math.random() * 3500;
        this.bgMusicTimer = setTimeout(() => this.playAtmosphereLoop(), nextInterval);
    }

    /** CH1-2 (Ur & Babylone) : Harpe antique grave + cadence phrygienne */
    playAtmosphere_CH1_2() {
        const roots = [220, 196, 174.61, 164.81]; // Am, G, F, E
        const root = roots[Math.floor(Math.random() * roots.length)];
        const intervals = [1, 1.2, 1.333, 1.5, 1.777, 2];
        const notes = intervals.map(i => root * i);

        notes.forEach((freq, idx) => {
            setTimeout(() => {
                if (this.bgMusicPlaying) this.pluckAncientString(freq, 2.5);
            }, idx * 420 + Math.random() * 100);
        });

        if (Math.random() > 0.45) {
            setTimeout(() => {
                if (this.bgMusicPlaying) this.playAncientFlute(notes[Math.floor(Math.random() * notes.length)] * 2, 3.8);
            }, 1800);
        }
    }

    /** CH3 (Ziggourat d'Ur) : Flûte sacrée haute + harmoniques mystiques */
    playAtmosphere_CH3() {
        const holyScale = [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33]; // D dorien sacré
        const mainNote = holyScale[Math.floor(Math.random() * holyScale.length)];

        this.playAncientFlute(mainNote, 4.5);

        setTimeout(() => {
            if (this.bgMusicPlaying) {
                const secondNote = holyScale[Math.floor(Math.random() * holyScale.length)];
                this.playAncientFlute(secondNote, 3.5);
                this.pluckAncientString(mainNote / 2, 3.0);
            }
        }, 1200);
    }

    /** CH4 (Tribunal Royal d'Hammurabi) : Cordes tendues & silences dramatiques */
    playAtmosphere_CH4() {
        const tensionRoots = [146.83, 164.81, 196.00, 220.00]; // D2, E2, G2, A2
        const root = tensionRoots[Math.floor(Math.random() * tensionRoots.length)];

        // Frappe grave
        this.pluckAncientString(root, 3.0, 'sawtooth');

        setTimeout(() => {
            if (this.bgMusicPlaying) {
                this.pluckAncientString(root * 1.5, 2.0); // quinte
            }
        }, 600);

        if (Math.random() > 0.5) {
            setTimeout(() => {
                if (this.bgMusicPlaying) {
                    this.playAncientFlute(root * 2.8, 3.0);
                }
            }, 1500);
        }
    }

    /** CH5 (Égypte & Le Nil) : Oud mélodieux + Gamme orientale Hijaz */
    playAtmosphere_CH5() {
        const hijazScale = [220, 233.08, 277.18, 293.66, 329.63, 349.23, 392.00, 440];
        const pick = [hijazScale[0], hijazScale[2], hijazScale[4], hijazScale[5], hijazScale[7]];

        pick.forEach((freq, idx) => {
            setTimeout(() => {
                if (this.bgMusicPlaying) {
                    this.pluckAncientString(freq, 2.0, 'triangle');
                }
            }, idx * 300);
        });

        setTimeout(() => {
            if (this.bgMusicPlaying) {
                this.playAncientFlute(440, 4.0);
            }
        }, 1600);
    }

    stopAtmosphere() {
        this.bgMusicPlaying = false;
        if (this.bgMusicTimer) clearTimeout(this.bgMusicTimer);
    }

    pluckAncientString(freq, duration = 2.0, waveType = 'triangle') {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, now);
        
        // Léger vibrato
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 4.5;
        lfoGain.gain.value = 1.5;
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + duration);

        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + duration);
    }

    playAncientFlute(freq, duration = 3.5) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + duration);

        filter.type = 'lowpass';
        filter.frequency.value = 1400;

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09, now + duration * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + duration);
    }

    // ==========================================
    // SOUNDSCAPES D'AMBIANCE CONTINUS (BRUITS DE FOND)
    // ==========================================
    updateSceneAmbience(bgImage) {
        this.init();
        if (this.currentSceneBg === bgImage) return;
        this.currentSceneBg = bgImage;
        this.stopSceneAmbience();

        if (!bgImage || this.isMuted) return;

        if (bgImage.includes("scene_babylon_market")) {
            this.startMarketAmbience();
        } else if (bgImage.includes("scene_mesopotamia_river") || bgImage.includes("scene_egypt_nile")) {
            this.startWaterAmbience();
        } else if (bgImage.includes("scene_ziggurat_ur")) {
            this.startTempleWindAmbience();
        }
    }

    stopSceneAmbience() {
        if (this.ambientSource) {
            try { this.ambientSource.stop(); } catch (e) {}
            this.ambientSource = null;
        }
    }

    startMarketAmbience() {
        if (!this.ctx || this.isMuted) return;
        const bufferSize = this.ctx.sampleRate * 2.0;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.08;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 550;
        filter.Q.value = 2.0;

        noise.connect(filter);
        filter.connect(this.ambientGain);
        noise.start();
        this.ambientSource = noise;
    }

    startWaterAmbience() {
        if (!this.ctx || this.isMuted) return;
        const bufferSize = this.ctx.sampleRate * 2.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;

        noise.connect(filter);
        filter.connect(this.ambientGain);
        noise.start();
        this.ambientSource = noise;
    }

    startTempleWindAmbience() {
        if (!this.ctx || this.isMuted) return;
        const bufferSize = this.ctx.sampleRate * 3.0;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.06;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2200;
        filter.Q.value = 4.0;

        noise.connect(filter);
        filter.connect(this.ambientGain);
        noise.start();
        this.ambientSource = noise;
    }

    // ==========================================
    // EFFETS SONORES HISTORIQUES & INTERACTION
    // ==========================================

    /** Son de gain de jauge (Ping cristallin ascendant) */
    playStatGain() {
        this.init(); this.resume();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.18);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    /** Son de perte de jauge (Son sourd descendant) */
    playStatLoss() {
        this.init(); this.resume();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    /** Son de burin gravant la stèle de pierre (Code d'Hammourabi) */
    playChisel() {
        this.init(); this.resume();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2800, now);
        filter.Q.value = 8.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
    }

    /** Son d'impression du roseau/calame dans l'argile fraîche */
    playClay() {
        this.init(); this.resume();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    /** Micro-bruitage feutré d'écriture / calame sur parchemin pour le typewriter */
    playParchmentTypewriter() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.035);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.12;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400 + Math.random() * 400, now);
        filter.Q.value = 3.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.035);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
    }

    /** Bruissement de parchemin ou rouleau de papyrus */
    playPapyrus() {
        this.init(); this.resume();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.25;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
    }

    /** Son des flots du Nil et canaux d'irrigation */
    playWater() {
        this.init(); this.resume();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.6;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.linearRampToValueAtTime(700, now + 0.4);
        filter.Q.value = 3.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
    }

    /** Troc et pièces marchandes */
    playCoins() {
        this.init(); this.resume();
        if (this.isMuted) return;
        const freqs = [1800, 2400, 3200];
        freqs.forEach((f, i) => {
            setTimeout(() => {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, now);

                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

                osc.connect(gain);
                gain.connect(this.sfxGain);

                osc.start(now);
                osc.stop(now + 0.2);
            }, i * 60);
        });
    }

    /** Clic de choix dans le dialogue */
    playChoice() {
        this.init(); this.resume();
        if (this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    /** Réussite d'une énigme / validation avec fanfare orientale et réverbération */
    playSuccess() {
        this.init(); this.resume();
        if (this.isMuted) return;
        // Do phrygien → Mi bémol → Sol → Do octave → Ré aigu
        const notes = [261.63, 311.13, 392.00, 523.25, 587.33];
        notes.forEach((f, idx) => {
            setTimeout(() => {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now);
                gain.gain.setValueAtTime(0.28, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
                osc.connect(gain);
                gain.connect(this.sfxGain);
                osc.start(now);
                osc.stop(now + 0.55);
            }, idx * 110);
        });
    }

    /** Fanfare royale de fin de chapitre */
    playFanfare() {
        this.init(); this.resume();
        if (this.isMuted) return;
        const chords = [
            { f: [261.63, 329.63, 392.00], d: 0.3, delay: 0 },
            { f: [261.63, 329.63, 392.00], d: 0.3, delay: 250 },
            { f: [349.23, 440.00, 523.25], d: 0.5, delay: 500 },
            { f: [392.00, 493.88, 587.33, 783.99], d: 1.2, delay: 850 }
        ];

        chords.forEach(chord => {
            setTimeout(() => {
                const now = this.ctx.currentTime;
                chord.f.forEach(freq => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, now);

                    const filter = this.ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.value = 1500;

                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + chord.d);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.sfxGain);

                    osc.start(now);
                    osc.stop(now + chord.d);
                });
            }, chord.delay);
        });
    }
}

window.soundEngine = new AncientSoundEngine();
