export class Position {
  public readonly isInert = false;

  public constructor(
    public readonly x: number = 0,
    public readonly y: number = 0,
    public readonly z: number = 0,
  ) {}

  /**
   * Creates a new Position object with the given coordinates.
   * @param x The x coordinate of the new position.
   * @param y The y coordinate of the new position.
   * @param z The z coordinate of the new position.
   * @returns A new Position object with the given coordinates.
   */
  public static create(x: number, y: number, z: number): Position {
    return new Position(x, y, z);
  }

  /**
   * Returns a new Position object that is the result of adding the given delta to the given position.
   * The delta is added component-wise, i.e. the x component of the delta is added to the x component of the position, and so on.
   * @param position The base position
   * @param delta The delta to add to the position in format of [x, y, z]
   * @returns A new Position object that is the result of adding the given delta to the given position
   */
  public static fromPositionAndDelta(
    position: Position,
    [x, y, z]: [number, number, number],
  ): Position {
    return new Position(position.x + x, position.y + y, position.z + z);
  }

  /**
   *
   * @param position The base position
   * @param vector [radius, theta, phi] Where r is the radius (magnitude|length), theta is the polar angle and phi is the azimuthal angle
   */
  public static fromPositionAndVector(
    position: Position,
    [radius, theta, phi]: [number, number, number],
  ): Position {
    return new Position(
      position.x + radius * Math.cos(theta) * Math.cos(phi),
      position.y + radius * Math.sin(theta) * Math.cos(phi),
      position.z + radius * Math.sin(phi),
    );
  }

  /**
   * Returns a new Position object that is the result of cropping the given position to the given dimensions.
   * The given position is cropped to fit within the given dimensions.
   * The dimensions are given as an array of three arrays, each containing two numbers representing the minimum and maximum values of the x, y and z coordinates respectively.
   * @param position The position to crop
   * @param dimensions The dimensions to crop to
   * @returns A new Position object that is the result of cropping the given position to the given dimensions
   */
  public static cropToDimensions(
    position: Position,
    dimensions: [[number, number], [number, number], [number, number]],
  ) {
    return new Position(
      Math.min(Math.max(position.x, dimensions[0][0]), dimensions[0][1]),
      Math.min(Math.max(position.y, dimensions[1][0]), dimensions[1][1]),
      Math.min(Math.max(position.z, dimensions[2][0]), dimensions[2][1]),
    );
  }

  /**
   * Returns a special inert Position object.
   * This position object has all its coordinates set to 0 and its isInert property set to true.
   * Inert positions are used to represent positions that are not applicable in the context of the simulation.
   * For example, when a node is being initialized, its position is set to the inert position until a new position is set.
   * Inert positions cannot be copied or used in any mathematical operations.
   * @returns A special inert Position object.
   */
  public static inert(): Position {
    const inertPosition = new Position(0, 0, 0);
    //@ts-ignore
    inertPosition.isInert = true;
    return inertPosition;
  }

  /**
   * Returns a new Position object that is a copy of this position.
   * @returns A new Position object that is a copy of this position.
   * @throws Error if this position is inert
   */
  public copy(): Position {
    if (this.isInert) throw new Error("Cannot copy inert position.");
    return new Position(this.x, this.y, this.z);
  }

  /**
   * Returns the coordinates of this position as an array of three numbers: [x, y, z].
   * @returns The coordinates of this position.
   * @throws Error if this position is inert
   */
  public getCoordinates(): [number, number, number] {
    if (this.isInert)
      throw new Error("Cannot get coordinates of inert position.");
    return [this.x, this.y, this.z];
  }

  /**
   * Checks if this position is equal to another position.
   * Two positions are equal if and only if all their coordinates (x, y, z) are equal.
   *
   * @param other The position to compare with.
   * @returns True if this position is equal to the other position, false otherwise. Note that an inert position is not equal to any other position.
   */
  public isEqual(other: Position): boolean {
    if (this.isInert || other.isInert) return false;
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  /**
   * Returns the Euclidean distance between this position and another position.
   * The Euclidean distance is the square root of the sum of the squares of the differences of the x, y and z coordinates.
   * @param other The position to calculate the distance to.
   * @returns The Euclidean distance between this position and the other position.
   * @throws Error if at least one of the positions are inert
   */
  public euclideanDistance(other: Position): number {
    if (this.isInert || other.isInert)
      throw new Error("Cannot calculate distance between inert positions.");

    return Math.sqrt(
      Math.pow(this.x - other.x, 2) +
        Math.pow(this.y - other.y, 2) +
        Math.pow(this.z - other.z, 2),
    );
  }
}
