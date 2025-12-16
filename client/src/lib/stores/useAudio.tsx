import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  faceScream: HTMLAudioElement | null;
  stareSFX: HTMLAudioElement | null;
  isMuted: boolean;
  musicVolume: number;
  userHasInteracted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setFaceScream: (sound: HTMLAudioElement) => void;
  setStareSFX: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playBackgroundMusic: () => void;
  pauseBackgroundMusic: () => void;
  setMusicVolume: (volume: number) => void;
  playSuccessSound: () => void;
  playFaceScream: () => void;
  playStareSFX: () => void;
  setUserInteracted: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  successSound: null,
  faceScream: null,
  stareSFX: null,
  isMuted: false, // Start muted by default
  musicVolume: 0.5,
  userHasInteracted: false,
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setFaceScream: (sound) => set({ faceScream: sound }),
  setStareSFX: (sound) => set({ stareSFX: sound }),
  
  setUserInteracted: () => set({ userHasInteracted: true }),
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    set({ isMuted: newMutedState });
    
    // Apply mute state to background music
    if (backgroundMusic) {
      backgroundMusic.muted = newMutedState;
    }
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playBackgroundMusic: () => {
    const { backgroundMusic, isMuted, musicVolume, userHasInteracted } = get();
    console.log("playBackgroundMusic called:", { backgroundMusic: !!backgroundMusic, isMuted, musicVolume, userHasInteracted });
    
    if (backgroundMusic) {
      backgroundMusic.volume = musicVolume;
      backgroundMusic.muted = isMuted;
      backgroundMusic.loop = true;
      
      // Only try to play if user has interacted
      if (userHasInteracted) {
        backgroundMusic.play().then(() => {
          console.log("Background music started successfully");
        }).catch(error => {
          console.error("Background music play prevented:", error);
          console.error("Audio element state:", {
            paused: backgroundMusic.paused,
            readyState: backgroundMusic.readyState,
            currentTime: backgroundMusic.currentTime,
            duration: backgroundMusic.duration
          });
        });
      } else {
        console.log("User hasn't interacted yet, deferring music playback");
      }
    } else {
      console.warn("No background music element found");
    }
  },
  
  pauseBackgroundMusic: () => {
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.pause();
    }
  },
  
  setMusicVolume: (volume) => {
    const { backgroundMusic } = get();
    set({ musicVolume: volume });
    if (backgroundMusic) {
      backgroundMusic.volume = volume;
    }
  },
  
  playSuccessSound: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.volume = 0.7;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playFaceScream: () => {
    const { faceScream, isMuted } = get();
    if (faceScream) {
      if (isMuted) {
        console.log("Face scream skipped (muted)");
        return;
      }
      
      // Reset and play the original audio element
      faceScream.currentTime = 0;
      faceScream.volume = 0.8;
      faceScream.play().catch(error => {
        console.log("Face scream play prevented:", error);
      });
    }
  },
  
  playStareSFX: () => {
    const { stareSFX, isMuted } = get();
    if (stareSFX) {
      if (isMuted) {
        console.log("Stare SFX skipped (muted)");
        return;
      }
      
      // Reset and play the original audio element
      stareSFX.currentTime = 0;
      stareSFX.volume = 0.6;
      stareSFX.play().catch(error => {
        console.log("Stare SFX play prevented:", error);
      });
    }
  }
}));
