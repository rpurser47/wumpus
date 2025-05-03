// CaveMap.tsx
// View: SVG cave map overlay for Hunt the Wumpus
import React from 'react';

import { Room } from '../model/GameModel';

interface CaveMapProps {
  rooms: Room[];
  playerRoom: number;
  shootMode: boolean;
  onRoomClick: (roomId: number) => void;
}

const CaveMap: React.FC<CaveMapProps> = ({ rooms, playerRoom, shootMode, onRoomClick }) => {
  // Get connected rooms to highlight for movement or shooting
  const connectedRooms = rooms[playerRoom]?.connections || [];

  // Determine room color based on state
  const getRoomColor = (roomId: number) => {
    if (roomId === playerRoom) return '#ffe066'; // Player's current room
    if (connectedRooms.includes(roomId)) {
      return shootMode ? '#ff9999' : '#99ff99'; // Connected rooms: red for shoot, green for move
    }
    return '#fff'; // Default white
  };

  // Determine room border based on state
  const getRoomBorder = (roomId: number) => {
    if (roomId === playerRoom) return 4; // Thicker border for player's room
    if (connectedRooms.includes(roomId)) return 3; // Medium border for connected rooms
    return 2; // Default border
  };

  return (
    <svg width="500" height="500" style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* Draw connections */}
      {rooms.map(room =>
        room.connections.map(connId => {
          const connRoom = rooms.find(r => r.id === connId);
          if (!connRoom || connRoom.id < room.id) return null; // Avoid duplicate lines
          return (
            <line
              key={`line-${room.id}-${connRoom.id}`}
              x1={room.x}
              y1={room.y}
              x2={connRoom.x}
              y2={connRoom.y}
              stroke={
                connectedRooms.includes(connId) && connectedRooms.includes(room.id)
                  ? '#666'
                  : '#bbb'
              }
              strokeWidth={
                connectedRooms.includes(connId) && connectedRooms.includes(room.id) ? 3 : 2
              }
            />
          );
        })
      )}
      {/* Draw rooms */}
      {rooms.map(room => {
        const isClickable = connectedRooms.includes(room.id) || room.id === playerRoom;
        return (
          <g
            key={room.id}
            onClick={isClickable ? () => onRoomClick(room.id) : undefined}
            style={{
              cursor: isClickable ? 'pointer' : 'default',
              userSelect: 'none', // Make text non-selectable
            }}
          >
            {/* Using a transparent overlay to ensure clicks work */}
            <circle
              cx={room.x}
              cy={room.y}
              r={22}
              fill={getRoomColor(room.id)}
              stroke={shootMode && connectedRooms.includes(room.id) ? '#c00' : '#888'}
              strokeWidth={getRoomBorder(room.id)}
            />
            <text
              x={room.x}
              y={room.y + 6}
              textAnchor="middle"
              fontSize={18}
              fill="#333"
              fontWeight={room.id === playerRoom ? 'bold' : 'normal'}
              style={{ pointerEvents: 'none' }} // Let clicks pass through to the parent g element
            >
              {room.id + 1}
            </text>
            {/* Transparent clickable overlay */}
            <circle
              cx={room.x}
              cy={room.y}
              r={22}
              fill="transparent"
              stroke="transparent"
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            />
          </g>
        );
      })}

      {/* Shoot mode indicator */}
      {shootMode && (
        <text x="250" y="30" textAnchor="middle" fill="#c00" fontWeight="bold" fontSize={16}>
          SHOOT MODE - Select Target Room
        </text>
      )}
    </svg>
  );
};

export default CaveMap;
