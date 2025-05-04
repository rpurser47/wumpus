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

const StatusPanel: React.FC<StatusPanelProps> = ({
  arrows,
  playerRoom,
  gameOver,
  win,
  shootMode,
}) => (
  <div className="status-panel" data-testid="status-panel">
    <div data-testid="room-display">
      Room: <b>{playerRoom + 1}</b>
    </div>
    <div data-testid="arrows-display">
      Arrows left: <b>{arrows}</b>
    </div>
    <div data-testid="mode-display">
      Mode: <b>{shootMode ? 'Shooting' : 'Moving'}</b>
    </div>
    {gameOver && (
      <div
        className={win ? 'win-msg' : 'lose-msg'}
        data-testid={win ? 'win-message' : 'game-over-message'}
      >
        {win ? 'You have slain the Wumpus!' : 'Game Over!'}
      </div>
    )}
  </div>
);

export default StatusPanel;
