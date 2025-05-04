import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';

import { Room, Hazard } from '../../model/GameModel';
import CaveMap from '../../view/CaveMap';

describe('CaveMap', () => {
  // Create a simplified set of test rooms
  const testRooms: Room[] = [
    {
      id: 0,
      x: 100,
      y: 100,
      connections: [1, 2],
      hazard: Hazard.None,
      description: 'Test room 0',
    },
    {
      id: 1,
      x: 200,
      y: 100,
      connections: [0, 3],
      hazard: Hazard.None,
      description: 'Test room 1',
    },
    {
      id: 2,
      x: 100,
      y: 200,
      connections: [0, 3],
      hazard: Hazard.None,
      description: 'Test room 2',
    },
    {
      id: 3,
      x: 200,
      y: 200,
      connections: [1, 2],
      hazard: Hazard.None,
      description: 'Test room 3',
    },
  ];

  // Mock function for room clicks
  const mockOnRoomClick = jest.fn();

  // Reset mock before each test
  beforeEach(() => {
    mockOnRoomClick.mockReset();
  });

  test('renders the cave map with all rooms', () => {
    render(
      <CaveMap rooms={testRooms} playerRoom={0} shootMode={false} onRoomClick={mockOnRoomClick} />
    );

    // Check that the map is rendered
    expect(screen.getByTestId('cave-map')).toBeInTheDocument();

    // Check that all rooms are rendered
    testRooms.forEach(room => {
      expect(screen.getByTestId(`room-${room.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`room-text-${room.id}`)).toHaveTextContent(
        (room.id + 1).toString()
      );
    });
  });

  test('highlights the player room', () => {
    render(
      <CaveMap rooms={testRooms} playerRoom={1} shootMode={false} onRoomClick={mockOnRoomClick} />
    );

    // Check that the player's room text is bold
    const playerRoomText = screen.getByTestId('room-text-1');
    expect(playerRoomText).toHaveAttribute('font-weight', 'bold');
  });

  test('highlights connected rooms in move mode', () => {
    render(
      <CaveMap rooms={testRooms} playerRoom={0} shootMode={false} onRoomClick={mockOnRoomClick} />
    );

    // Room 0 is connected to rooms 1 and 2
    // These should have a different fill color in move mode
    const connectedRoom1 = screen.getByTestId('room-circle-1');
    const connectedRoom2 = screen.getByTestId('room-circle-2');
    const nonConnectedRoom = screen.getByTestId('room-circle-3');

    // We can't directly check the fill color in JSDOM, but we can check that
    // connected rooms have the same fill attribute and non-connected have different
    expect(connectedRoom1.getAttribute('fill')).toBe(connectedRoom2.getAttribute('fill'));
    expect(connectedRoom1.getAttribute('fill')).not.toBe(nonConnectedRoom.getAttribute('fill'));
  });

  test('highlights connected rooms in shoot mode', () => {
    render(
      <CaveMap rooms={testRooms} playerRoom={0} shootMode={true} onRoomClick={mockOnRoomClick} />
    );

    // In shoot mode, connected rooms should have a red stroke
    const connectedRoom1 = screen.getByTestId('room-circle-1');
    expect(connectedRoom1.getAttribute('stroke')).toBe('#c00');

    // Non-connected rooms should have a different stroke
    const nonConnectedRoom = screen.getByTestId('room-circle-3');
    expect(nonConnectedRoom.getAttribute('stroke')).not.toBe('#c00');

    // Should show the shoot mode indicator
    expect(screen.getByTestId('shoot-mode-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('shoot-mode-indicator')).toHaveTextContent('SHOOT MODE');
  });

  test('does not show shoot mode indicator when not in shoot mode', () => {
    render(
      <CaveMap rooms={testRooms} playerRoom={0} shootMode={false} onRoomClick={mockOnRoomClick} />
    );

    // Should not show the shoot mode indicator
    expect(screen.queryByTestId('shoot-mode-indicator')).not.toBeInTheDocument();
  });
});
