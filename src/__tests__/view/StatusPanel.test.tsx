import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import StatusPanel from '../../view/StatusPanel';

describe('StatusPanel', () => {
  test('renders player room number', () => {
    render(
      <StatusPanel arrows={5} playerRoom={3} gameOver={false} win={false} shootMode={false} />
    );

    // Room number should be displayed as human-readable (1-indexed)
    const roomDisplay = screen.getByTestId('room-display');
    expect(roomDisplay).toHaveTextContent('Room: 4');
  });

  test('renders arrow count', () => {
    render(
      <StatusPanel arrows={3} playerRoom={0} gameOver={false} win={false} shootMode={false} />
    );

    const arrowsDisplay = screen.getByTestId('arrows-display');
    expect(arrowsDisplay).toHaveTextContent('Arrows left: 3');
  });

  test('displays moving mode when not in shoot mode', () => {
    render(
      <StatusPanel arrows={5} playerRoom={0} gameOver={false} win={false} shootMode={false} />
    );

    const modeDisplay = screen.getByTestId('mode-display');
    expect(modeDisplay).toHaveTextContent('Mode: Moving');
  });

  test('displays shooting mode when in shoot mode', () => {
    render(<StatusPanel arrows={5} playerRoom={0} gameOver={false} win={false} shootMode={true} />);

    const modeDisplay = screen.getByTestId('mode-display');
    expect(modeDisplay).toHaveTextContent('Mode: Shooting');
  });

  test('displays win message when game is over and player won', () => {
    render(<StatusPanel arrows={5} playerRoom={0} gameOver={true} win={true} shootMode={false} />);

    const winMessage = screen.getByTestId('win-message');
    expect(winMessage).toHaveTextContent('You have slain the Wumpus!');
  });

  test('displays game over message when game is over and player lost', () => {
    render(<StatusPanel arrows={5} playerRoom={0} gameOver={true} win={false} shootMode={false} />);

    const gameOverMessage = screen.getByTestId('game-over-message');
    expect(gameOverMessage).toHaveTextContent('Game Over!');
  });

  test('does not display game over message when game is not over', () => {
    render(
      <StatusPanel arrows={5} playerRoom={0} gameOver={false} win={false} shootMode={false} />
    );

    expect(screen.queryByTestId('win-message')).not.toBeInTheDocument();
    expect(screen.queryByTestId('game-over-message')).not.toBeInTheDocument();
  });
});
