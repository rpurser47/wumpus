// App.tsx
// Controller: Main game state and logic
import React, { useState, useEffect, useRef } from 'react';
import { caveLayout, Room, Hazard, GameModel, GameState } from './model/GameModel';
import CaveMap from './view/CaveMap';
import StatusPanel from './view/StatusPanel';
import ActionPanel from './view/ActionPanel';
import MessageLog from './view/MessageLog';
import './styles/theme.css';

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
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    moveSound.current = new Audio('./sounds/move.wav');
    shootSound.current = new Audio('./sounds/shoot.wav');
    batSound.current = new Audio('./sounds/bat.wav');
    pitSound.current = new Audio('./sounds/pit.wav');
    wumpusSound.current = new Audio('./sounds/wumpus.wav');
    winSound.current = new Audio('./sounds/win.wav');
    loseSound.current = new Audio('./sounds/lose.wav');
    
    // Preload sounds
    const sounds = [moveSound, shootSound, batSound, pitSound, wumpusSound, winSound, loseSound];
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
        const messages = model.shootArrow(roomId);
        playSound(shootSound);
        
        // Check for win/lose conditions after shooting
        const newState = model.getState();
        if (newState.gameOver) {
          if (newState.win) {
            playSound(winSound);
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
        const messages = model.movePlayer(roomId);
        playSound(moveSound);
        
        // Check for hazards based on messages
        const newState = model.getState();
        if (newState.gameOver) {
          if (messages.some(msg => msg.includes('pit'))) {
            playSound(pitSound);
          } else if (messages.some(msg => msg.includes('Wumpus'))) {
            playSound(wumpusSound);
          }
          playSound(loseSound);
        } else if (messages.some(msg => msg.includes('bats'))) {
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
    const messages = model.enterShootMode();
    setGameState(model.getState());
  };
  
  // Restart the game
  const handleRestart = () => {
    const model = gameModelRef.current;
    model.resetGame();
    setGameState(model.getState());
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px auto' }}>
      <h1 style={{ marginBottom: '20px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Hunt the Wumpus</h1>
      
      <div style={{ display: 'flex', gap: '20px', maxWidth: '900px' }}>
        {/* Game map on the left */}
        <div style={{ position: 'relative', width: 520, height: 520, background: 'rgba(255,255,255,0.5)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
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
