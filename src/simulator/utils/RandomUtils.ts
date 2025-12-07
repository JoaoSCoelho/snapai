export class RandomUtils {
  /**
   * Returns a random integer between min and max (inclusive).
   * @param {number} min The minimum value (inclusive).
   * @param {number} max The maximum value (inclusive).
   * @returns {number} A random integer between min and max.
   */
  public static randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Returns a random floating point number between min and max (inclusive).
   * @param {number} min The minimum value (inclusive).
   * @param {number} max The maximum value (inclusive).
   * @returns {number} A random floating point number between min and max.
   */
  public static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  public static randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
