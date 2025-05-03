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
});
