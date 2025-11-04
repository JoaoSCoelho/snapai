export default class AngleHelper {
  /**
   * Calculates the angle in degrees between two points (x1, y1) and (x2, y2).
   * The angle is measured counterclockwise from the positive x-axis.
   * The result is in the range [0, 360).
   */
  public static angleBetweenPointsInDegrees(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const radians = Math.atan2(dy, dx);
    const degrees = radians * (180 / Math.PI);
    return (degrees + 360) % 360;
  }

  /**
   * Calculates the angle in radians between two points (x1, y1) and (x2, y2).
   * The angle is measured counterclockwise from the positive x-axis.
   * The result is in the range [0, 2 * Math.PI).
   */
  public static angleBetweenPointsInRadians(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const radians = Math.atan2(dy, dx) + 2 * Math.PI;
    return radians % (2 * Math.PI);
  }

  /**
   * Converts an angle in radians to an angle in degrees.
   * The result is in the range [0, 360].
   * @param radians The angle in radians.
   * @returns The angle in degrees.
   */
  public static radianToDegree(radians: number) {
    return radians * (180 / Math.PI);
  }

  /**
   * Converts an angle in degrees to an angle in radians.
   * The result is in the range [0, 2 * Math.PI].
   * @param degrees The angle in degrees.
   * @returns The angle in radians.
   */
  public static degreeToRadian(degrees: number) {
    return degrees * (Math.PI / 180);
  }
}
