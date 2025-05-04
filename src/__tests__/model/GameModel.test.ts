import { GameModel, Hazard } from '../../model/GameModel';
import { MockRandomService } from '../mocks/MockRandomService';

describe('GameModel', () => {
  let gameModel: GameModel;

  beforeEach(() => {
    gameModel = new GameModel();
  });

  test('initializes with player alive and correct number of arrows', () => {
    const state = gameModel.getState();
    expect(state.player.alive).toBe(true);
    expect(state.player.arrows).toBe(5);
    expect(state.gameOver).toBe(false);
  });

  test('places hazards correctly', () => {
    const state = gameModel.getState();

    // Should have 1 Wumpus
    const wumpusRooms = state.rooms.filter(room => room.hazard === Hazard.Wumpus);
    expect(wumpusRooms.length).toBe(1);

    // Should have 2 pits
    const pitRooms = state.rooms.filter(room => room.hazard === Hazard.Pit);
    expect(pitRooms.length).toBe(2);

    // Should have 2 bat colonies
    const batRooms = state.rooms.filter(room => room.hazard === Hazard.Bats);
    expect(batRooms.length).toBe(2);
  });

  test('places player in room 5 when random seed is controlled', () => {
    // Create a mock random service that will place the player in room 5 (index 4)
    const mockRandom = new MockRandomService([0.3]);

    // Create a new game instance with the mock random service
    const newGameModel = new GameModel(mockRandom);
    const state = newGameModel.getState();

    // With our mock returning 0.3, and 16 rooms (0-15), the player should be in room 4
    // 0.3 * 16 = 4.8, which gets floored to 4
    expect(state.player.room).toBe(4);
  });

  describe('Player Movement', () => {
    test('validates moves correctly', () => {
      // Create a game with controlled randomness
      const mockRandom = new MockRandomService([0.25]); // Player starts in room 4
      const game = new GameModel(mockRandom);
      // const state = game.getState();

      // Room 4 connects to rooms 0, 3, and 9
      expect(game.isValidMove(0)).toBe(true);
      expect(game.isValidMove(3)).toBe(true);
      expect(game.isValidMove(9)).toBe(true);

      // Room 4 doesn't connect to room 1
      expect(game.isValidMove(1)).toBe(false);

      // Can't move when game is over
      game['state'].gameOver = true;
      expect(game.isValidMove(0)).toBe(false);

      // Can't move in shoot mode
      game['state'].gameOver = false;
      game['state'].shootMode = true;
      expect(game.isValidMove(0)).toBe(false);
    });

    test('moves player to valid room', () => {
      // Create a game with controlled randomness
      const mockRandom = new MockRandomService([0.25]); // Player starts in room 4
      const game = new GameModel(mockRandom);

      // Move to a connected room
      const messages = game.movePlayer(0);
      const state = game.getState();

      // Player should now be in room 0
      expect(state.player.room).toBe(0);

      // Should return appropriate messages
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0]).toContain('You move to room 1');
    });

    test('handles invalid moves', () => {
      // Create a game with controlled randomness
      const mockRandom = new MockRandomService([0.25]); // Player starts in room 4
      const game = new GameModel(mockRandom);
      const initialState = game.getState();

      // Try to move to an unconnected room
      const messages = game.movePlayer(1);
      const newState = game.getState();

      // Player should still be in the same room
      expect(newState.player.room).toBe(initialState.player.room);

      // Should return error message
      expect(messages).toEqual(['Invalid move!']);
    });

    test('handles walking into Wumpus room', () => {
      // Create a game with controlled hazard placement
      const mockRandom = new MockRandomService([0.25, 0.1, 0.2, 0.3, 0.4, 0.5]);
      const game = new GameModel(mockRandom);

      // Force Wumpus into room 0 (connected to player's starting room 4)
      game['state'].wumpusRoom = 0;
      game['state'].rooms[0].hazard = Hazard.Wumpus;

      // Move to Wumpus room
      const messages = game.movePlayer(0);
      const state = game.getState();

      // Player should be dead and game over
      expect(state.player.alive).toBe(false);
      expect(state.gameOver).toBe(true);

      // Should return appropriate messages
      expect(messages.some(msg => msg.includes('Wumpus'))).toBe(true);
      expect(messages.some(msg => msg.includes('GAME OVER'))).toBe(true);
    });

    test('handles falling into pit', () => {
      // Create a game with controlled hazard placement
      const mockRandom = new MockRandomService([0.25, 0.1, 0.2, 0.3, 0.4, 0.5]);
      const game = new GameModel(mockRandom);

      // Force pit into room 3 (connected to player's starting room 4)
      game['state'].pitRooms = [3];
      game['state'].rooms[3].hazard = Hazard.Pit;

      // Move to pit room
      const messages = game.movePlayer(3);
      const state = game.getState();

      // Player should be dead and game over
      expect(state.player.alive).toBe(false);
      expect(state.gameOver).toBe(true);

      // Should return appropriate messages
      expect(messages.some(msg => msg.includes('pit'))).toBe(true);
      expect(messages.some(msg => msg.includes('GAME OVER'))).toBe(true);
    });

    test('handles being carried by bats', () => {
      // Create a game with controlled randomness
      const mockRandom = new MockRandomService([0.25, 0.1, 0.2, 0.3, 0.4, 0.5]);
      const game = new GameModel(mockRandom);

      // Force bats into room 9 (connected to player's starting room 4)
      game['state'].batRooms = [9];
      game['state'].rooms[9].hazard = Hazard.Bats;

      // Set up the random service to drop player in room 2 after bat encounter
      mockRandom.setValues([0.15]); // 0.15 * 16 = 2.4, which floors to 2

      // Move to bat room
      const messages = game.movePlayer(9);
      const state = game.getState();

      // Player should be in a new room
      expect(state.player.room).toBe(2);

      // Should return appropriate messages
      expect(messages.some(msg => msg.includes('bats'))).toBe(true);
      expect(messages.some(msg => msg.includes('drop you in room'))).toBe(true);
    });
  });

  describe('Shooting Arrows', () => {
    test('enters shoot mode correctly', () => {
      const game = new GameModel();

      const messages = game.enterShootMode();
      const state = game.getState();

      expect(state.shootMode).toBe(true);
      expect(messages.length).toBeGreaterThan(0);
    });

    test('exits shoot mode correctly', () => {
      const game = new GameModel();

      game.enterShootMode();
      game.exitShootMode();
      const state = game.getState();

      expect(state.shootMode).toBe(false);
      expect(state.selectedRoom).toBeNull();
    });

    test('validates shoot targets correctly', () => {
      // Create a game with controlled randomness
      const mockRandom = new MockRandomService([0.25]); // Player starts in room 4
      const game = new GameModel(mockRandom);

      // Enter shoot mode
      game.enterShootMode();

      // Room 4 connects to rooms 0, 3, and 9
      expect(game.isValidShootTarget(0)).toBe(true);
      expect(game.isValidShootTarget(3)).toBe(true);
      expect(game.isValidShootTarget(9)).toBe(true);

      // Room 4 doesn't connect to room 1
      expect(game.isValidShootTarget(1)).toBe(false);

      // Can't shoot when not in shoot mode
      game.exitShootMode();
      expect(game.isValidShootTarget(0)).toBe(false);
    });

    test('shoots and kills Wumpus', () => {
      // Create a game with controlled randomness
      const mockRandom = new MockRandomService([0.25, 0.1, 0.2, 0.3, 0.4, 0.5]);
      const game = new GameModel(mockRandom);

      // Force Wumpus into room 0 (connected to player's starting room 4)
      game['state'].wumpusRoom = 0;
      game['state'].rooms[0].hazard = Hazard.Wumpus;

      // Enter shoot mode and shoot at Wumpus
      game.enterShootMode();
      const messages = game.shootArrow(0);
      const state = game.getState();

      // Game should be over with a win
      expect(state.gameOver).toBe(true);
      expect(state.win).toBe(true);

      // Arrow count should decrease
      expect(state.player.arrows).toBe(4);

      // Should return appropriate messages
      expect(messages.some(msg => msg.includes('slain the Wumpus'))).toBe(true);
      expect(messages.some(msg => msg.includes('WIN'))).toBe(true);
    });

    test('shoots and misses Wumpus', () => {
      // Create a game with controlled randomness
      const mockRandom = new MockRandomService([0.25, 0.1, 0.2, 0.3, 0.4, 0.5]);
      const game = new GameModel(mockRandom);

      // Force Wumpus into room 3 (connected to player's starting room 4)
      game['state'].wumpusRoom = 3;
      game['state'].rooms[3].hazard = Hazard.Wumpus;

      // Enter shoot mode and shoot at empty room
      game.enterShootMode();
      const messages = game.shootArrow(0);
      const state = game.getState();

      // Game should not be over
      expect(state.gameOver).toBe(false);
      expect(state.win).toBe(false);

      // Arrow count should decrease
      expect(state.player.arrows).toBe(4);

      // Should return appropriate messages
      expect(messages.some(msg => msg.includes('disappears into the darkness'))).toBe(true);
    });

    test('handles running out of arrows', () => {
      // Create a game with controlled randomness
      const mockRandom = new MockRandomService([0.25, 0.1, 0.2, 0.3, 0.4, 0.5]);
      const game = new GameModel(mockRandom);

      // Set player to have only 1 arrow left
      game['state'].player.arrows = 1;

      // Enter shoot mode and shoot at empty room
      game.enterShootMode();
      const messages = game.shootArrow(0);
      const state = game.getState();

      // Game should be over
      expect(state.gameOver).toBe(true);
      expect(state.win).toBe(false);

      // Arrow count should be 0
      expect(state.player.arrows).toBe(0);

      // Should return appropriate messages
      expect(messages.some(msg => msg.includes('last arrow'))).toBe(true);
      expect(messages.some(msg => msg.includes('GAME OVER'))).toBe(true);
    });

    test('handles Wumpus movement after missed shot', () => {
      // Create a game with controlled randomness
      const mockRandom = new MockRandomService([0.25, 0.1, 0.2, 0.3, 0.4, 0.5]);
      const game = new GameModel(mockRandom);

      // Force Wumpus into room 3 (connected to player's starting room 4)
      game['state'].wumpusRoom = 3;
      game['state'].rooms[3].hazard = Hazard.Wumpus;

      // Set up random to trigger Wumpus movement (25% chance)
      mockRandom.setValues([0.2]); // 0.2 < 0.25, so Wumpus will move

      // Set up Wumpus to move to player's room
      mockRandom.setValues([0.0]); // This will make Wumpus move to first connected room

      // Make room 4 the first connected room of room 3
      const connections = game['state'].rooms[3].connections;
      const playerRoomIndex = connections.indexOf(4);
      if (playerRoomIndex > 0) {
        // Swap to make player's room first in connections
        [connections[0], connections[playerRoomIndex]] = [
          connections[playerRoomIndex],
          connections[0],
        ];
      }

      // Enter shoot mode and shoot at empty room
      game.enterShootMode();
      const messages = game.shootArrow(0);
      const state = game.getState();

      // Game should be over
      expect(state.gameOver).toBe(true);
      expect(state.player.alive).toBe(false);

      // Wumpus should have moved to player's room
      expect(state.wumpusRoom).toBe(4);

      // Should return appropriate messages
      expect(messages.some(msg => msg.includes('movement in the darkness'))).toBe(true);
      expect(messages.some(msg => msg.includes('startled'))).toBe(true);
      expect(messages.some(msg => msg.includes('GAME OVER'))).toBe(true);
    });
  });

  describe('Game Reset', () => {
    test('resets game state correctly', () => {
      const game = new GameModel();

      // Make some changes to the game state
      game.enterShootMode();
      game['state'].player.arrows = 2;
      game['state'].gameOver = true;

      // Reset the game
      game.resetGame();
      const state = game.getState();

      // Game should be reset
      expect(state.gameOver).toBe(false);
      expect(state.win).toBe(false);
      expect(state.player.arrows).toBe(5);
      expect(state.shootMode).toBe(false);
      expect(state.messageLog).toContain('Game restarted. Good luck!');

      // Should have hazards placed
      const wumpusRooms = state.rooms.filter(room => room.hazard === Hazard.Wumpus);
      expect(wumpusRooms.length).toBe(1);

      const pitRooms = state.rooms.filter(room => room.hazard === Hazard.Pit);
      expect(pitRooms.length).toBe(2);

      const batRooms = state.rooms.filter(room => room.hazard === Hazard.Bats);
      expect(batRooms.length).toBe(2);
    });
  });
});
