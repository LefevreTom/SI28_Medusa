// audioManager.js - Global audio manager for your game
// Place this file in your root directory and include it on every page

const AudioManager = {
    music: null,
    sfxVolume: 0.7,
    musicVolume: 0.5,
    isMusicMuted: false,
    isSfxMuted: false,
    
    // Initialize audio system
    init() {
        // Load saved audio state from localStorage
        const savedState = localStorage.getItem('audioState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.musicVolume = state.musicVolume || 0.5;
            this.sfxVolume = state.sfxVolume || 0.7;
            this.isMusicMuted = state.isMusicMuted || false;
            this.isSfxMuted = state.isSfxMuted || false;
        }
        
        // Resume music if there was one playing
        const savedMusic = localStorage.getItem('currentMusic');
        if (savedMusic) {
            const musicData = JSON.parse(savedMusic);
            this.loadMusic("../../assets/audio/music/" + musicData.src, musicData.loop);
            
            // Restore playback position
            if (musicData.currentTime && this.music) {
                this.music.currentTime = musicData.currentTime;
                if (musicData.isPlaying && !this.isMusicMuted) {
                    this.music.play().catch(e => console.log('Autoplay prevented:', e));
                }
            }
        }
        
        // Save music state before page unload
        window.addEventListener('beforeunload', () => {
            this.saveCurrentMusicState();
        });
    },
    
    // Load and setup background music
    loadMusic(src, loop = true) {
        // Check if music is already loaded
        if (this.music && this.music.src.endsWith(src)) {
            return; // Same music already loaded
        }
        
        // Clean up old music
        if (this.music) {
            this.music.pause();
            this.music = null;
        }
        
        // Create new audio element
        this.music = new Audio(src);
        this.music.loop = loop;
        this.music.volume = this.isMusicMuted ? 0 : this.musicVolume;
        
        // Auto-play when loaded (if not muted)
        this.music.addEventListener('canplaythrough', () => {
            if (!this.isMusicMuted) {
                this.music.play().catch(e => console.log('Autoplay prevented:', e));
            }
        }, { once: true });
        
        return this.music;
    },
    
    // Play music (or resume if paused)
    playMusic() {
        if (this.music) {
            this.music.volume = this.musicVolume;
            this.isMusicMuted = false;
            this.music.play().catch(e => console.log('Play failed:', e));
            this.saveAudioState();
        }
    },
    
    // Pause music (preserves position)
    pauseMusic() {
        if (this.music) {
            this.music.pause();
            this.saveCurrentMusicState();
        }
    },
    
    // Mute/unmute music (doesn't stop playback)
    toggleMuteMusic() {
        this.isMusicMuted = !this.isMusicMuted;
        if (this.music) {
            this.music.volume = this.isMusicMuted ? 0 : this.musicVolume;
        }
        this.saveAudioState();
        return this.isMusicMuted;
    },
    
    // Set music volume (0.0 to 1.0)
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.music && !this.isMusicMuted) {
            this.music.volume = this.musicVolume;
        }
        this.saveAudioState();
    },
    
    // Play sound effect (creates new Audio object each time)
    playSfx(src, volume = null) {
        if (this.isSfxMuted) return;
        
        const sfx = new Audio(src);
        sfx.volume = volume !== null ? volume : this.sfxVolume;
        sfx.play().catch(e => console.log('SFX play failed:', e));
        
        return sfx;
    },
    
    // Toggle SFX mute
    toggleMuteSfx() {
        this.isSfxMuted = !this.isSfxMuted;
        this.saveAudioState();
        return this.isSfxMuted;
    },
    
    // Set SFX volume (0.0 to 1.0)
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveAudioState();
    },
    
    // Save current music state to localStorage
    saveCurrentMusicState() {
        if (this.music) {
            const musicData = {
                src: this.music.src.split('/').pop(), // Get filename
                currentTime: this.music.currentTime,
                isPlaying: !this.music.paused,
                loop: this.music.loop
            };
            localStorage.setItem('currentMusic', JSON.stringify(musicData));
        }
    },
    
    // Save audio preferences
    saveAudioState() {
        const state = {
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            isMusicMuted: this.isMusicMuted,
            isSfxMuted: this.isSfxMuted
        };
        localStorage.setItem('audioState', JSON.stringify(state));
    },
    
    // Get current music time (for debugging or UI)
    getCurrentMusicTime() {
        return this.music ? this.music.currentTime : 0;
    },
    
    // Set music to specific time
    setMusicTime(time) {
        if (this.music) {
            this.music.currentTime = time;
        }
    },
    
    // Crossfade to a new track with optional timestamp preservation
    crossFade(newSrc, duration = 2000, preserveTime = false) {
        return new Promise((resolve) => {
            const oldMusic = this.music;
            const startTime = preserveTime && oldMusic ? oldMusic.currentTime : 0;
            const oldVolume = oldMusic ? oldMusic.volume : 0;
            const targetVolume = this.isMusicMuted ? 0 : this.musicVolume;
            
            // Create new music element
            const newMusic = new Audio(newSrc);
            newMusic.loop = this.music.loop;
            newMusic.volume = 0; // Start at 0 for fade in
            
            // Set timestamp if preserving
            if (preserveTime && startTime > 0) {
                newMusic.currentTime = startTime;
            }
            
            // Wait for new track to be ready
            newMusic.addEventListener('canplaythrough', () => {
                // Start playing new track
                newMusic.play().catch(e => console.log('Crossfade play failed:', e));
                
                const steps = 60; // 60 steps for smooth fade
                const stepDuration = duration / steps;
                let currentStep = 0;
                
                const fadeInterval = setInterval(() => {
                    currentStep++;
                    const progress = currentStep / steps;
                    
                    // Fade out old track
                    if (oldMusic) {
                        oldMusic.volume = oldVolume * (1 - progress);
                    }
                    
                    // Fade in new track
                    newMusic.volume = targetVolume * progress;
                    
                    // Cleanup when done
                    if (currentStep >= steps) {
                        clearInterval(fadeInterval);
                        
                        // Stop and remove old music
                        if (oldMusic) {
                            oldMusic.pause();
                            oldMusic.currentTime = 0;
                        }
                        
                        // Set new music as current
                        this.music = newMusic;
                        this.saveCurrentMusicState();
                        
                        resolve();
                    }
                }, stepDuration);
            }, { once: true });
        });
    },
    
    // Fade out current music
    fadeOut(duration = 2000) {
        return new Promise((resolve) => {
            if (!this.music) {
                resolve();
                return;
            }
            
            const startVolume = this.music.volume;
            const steps = 60;
            const stepDuration = duration / steps;
            let currentStep = 0;
            
            const fadeInterval = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;
                
                this.music.volume = startVolume * (1 - progress);
                
                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    this.music.pause();
                    this.music.currentTime = 0;
                    resolve();
                }
            }, stepDuration);
        });
    },
    
    // Fade in current music
    fadeIn(duration = 2000) {
        return new Promise((resolve) => {
            if (!this.music) {
                resolve();
                return;
            }
            
            const targetVolume = this.isMusicMuted ? 0 : this.musicVolume;
            this.music.volume = 0;
            this.music.play().catch(e => console.log('Fade in failed:', e));
            
            const steps = 60;
            const stepDuration = duration / steps;
            let currentStep = 0;
            
            const fadeInterval = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;
                
                this.music.volume = targetVolume * progress;
                
                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, stepDuration);
        });
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AudioManager.init());
} else {
    AudioManager.init();
}