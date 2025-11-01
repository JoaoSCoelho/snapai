export abstract class Message {
  public constructor(public readonly data: any) {}

  /**
   * Create a deep copy of the message.
   * This method creates a new instance of the message class with the same data.
   * @returns A new instance of the message class with the same data.
   */
  public clone(): Message {
    return structuredClone(this);
  }
}
