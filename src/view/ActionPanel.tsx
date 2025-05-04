// ActionPanel.tsx
// View: Action buttons for movement and shooting
import React from 'react';

interface ActionPanelProps {
  canMove: boolean;
  canShoot: boolean;
  shootMode: boolean;
  onMove: () => void;
  onShoot: () => void;
  onRestart: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  canMove,
  canShoot,
  shootMode,
  onMove,
  onShoot,
  onRestart,
}) => (
  <div className="action-panel" data-testid="action-panel">
    <button
      onClick={onMove}
      disabled={!canMove}
      className={shootMode ? '' : 'active-mode'}
      data-testid="move-button"
    >
      Move
    </button>
    <button
      onClick={onShoot}
      disabled={!canShoot}
      className={shootMode ? 'active-mode' : ''}
      data-testid="shoot-button"
    >
      Shoot
    </button>
    <button onClick={onRestart} data-testid="restart-button">
      Restart
    </button>
  </div>
);

export default ActionPanel;
