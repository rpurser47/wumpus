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
  onRestart 
}) => (
  <div className="action-panel">
    <button 
      onClick={onMove} 
      disabled={!canMove}
      className={shootMode ? '' : 'active-mode'}
    >
      Move
    </button>
    <button 
      onClick={onShoot} 
      disabled={!canShoot}
      className={shootMode ? 'active-mode' : ''}
    >
      Shoot
    </button>
    <button onClick={onRestart}>Restart</button>
  </div>
);

export default ActionPanel;
