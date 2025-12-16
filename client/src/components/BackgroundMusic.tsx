import { useEffect, useRef } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useBedroomGame } from "@/lib/stores/useBedroomGame";

export function BackgroundMusic() {
  const {
    playBackgroundMusic,
    pauseBackgroundMusic,
    playSuccessSound
  } = useAudio();
  
  const { gameState } = useBedroomGame();
  const { userHasInteracted } = useAudio();
  const audioInitialized = useRef(false);

  console.log("BackgroundMusic component rendered, gameState:", gameState, "userHasInteracted:", userHasInteracted);

  useEffect(() => {
    // Initialize audio files only once
    if (!audioInitialized.current) {
      console.log("Initializing audio files...");
      
      // Try to load background music
      const bgMusic = new Audio("/sounds/background.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.5;
      
      // Add error handling
      bgMusic.addEventListener('error', (e) => {
        console.error("Error loading background music:", e);
        console.error("Audio path attempted:", "/sounds/background.mp3");
        console.log("Trying to create a test tone instead...");
        
        // Create a simple test tone as fallback
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 440; // A4 note
          gainNode.gain.value = 0.1;
          
          console.log("Test tone created as fallback");
        } catch (err) {
          console.error("Could not create test tone:", err);
        }
      });
      
      bgMusic.addEventListener('load', () => {
        console.log("Background music loaded successfully");
      });
      
      useAudio.getState().setBackgroundMusic(bgMusic);

      // Load success sound
      const successSound = new Audio("/sounds/success.mp3");
      
      // Add error handling
      successSound.addEventListener('error', (e) => {
        console.error("Error loading success sound:", e);
        console.error("Audio path attempted:", "/sounds/success.mp3");
      });
      
      successSound.addEventListener('load', () => {
        console.log("Success sound loaded successfully");
      });
      
      useAudio.getState().setSuccessSound(successSound);

      // Load face scream using fetch
      fetch("/sounds/Facescream.mp3?t=" + Date.now())
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          const faceScream = new Audio(URL.createObjectURL(blob));
          faceScream.volume = 0.8;
          console.log("Face scream loaded successfully via fetch");
          useAudio.getState().setFaceScream(faceScream);
        })
        .catch(error => {
          console.error("Error loading face scream via fetch:", error);
          console.error("Fetch path attempted:", "/sounds/Facescream.mp3?t=" + Date.now());
        });

      // Load stare SFX using fetch
      fetch("/sounds/Starescream.mp3?t=" + Date.now())
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          const stareSFX = new Audio(URL.createObjectURL(blob));
          stareSFX.volume = 0.6;
          console.log("Stare SFX loaded successfully via fetch");
          useAudio.getState().setStareSFX(stareSFX);
        })
        .catch(error => {
          console.error("Error loading stare SFX via fetch:", error);
          console.error("Fetch path attempted:", "/sounds/Starescream.mp3?t=" + Date.now());
        });

      audioInitialized.current = true;
      console.log("Audio initialization complete");
    }
  }, []);

  useEffect(() => {
    console.log("BackgroundMusic: gameState changed to:", gameState);
    
    // Handle music based on game state
    if (gameState === "won") {
      // Pause background music and play success sound on win
      console.log("BackgroundMusic: Playing success sound, pausing background music");
      pauseBackgroundMusic();
      playSuccessSound();
    } else if (gameState === "playing") {
      // Play background music during gameplay
      console.log("BackgroundMusic: Attempting to play background music");
      playBackgroundMusic();
      
      // Retry playing music after a short delay in case user interaction wasn't registered yet
      const retryTimer = setTimeout(() => {
        console.log("BackgroundMusic: Retrying music playback...");
        playBackgroundMusic();
      }, 1000);
      
      return () => clearTimeout(retryTimer);
    } else {
      // Pause music during other states
      console.log("BackgroundMusic: Pausing music for state:", gameState);
      pauseBackgroundMusic();
    }
  }, [gameState, playBackgroundMusic, pauseBackgroundMusic, playSuccessSound]);

  // Watch for user interaction changes and retry music if needed
  useEffect(() => {
    console.log("BackgroundMusic: userHasInteracted changed to:", userHasInteracted);
    
    // If user just interacted and we're in playing state, try to play music
    if (userHasInteracted && gameState === "playing") {
      console.log("BackgroundMusic: User interaction detected, attempting to play music");
      playBackgroundMusic();
    }
  }, [userHasInteracted, gameState, playBackgroundMusic]);

  // Add a separate effect to handle initial music start when conditions are met
  useEffect(() => {
    if (userHasInteracted && gameState === "playing" && audioInitialized.current) {
      console.log("BackgroundMusic: Conditions met, starting music");
      playBackgroundMusic();
    }
  }, [userHasInteracted, gameState, playBackgroundMusic]);

  return null; // This component doesn't render anything
}
