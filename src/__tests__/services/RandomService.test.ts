import { DefaultRandomService } from '../../services/RandomService';
import { MockRandomService } from '../mocks/MockRandomService';

describe('RandomService', () => {
  describe('DefaultRandomService', () => {
    let randomService: DefaultRandomService;

    beforeEach(() => {
      randomService = new DefaultRandomService();
    });

    test('random returns a number between 0 and 1', () => {
      const value = randomService.random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });

    test('getRandomInt returns an integer between min and max', () => {
      const min = 5;
      const max = 10;
      const value = randomService.getRandomInt(min, max);
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThan(max);
      expect(Number.isInteger(value)).toBe(true);
    });

    test('getRandomItem returns an item from the array', () => {
      const items = ['a', 'b', 'c'];
      const item = randomService.getRandomItem(items);
      expect(items).toContain(item);
    });

    test('shuffle returns a shuffled array', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled = randomService.shuffle(array);
      expect(shuffled).toHaveLength(array.length);
      expect(shuffled).toEqual(expect.arrayContaining(array));
    });
  });

  describe('MockRandomService', () => {
    test('returns predetermined values in sequence', () => {
      const mockValues = [0.1, 0.5, 0.9];
      const mockRandom = new MockRandomService(mockValues);

      expect(mockRandom.random()).toBe(0.1);
      expect(mockRandom.random()).toBe(0.5);
      expect(mockRandom.random()).toBe(0.9);
      // It should cycle back to the beginning
      expect(mockRandom.random()).toBe(0.1);
    });

    test('getRandomInt returns deterministic values based on the mock values', () => {
      const mockRandom = new MockRandomService([0.5]);

      // With a value of 0.5, getRandomInt(0, 10) should return 5
      expect(mockRandom.getRandomInt(0, 10)).toBe(5);
    });

    test('reset method resets the index', () => {
      const mockRandom = new MockRandomService([0.1, 0.2, 0.3]);

      mockRandom.random(); // 0.1
      mockRandom.random(); // 0.2

      mockRandom.reset();

      expect(mockRandom.random()).toBe(0.1);
    });

    test('setValues method changes the values', () => {
      const mockRandom = new MockRandomService([0.1]);

      expect(mockRandom.random()).toBe(0.1);

      mockRandom.setValues([0.9]);

      expect(mockRandom.random()).toBe(0.9);
    });
  });
});
