// GameModel.ts
// Model for Hunt the Wumpus game logic and types

import { RandomService, DefaultRandomService } from '../services/RandomService';

export enum Hazard {
  None = 'None',
  Wumpus = 'Wumpus',
  Pit = 'Pit',
  Bats = 'Bats'
}

export interface Room {
  id: number;
  x: number;
  y: number;
  connections: number[];
  hazard: Hazard;
  description?: string;
}

export interface Player {
  room: number;
  arrows: number;
  alive: boolean;
}

export interface GameState {
  rooms: Room[];
  player: Player;
  wumpusRoom: number;
  batRooms: number[];
  pitRooms: number[];
  gameOver: boolean;
  win: boolean;
  messageLog: string[];
  selectedRoom: number | null; // For arrow shooting
  shootMode: boolean; // Whether player is in shooting mode
}

// Example cave graph: 16 rooms, irregular connections, positioned for 2D visualization
export const caveLayout: Room[] = [
  { id: 0, x: 100, y: 120, connections: [1, 4, 5], hazard: Hazard.None, description: "A wide cavern with a high ceiling. Water drips from stalactites above." },
  { id: 1, x: 200, y: 80, connections: [0, 2, 6], hazard: Hazard.None, description: "A narrow passage with glowing moss on the walls. The air feels damp." },
  { id: 2, x: 320, y: 100, connections: [1, 3, 7], hazard: Hazard.None, description: "A small chamber with strange crystal formations jutting from the floor." },
  { id: 3, x: 420, y: 160, connections: [2, 8, 4], hazard: Hazard.None, description: "A large cavern with a small underground stream running through it." },
  { id: 4, x: 380, y: 260, connections: [0, 3, 9], hazard: Hazard.None, description: "A winding tunnel with ancient carvings on the walls. They seem to tell a story." },
  { id: 5, x: 120, y: 220, connections: [0, 6, 10], hazard: Hazard.None, description: "A chamber with a low ceiling. You have to stoop to move around." },
  { id: 6, x: 200, y: 200, connections: [1, 5, 7, 11], hazard: Hazard.None, description: "A crossroads of several tunnels. Echoes bounce off the walls from all directions." },
  { id: 7, x: 300, y: 180, connections: [2, 6, 8, 12], hazard: Hazard.None, description: "A room with a small underground pool. The water is crystal clear." },
  { id: 8, x: 400, y: 220, connections: [3, 7, 9, 13], hazard: Hazard.None, description: "A chamber filled with strange mushrooms that give off a faint blue glow." },
  { id: 9, x: 340, y: 320, connections: [4, 8, 14], hazard: Hazard.None, description: "A vast chamber with towering rock formations like frozen waterfalls." },
  { id: 10, x: 80, y: 320, connections: [5, 11, 15], hazard: Hazard.None, description: "A small alcove with smooth walls. It feels strangely peaceful here." },
  { id: 11, x: 180, y: 300, connections: [6, 10, 12], hazard: Hazard.None, description: "A chamber with a floor covered in small, colorful pebbles that crunch underfoot." },
  { id: 12, x: 260, y: 260, connections: [7, 11, 13], hazard: Hazard.None, description: "A room where the ceiling opens to a natural chimney. A shaft of light filters down." },
  { id: 13, x: 340, y: 240, connections: [8, 12, 14], hazard: Hazard.None, description: "A chamber with walls that sparkle with embedded minerals. It's quite beautiful." },
  { id: 14, x: 300, y: 360, connections: [9, 13, 15], hazard: Hazard.None, description: "A large open space with strange rock formations that almost look like furniture." },
  { id: 15, x: 180, y: 380, connections: [10, 14], hazard: Hazard.None, description: "A deep chamber with the sound of distant water. Stalactites hang like daggers above." }
];

// Game initialization and logic
export class GameModel {
  private state: GameState;
  private readonly INITIAL_ARROWS = 5;
  private randomService: RandomService;

  constructor(randomService: RandomService = new DefaultRandomService()) {
    this.randomService = randomService;
    // Initialize with a deep copy of the cave layout
    const rooms = JSON.parse(JSON.stringify(caveLayout)) as Room[];
    
    // Choose a random starting room
    const startingRoom = this.randomService.getRandomInt(0, rooms.length);
    
    this.state = {
      rooms,
      player: {
        room: startingRoom, // Start in a random room
        arrows: this.INITIAL_ARROWS,
        alive: true
      },
      wumpusRoom: -1,
      batRooms: [],
      pitRooms: [],
      gameOver: false,
      win: false,
      messageLog: ["Welcome to Hunt the Wumpus!", `You begin your adventure in room ${startingRoom + 1}.`],
      selectedRoom: null,
      shootMode: false
    };
    
    this.placeHazards();
  }

  // Place hazards randomly in the cave
  private placeHazards(): void {
    const availableRooms = Array.from({ length: this.state.rooms.length }, (_, i) => i);
    
    // Remove player's starting room from available rooms to ensure safety
    const playerRoomIndex = availableRooms.indexOf(this.state.player.room);
    if (playerRoomIndex !== -1) {
      availableRooms.splice(playerRoomIndex, 1);
      
      // Also add the starting room description to the message log
      const startingRoom = this.state.rooms[this.state.player.room];
      if (startingRoom.description) {
        this.addMessage(startingRoom.description);
      }
    }
    
    // Place Wumpus
    const wumpusIndex = this.randomService.getRandomInt(0, availableRooms.length);
    this.state.wumpusRoom = availableRooms[wumpusIndex];
    this.state.rooms[this.state.wumpusRoom].hazard = Hazard.Wumpus;
    availableRooms.splice(wumpusIndex, 1);
    
    // Place 2 pits
    for (let i = 0; i < 2; i++) {
      const pitIndex = this.randomService.getRandomInt(0, availableRooms.length);
      const pitRoom = availableRooms[pitIndex];
      this.state.pitRooms.push(pitRoom);
      this.state.rooms[pitRoom].hazard = Hazard.Pit;
      availableRooms.splice(pitIndex, 1);
    }
    
    // Place 2 bat colonies
    for (let i = 0; i < 2; i++) {
      const batIndex = this.randomService.getRandomInt(0, availableRooms.length);
      const batRoom = availableRooms[batIndex];
      this.state.batRooms.push(batRoom);
      this.state.rooms[batRoom].hazard = Hazard.Bats;
      availableRooms.splice(batIndex, 1);
    }

    // Add initial hazard warnings
    this.addHazardWarnings();
  }

  // Add warnings about nearby hazards
  private addHazardWarnings(): void {
    const currentRoom = this.state.player.room;
    const adjacentRooms = this.state.rooms[currentRoom].connections;
    
    let wumpusNearby = false;
    let pitNearby = false;
    let batsNearby = false;
    
    for (const roomId of adjacentRooms) {
      const hazard = this.state.rooms[roomId].hazard;
      if (hazard === Hazard.Wumpus) wumpusNearby = true;
      if (hazard === Hazard.Pit) pitNearby = true;
      if (hazard === Hazard.Bats) batsNearby = true;
    }
    
    if (wumpusNearby) this.addMessage("You smell a terrible stench...");
    if (pitNearby) this.addMessage("You feel a cold draft...");
    if (batsNearby) this.addMessage("You hear rustling...");
  }

  // Add a message to the log
  private addMessage(message: string): void {
    this.state.messageLog.push(message);
  }

  // Get the current game state
  public getState(): GameState {
    return { ...this.state };
  }

  // Check if a move to a room is valid
  public isValidMove(targetRoom: number): boolean {
    if (this.state.gameOver) return false;
    if (this.state.shootMode) return false;
    
    const currentRoom = this.state.player.room;
    return this.state.rooms[currentRoom].connections.includes(targetRoom);
  }

  // Move the player to a new room
  public movePlayer(targetRoom: number): string[] {
    if (!this.isValidMove(targetRoom)) {
      return ["Invalid move!"];
    }
    
    this.state.player.room = targetRoom;
    const room = this.state.rooms[targetRoom];
    
    // Create messages array and add them to the message log
    const messages: string[] = [
      `You move to room ${targetRoom + 1}.`,
      room.description || "You enter a cave chamber."
    ];
    
    // Add these messages to the state's message log
    messages.forEach(msg => this.addMessage(msg));
    
    // Check for hazards
    const hazard = this.state.rooms[targetRoom].hazard;
    switch (hazard) {
      case Hazard.Wumpus:
        this.state.player.alive = false;
        this.state.gameOver = true;
        messages.push("OH NO! You walked into the Wumpus's room!");
        messages.push("The Wumpus devours you. GAME OVER!");
        // Add these hazard messages to the log
        this.addMessage(messages[2]);
        this.addMessage(messages[3]);
        break;
        
      case Hazard.Pit: {
        this.state.player.alive = false;
        this.state.gameOver = true;
        messages.push("AAAAHHHH! You fell into a bottomless pit!");
        messages.push("GAME OVER!");
        // Add these hazard messages to the log
        this.addMessage(messages[2]);
        this.addMessage(messages[3]);
        break;
      }
        
      case Hazard.Bats: {
        const randomRoom = this.randomService.getRandomInt(0, this.state.rooms.length);
        this.state.player.room = randomRoom;
        messages.push("Giant bats swoop down and carry you away!");
        messages.push(`They drop you in room ${randomRoom + 1}.`);
        // Add these hazard messages to the log
        this.addMessage(messages[2]);
        this.addMessage(messages[3]);
        
        // Also add the description of the new room
        const newRoom = this.state.rooms[randomRoom];
        if (newRoom.description) {
          this.addMessage(newRoom.description);
          messages.push(newRoom.description);
        }
        break;
      }
    }
    
    // Add hazard warnings if player is still alive
    if (!this.state.gameOver) {
      this.addHazardWarnings();
      // Add any warnings to the messages
      const warnings = this.state.messageLog.slice(-3);
      messages.push(...warnings);
    }
    
    return messages;
  }

  // Enter shoot mode
  public enterShootMode(): string[] {
    if (this.state.gameOver) {
      this.addMessage("Game over!");
      return ["Game over!"];
    }
    if (this.state.player.arrows <= 0) {
      this.addMessage("You're out of arrows!");
      return ["You're out of arrows!"];
    }
    
    this.state.shootMode = true;
    const message = "Select a connected room to shoot your arrow into.";
    this.addMessage(message);
    return [message];
  }

  // Exit shoot mode
  public exitShootMode(): void {
    this.state.shootMode = false;
    this.state.selectedRoom = null;
  }

  // Check if a room is a valid target for shooting
  public isValidShootTarget(targetRoom: number): boolean {
    if (!this.state.shootMode) return false;
    
    const currentRoom = this.state.player.room;
    return this.state.rooms[currentRoom].connections.includes(targetRoom);
  }

  // Shoot an arrow
  public shootArrow(targetRoom: number): string[] {
    if (!this.isValidShootTarget(targetRoom)) {
      this.exitShootMode();
      this.addMessage("Invalid target!");
      return ["Invalid target!"];
    }
    
    this.state.player.arrows--;
    this.state.shootMode = false;
    
    const messages: string[] = [`You shoot an arrow into room ${targetRoom + 1}!`];
    this.addMessage(messages[0]);
    
    // Check if the Wumpus was hit
    if (targetRoom === this.state.wumpusRoom) {
      this.state.win = true;
      this.state.gameOver = true;
      messages.push("You hear a terrible howl!");
      messages.push("You have slain the Wumpus! YOU WIN!");
      
      // Add these messages to the log
      this.addMessage(messages[1]);
      this.addMessage(messages[2]);
    } else {
      messages.push("Your arrow disappears into the darkness...");
      this.addMessage(messages[1]);
      
      // Check if player is out of arrows
      if (this.state.player.arrows <= 0) {
        this.state.gameOver = true;
        messages.push("You've used your last arrow!");
        messages.push("With no way to defend yourself, you flee the cave. GAME OVER!");
        
        // Add these messages to the log
        this.addMessage(messages[2]);
        this.addMessage(messages[3]);
      } else {
        // 25% chance the Wumpus moves after a missed shot
        if (this.randomService.random() < 0.25) {
          this.moveWumpus();
          messages.push("You hear movement in the darkness...");
          this.addMessage(messages[2]);
          
          // Check if Wumpus moved into player's room
          if (this.state.wumpusRoom === this.state.player.room) {
            this.state.player.alive = false;
            this.state.gameOver = true;
            messages.push("The Wumpus was startled by your arrow and moved into your room!");
            messages.push("It devours you. GAME OVER!");
            
            // Add these messages to the log
            this.addMessage(messages[3]);
            this.addMessage(messages[4]);
          }
        }
      }
    }
    
    return messages;
  }

  // Move the Wumpus to a random adjacent room
  private moveWumpus(): void {
    const currentWumpusRoom = this.state.wumpusRoom;
    const possibleRooms = this.state.rooms[currentWumpusRoom].connections;
    const newWumpusRoom = this.randomService.getRandomItem(possibleRooms);
    
    // Update hazard in old and new room
    this.state.rooms[currentWumpusRoom].hazard = Hazard.None;
    this.state.rooms[newWumpusRoom].hazard = Hazard.Wumpus;
    this.state.wumpusRoom = newWumpusRoom;
  }

  // Reset the game
  public resetGame(): void {
    const rooms = JSON.parse(JSON.stringify(caveLayout)) as Room[];
    
    this.state = {
      rooms,
      player: {
        room: 0,
        arrows: this.INITIAL_ARROWS,
        alive: true
      },
      wumpusRoom: -1,
      batRooms: [],
      pitRooms: [],
      gameOver: false,
      win: false,
      messageLog: ["Game restarted. Good luck!"],
      selectedRoom: null,
      shootMode: false
    };
    
    this.placeHazards();
  }
}
