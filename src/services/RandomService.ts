/**
 * RandomService - An interface for abstracting random operations
 * This allows for deterministic testing by mocking random behavior
 */

/**
 * Interface for randomization service to enable mocking for tests
 */
export interface RandomService {
  /**
   * Returns a random number between 0 (inclusive) and 1 (exclusive)
   * Equivalent to Math.random()
   */
  random(): number;
  
  /**
   * Returns a random integer between min (inclusive) and max (exclusive)
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (exclusive)
   */
  getRandomInt(min: number, max: number): number;
  
  /**
   * Returns a random item from an array
   * @param items - The array to select from
   */
  getRandomItem<T>(items: T[]): T;
  
  /**
   * Shuffles an array and returns a new shuffled array
   * @param array - The array to shuffle
   */
  shuffle<T>(array: T[]): T[];
}

/**
 * Default implementation of RandomService that uses Math.random
 */
export class DefaultRandomService implements RandomService {
  /**
   * Returns a random number between 0 (inclusive) and 1 (exclusive)
   */
  random(): number {
    return Math.random();
  }
  
  /**
   * Returns a random integer between min (inclusive) and max (exclusive)
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (exclusive)
   */
  getRandomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min)) + min;
  }
  
  /**
   * Returns a random item from an array
   * @param items - The array to select from
   */
  getRandomItem<T>(items: T[]): T {
    return items[this.getRandomInt(0, items.length)];
  }
  
  /**
   * Shuffles an array and returns a new shuffled array
   * @param array - The array to shuffle
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.getRandomInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
