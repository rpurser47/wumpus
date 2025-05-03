"use client";

// App.tsx
// Controller: Main game state and logic
import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import Image from 'next/image';

import { GameModel, GameState } from './model/GameModel';
import ActionPanel from './view/ActionPanel';
import CaveMap from './view/CaveMap';
import MessageLog from './view/MessageLog';
import StatusPanel from './view/StatusPanel';

function App() {
  // Game model instance
  const gameModelRef = useRef<GameModel>(new GameModel());
  
  // State derived from game model
  const [gameState, setGameState] = useState<GameState>(gameModelRef.current.getState());
  
  // Audio references
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const shootSound = useRef<HTMLAudioElement | null>(null);
  const batSound = useRef<HTMLAudioElement | null>(null);
  const pitSound = useRef<HTMLAudioElement | null>(null);
  const wumpusSound = useRef<HTMLAudioElement | null>(null);
  const wumpusDiesSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    moveSound.current = new Audio('/sounds/move.wav');
    shootSound.current = new Audio('/sounds/shoot.wav');
    batSound.current = new Audio('/sounds/bat.wav');
    pitSound.current = new Audio('/sounds/pit.wav');
    wumpusSound.current = new Audio('/sounds/wumpus_eats.wav');
    wumpusDiesSound.current = new Audio('/sounds/wumpus_dies.wav');
    winSound.current = new Audio('/sounds/win.mp3'); // Changed to MP3 for better quality
    loseSound.current = new Audio('/sounds/lose.wav');
    
    // Preload sounds
    const sounds = [moveSound, shootSound, batSound, pitSound, wumpusSound, wumpusDiesSound, winSound, loseSound];
    sounds.forEach(sound => {
      if (sound.current) {
        sound.current.load();
      }
    });
  }, []);
  
  // Play a sound with error handling and 3-second limit
  const playSound = (sound: React.RefObject<HTMLAudioElement>) => {
    if (sound.current) {
      // Reset playback position
      sound.current.currentTime = 0;
      
      // Play the sound
      sound.current.play().catch(e => console.log('Error playing sound:', e));
      
      // Set a timeout to stop the sound after 3 seconds
      setTimeout(() => {
        if (sound.current && !sound.current.paused) {
          sound.current.pause();
          sound.current.currentTime = 0;
        }
      }, 3000);
    }
  };
  
  // Handle room click for movement or shooting
  const handleRoomClick = (roomId: number) => {
    console.log(`Room ${roomId + 1} clicked`);
    const model = gameModelRef.current;
    const state = model.getState();
    
    if (state.shootMode) {
      console.log(`Shooting at room ${roomId + 1}`);
      // Handle shooting
      if (model.isValidShootTarget(roomId)) {
        model.shootArrow(roomId); // Removed unused messages variable
        playSound(shootSound);
        
        // Check for win/lose conditions after shooting
        const newState = model.getState();
        if (newState.gameOver) {
          if (newState.win) {
            // Play wumpus_dies sound first, then win sound after a short delay
            playSound(wumpusDiesSound);
            setTimeout(() => {
              playSound(winSound);
            }, 1500); // 1.5 second delay
          } else {
            playSound(loseSound);
          }
        }
        
        setGameState({...model.getState()});
      }
    } else {
      console.log(`Moving to room ${roomId + 1}`);
      // Handle movement
      if (model.isValidMove(roomId)) {
        model.movePlayer(roomId); // Removed unused messages variable
        playSound(moveSound);
        
        // Check for hazards based on message log
        const newState = model.getState();
        const messageLog = newState.messageLog;
        const recentMessages = messageLog.slice(-3); // Get the most recent messages
        
        if (newState.gameOver) {
          if (recentMessages.some(msg => msg.includes('pit'))) {
            playSound(pitSound);
          } else if (recentMessages.some(msg => msg.includes('Wumpus'))) {
            playSound(wumpusSound);
          }
          playSound(loseSound);
        } else if (recentMessages.some(msg => msg.includes('bats'))) {
          playSound(batSound);
        }
        
        setGameState({...model.getState()});
      }
    }
  };
  
  // Enter move mode
  const handleMove = () => {
    const model = gameModelRef.current;
    if (model.getState().shootMode) {
      model.exitShootMode();
      setGameState(model.getState());
    }
  };
  
  // Enter shoot mode
  const handleShoot = () => {
    const model = gameModelRef.current;
    model.enterShootMode(); // Removed unused messages variable
    setGameState(model.getState());
  };
  
  // Restart the game
  const handleRestart = () => {
    const model = gameModelRef.current;
    model.resetGame();
    setGameState(model.getState());
  };
  
  // Get window dimensions for confetti
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0
  });

  // Initialize window dimensions after component mounts (client-side only)
  useEffect(() => {
    // Update dimensions initially
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Update window dimensions when the window is resized
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="App" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px 0'
    }}>
      {/* Background image with Next.js Image component */}
      <div style={{
        position: 'fixed',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        zIndex: -1,
        top: 0,
        left: 0
      }}>
        <Image
          src="/cave-bg.jpg"
          alt="Cave background"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
          priority
        />
      </div>
      {/* Show confetti when the player wins */}
      {gameState.win && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722']}
        />
      )}
      <h1 className="game-title">Hunt the Wumpus</h1>
      
      <div style={{ display: 'flex', gap: '20px', maxWidth: '900px' }}>
        {/* Game map on the left */}
        <div style={{ position: 'relative', width: 520, height: 520, background: 'rgba(255,255,255,0.85)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
          <CaveMap 
            rooms={gameState.rooms} 
            playerRoom={gameState.player.room} 
            shootMode={gameState.shootMode}
            onRoomClick={handleRoomClick} 
          />
        </div>
        
        {/* Controls and info on the right */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
          <StatusPanel 
            arrows={gameState.player.arrows} 
            playerRoom={gameState.player.room} 
            gameOver={gameState.gameOver} 
            win={gameState.win} 
            shootMode={gameState.shootMode}
          />
          <ActionPanel 
            canMove={!gameState.gameOver} 
            canShoot={!gameState.gameOver && gameState.player.arrows > 0} 
            shootMode={gameState.shootMode}
            onMove={handleMove} 
            onShoot={handleShoot} 
            onRestart={handleRestart} 
          />
          <MessageLog messages={gameState.messageLog} />
        </div>
      </div>
    </div>
  );
}

export default App;
