import { create } from "zustand";

export type CameraView = "left" | "center" | "right";
export type VerticalView = "standing" | "down";
export type GameState = "playing" | "won" | "lostDehydration" | "lostFear";
export type FearDeathSource = "normal" | "face";

interface BedroomGameState {
  currentView: CameraView;
  verticalView: VerticalView;
  targetRotationY: number;
  targetRotationX: number;
  isDragging: boolean;
  
  hydration: number;
  fear: number;
  fearMultiplier: number;
  fearDeathSource: FearDeathSource;
  currentTime: number;
  teddyBearUses: number;
  waterUses: number;
  gameState: GameState;
  currentNight: number;
  isEpilogue: boolean;
  
  setView: (view: CameraView) => void;
  setVerticalView: (view: VerticalView) => void;
  setTargetRotationY: (rotation: number) => void;
  setTargetRotationX: (rotation: number) => void;
  setIsDragging: (dragging: boolean) => void;
  
  updateHydration: (amount: number) => void;
  updateFear: (amount: number) => void;
  setFearMultiplier: (multiplier: number) => void;
  setFearDeathSource: (source: FearDeathSource) => void;
  updateTime: (minutes: number) => void;
  useTeddyBear: () => void;
  usWater: () => void;
  checkGameOver: () => void;
  resetGame: () => void;
  advanceNight: () => void;
  startEpilogue: () => void;
}

export const useBedroomGame = create<BedroomGameState>((set, get) => ({
  currentView: "center",
  verticalView: "standing",
  targetRotationY: 0,
  targetRotationX: 0,
  isDragging: false,
  
  hydration: 100,
  fear: 1,
  fearMultiplier: 1,
  fearDeathSource: "normal",
  currentTime: 0,
  teddyBearUses: 10,
  waterUses: 10,
  gameState: "playing",
  currentNight: 1,
  isEpilogue: false,
  
  setView: (view) => {
    const rotations: Record<CameraView, number> = {
      left: Math.PI / 3,
      center: 0,
      right: -Math.PI / 3,
    };
    set({ currentView: view, targetRotationY: rotations[view] });
  },
  
  setVerticalView: (view) => {
    const verticalRotations: Record<VerticalView, number> = {
      standing: 0,
      down: -Math.PI / 3,
    };
    set({ verticalView: view, targetRotationX: verticalRotations[view] });
  },
  
  setTargetRotationY: (rotation) => set({ targetRotationY: rotation }),
  setTargetRotationX: (rotation) => set({ targetRotationX: rotation }),
  setIsDragging: (dragging) => set({ isDragging: dragging }),
  
  updateHydration: (amount) => {
    set((state) => {
      const newHydration = Math.max(0, Math.min(100, state.hydration + amount));
      return { hydration: newHydration };
    });
    get().checkGameOver();
  },
  
  updateFear: (amount) => {
    set((state) => {
      const scaledAmount = amount * state.fearMultiplier;
      const newFear = Math.max(0, Math.min(100, state.fear + scaledAmount));
      return { fear: newFear };
    });
    get().checkGameOver();
  },

  setFearMultiplier: (multiplier) => {
    set({ fearMultiplier: multiplier });
  },

  setFearDeathSource: (source) => {
    set({ fearDeathSource: source });
  },
  
  updateTime: (minutes) => {
    set((state) => ({ currentTime: state.currentTime + minutes }));
    get().checkGameOver();
  },
  
  useTeddyBear: () => {
    const state = get();
    if (state.teddyBearUses > 0 && state.verticalView === 'down' && state.currentView === 'left') {
      set((state) => ({
        teddyBearUses: state.teddyBearUses - 1,
        fear: Math.max(0, state.fear - 25)
      }));
      console.log('Used teddy bear! Fear decreased by 25%');
    }
  },
  
  usWater: () => {
    const state = get();
    if (state.waterUses > 0 && state.verticalView === 'down' && state.currentView === 'right') {
      set((state) => ({
        waterUses: state.waterUses - 1,
        hydration: Math.min(100, state.hydration + 100)
      }));
      console.log('Drank water! Hydration increased by 100');
    }
  },

  checkGameOver: () => {
    const state = get();
    
    console.log('checkGameOver called:', {
      gameState: state.gameState,
      currentTime: state.currentTime,
      hydration: state.hydration,
      fear: state.fear,
      currentNight: state.currentNight
    });
    
    // Only check for win if game is still playing
    if (state.gameState === "playing") {
      if (state.currentTime >= 360) {
        if (state.currentNight >= 5) {
          set({ gameState: "won" });
        } else {
          set({ gameState: "won" }); // treat as night win; will advance in App
        }
      } else if (state.hydration <= 0) {
        set({ gameState: "lostDehydration" });
      } else if (state.fear >= 100) {
        set({ gameState: "lostFear" });
      }
    }
  },
  
  resetGame: () => {
    set({
      hydration: 100,
      fear: 1,
      fearMultiplier: 1,
      fearDeathSource: "normal",
      currentTime: 0,
      teddyBearUses: 10,
      waterUses: 10,
      gameState: "playing",
      currentView: "center",
      verticalView: "standing",
      targetRotationY: 0,
      targetRotationX: 0,
    });
    useFlashlight.getState().resetFlashlight();
  },

  advanceNight: () => {
    const state = get();
    set({
      currentNight: state.currentNight + 1,
      hydration: 100,
      fear: 1,
      fearMultiplier: 1,
      fearDeathSource: "normal",
      currentTime: 0,
      teddyBearUses: 10,
      waterUses: 10,
      gameState: "playing",
      currentView: "center",
      verticalView: "standing",
      targetRotationY: 0,
      targetRotationX: 0,
    });
    useFlashlight.getState().resetFlashlight();
  },

  startEpilogue: () => {
    set({ isEpilogue: true });
  }
}));

interface FlashlightState {
  isLightOn: boolean;
  hasFlashlight: boolean;
  battery: number;

  toggleLight: () => void;
  giveFlashlight: () => void;
  drainBattery: (amount: number) => void;
  resetFlashlight: () => void;
  setBattery: (amount: number) => void;
}

export const useFlashlight = create<FlashlightState>((set, get) => ({
  isLightOn: false,
  hasFlashlight: false,
  battery: 100,

  toggleLight: () => {
    const { isLightOn, battery, hasFlashlight } = get();
    if (!hasFlashlight || battery <= 0) return;
    set({ isLightOn: !isLightOn });
  },

  giveFlashlight: () => set({ hasFlashlight: true }),

  resetFlashlight: () =>
    set({
      isLightOn: false,
      hasFlashlight: false,
      battery: 100,
    }),

  setBattery: (amount: number) =>
    set((state) => ({
      battery: Math.max(0, Math.min(100, amount)),
    })),

  drainBattery: (amount) =>
    set((state) => ({
      battery: Math.max(0, state.battery - amount),
      isLightOn: state.battery - amount <= 0 ? false : state.isLightOn,
    })),
}));