import { RandomService } from '../../services/RandomService';

/**
 * MockRandomService - A deterministic implementation of RandomService for testing
 * 
 * This class allows tests to control "random" behavior by providing predetermined
 * values or sequences, making tests reproducible and deterministic.
 */
export class MockRandomService implements RandomService {
  private values: number[];
  private index: number;

  /**
   * Creates a new MockRandomService with predetermined values
   * @param values - Array of values to return in sequence when random() is called
   */
  constructor(values: number[] = [0.5]) {
    this.values = values;
    this.index = 0;
  }

  /**
   * Returns the next predetermined value in the sequence
   * @returns A predetermined number between 0 and 1
   */
  random(): number {
    const value = this.values[this.index % this.values.length];
    this.index++;
    return value;
  }

  /**
   * Returns a deterministic "random" integer based on the predetermined values
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (exclusive)
   */
  getRandomInt(min: number, max: number): number {
    return min + Math.floor(this.random() * (max - min));
  }

  /**
   * Returns a deterministic "random" item from an array
   * @param items - The array to select from
   */
  getRandomItem<T>(items: T[]): T {
    if (items.length === 0) {
      throw new Error('Cannot select a random item from an empty array');
    }
    return items[this.getRandomInt(0, items.length)];
  }

  /**
   * Returns a deterministically "shuffled" array
   * @param array - The array to shuffle
   */
  shuffle<T>(array: T[]): T[] {
    // For testing, we might want a more predictable shuffle
    // This implementation uses our deterministic random values
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.getRandomInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Resets the index to start returning values from the beginning of the sequence
   */
  reset(): void {
    this.index = 0;
  }

  /**
   * Sets new values for the mock to return
   * @param values - New array of values to use
   */
  setValues(values: number[]): void {
    this.values = values;
    this.reset();
  }
}
