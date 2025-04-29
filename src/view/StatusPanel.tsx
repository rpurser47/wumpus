// StatusPanel.tsx
// View: Status display for arrows, room, etc.
import React from 'react';

interface StatusPanelProps {
  arrows: number;
  playerRoom: number;
  gameOver: boolean;
  win: boolean;
  shootMode: boolean;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ arrows, playerRoom, gameOver, win, shootMode }) => (
  <div className="status-panel">
    <div>Room: <b>{playerRoom + 1}</b></div>
    <div>Arrows left: <b>{arrows}</b></div>
    <div>Mode: <b>{shootMode ? 'Shooting' : 'Moving'}</b></div>
    {gameOver && (
      <div className={win ? 'win-msg' : 'lose-msg'}>
        {win ? 'You have slain the Wumpus!' : 'Game Over!'}
      </div>
    )}
  </div>
);

export default StatusPanel;
