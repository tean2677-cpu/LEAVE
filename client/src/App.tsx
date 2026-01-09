import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import { CameraController } from "./components/CameraController";
import { CenterWall, LeftWall, RightWall, Floor, Bed } from "./components/Walls";
import { GameUI } from "./components/GameUI";
import { GameTimer } from "./components/GameTimer";
import { GameOverScreen } from "./components/GameOverScreen";
import { FlashlightBeamWithCamera } from "./components/FlashlightBeam";
import { BatteryUI } from "./components/Battery UI";
import { FlashlightBatteryController } from "./components/FlashlightBatteryController";
import { FaceSpawner } from './components/FaceSpawner';
import { StareSpawner } from "./components/StareSpawner";
import {MainMenu} from './components/Mainmenu'
import { Diary } from "./components/Diary";
import { BackgroundMusic } from "./components/BackgroundMusic";
import { BatteryRegenerator } from "@/components/BatteryRegenerator";
import { useState, useEffect } from "react";
import { useBedroomGame } from "./lib/stores/useBedroomGame";

enum Controls {
  lookLeft = "lookLeft",
  lookCenter = "lookCenter",
  lookRight = "lookRight",
  lookDown = "lookDown",
  useItem = "useItem",
}

function App() {
   const [gameStarted, setGameStarted] = useState(false);
  const [showDiary, setShowDiary] = useState(false);
  const [showSurvivedScreen, setShowSurvivedScreen] = useState(false);
  const { gameState, currentNight, isEpilogue } = useBedroomGame();
  const advanceNight = useBedroomGame((state) => state.advanceNight);
  const startEpilogue = useBedroomGame((state) => state.startEpilogue);

  console.log('App render state:', `gameStarted: ${gameStarted}, showDiary: ${showDiary}, gameState: ${gameState}, currentNight: ${currentNight}, isEpilogue: ${isEpilogue}`);

  const keyMap = [
    { name: Controls.lookLeft, keys: ["KeyA"] },
    { name: Controls.lookCenter, keys: ["KeyS"] },
    { name: Controls.lookRight, keys: ["KeyD"] },
    { name: Controls.lookDown, keys: ["KeyW"] },
    { name: Controls.useItem, keys: ["KeyE"] },
  ];

  // Handle Enter key for "You Survived The Night" and "You Won!" screens
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && gameState === "won" && currentNight < 5 && !showDiary) {
        advanceNight();
        setShowDiary(true);
      } else if (e.key === "Enter" && gameState === "won" && currentNight >= 5 && !isEpilogue) {
        startEpilogue();
        setShowDiary(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, currentNight, showDiary, isEpilogue, advanceNight, startEpilogue]);

    const handleStart = () => {
    console.log('App handleStart called');
    console.log('Setting showDiary to true...');
    setShowDiary(true);
    console.log('Resetting game...');
    useBedroomGame.getState().resetGame();
    console.log('Game reset, showing diary');
  };

  // Show diary if it's supposed to be shown
  if (showDiary) {
    console.log('Rendering Diary component...');
    return (
      <>
        <BackgroundMusic />
        <Diary
          onComplete={() => {
            console.log('Diary onComplete called');
            if (isEpilogue) {
              // After epilogue, reset the game completely
              setShowDiary(false);
              setGameStarted(false);
              useBedroomGame.getState().resetGame();
            } else {
              setShowDiary(false);
              setGameStarted(true);
            }
          }}
        />
      </>
    );
  }

  // Show main menu only before the game starts. Game over is handled by <GameOverScreen />.
  if (!gameStarted) {
    return (
      <>
        <BackgroundMusic />
        <MainMenu onStart={handleStart} />
      </>
    );
  }

  // Night completed: show next diary or end game after Night 5
  if (gameState === "won") {
    if (currentNight >= 5) {
      // Game completed after Night 5 - show "You Won!" screen
      return (
        <>
          <BackgroundMusic />
          <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-4xl font-bold">
            You Won!
            <div className="absolute bottom-10 text-xl animate-pulse">
              Don't Press Enter
            </div>
          </div>
        </>
      );
    }
    // Show "You Survived The Night" then advance to next night's diary
    return (
      <>
        <BackgroundMusic />
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-4xl font-bold">
          You Survived The Night!
          <div className="absolute bottom-10 text-xl animate-pulse">
            Press Enter to continue...
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <BackgroundMusic />
      <KeyboardControls map={keyMap}>
      <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
        <Canvas
          camera={{
            position: [0, 0, 0],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            powerPreference: "default",
          }}
        >
          <color attach="background" args={["#0a0a0a"]} />
          <fog attach="fog" args={["#0a0a0a", 1.5, 10]} />

          <ambientLight intensity={0.15} />
          <directionalLight position={[0, 5, 2]} intensity={0.8} />
          <pointLight position={[0, 2, 0]} intensity={0.7} color="#fff8dc" />

          <Suspense fallback={null}>
            <CenterWall />
            <LeftWall />
            <RightWall />
            <Floor />
            <Bed />
          </Suspense>

          <CameraController />
          <FlashlightBeamWithCamera />
          <FlashlightBatteryController />
          <BatteryRegenerator />
          <FaceSpawner />
          <StareSpawner />
        </Canvas>

        <GameUI />
        <GameTimer />
        <GameOverScreen />
        <BatteryUI />
      </div>
    </KeyboardControls>
    </>
  );
}

export { Controls };

export default App;
