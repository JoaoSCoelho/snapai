export class Position {
  public constructor(
    public readonly x: number = 0,
    public readonly y: number = 0,
    public readonly z: number = 0,
  ) {}

  /**
   * Returns a new Position object that is a copy of this position.
   * @returns A new Position object that is a copy of this position.
   */
  public copy(): Position {
    return new Position(this.x, this.y, this.z);
  }

  /**
   * Returns the coordinates of this position as an array of three numbers: [x, y, z].
   * @returns The coordinates of this position.
   */
  public getCoordinates(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  /**
   * Checks if this position is equal to another position.
   * Two positions are equal if and only if all their coordinates (x, y, z) are equal.
   * @param other The position to compare with.
   * @returns True if this position is equal to the other position, false otherwise.
   */
  public isEqual(other: Position): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  /**
   * Returns the Euclidean distance between this position and another position.
   * The Euclidean distance is the square root of the sum of the squares of the differences of the x, y and z coordinates.
   * @param other The position to calculate the distance to.
   * @returns The Euclidean distance between this position and the other position.
   */
  public euclideanDistance(other: Position): number {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) +
        Math.pow(this.y - other.y, 2) +
        Math.pow(this.z - other.z, 2),
    );
  }
}
