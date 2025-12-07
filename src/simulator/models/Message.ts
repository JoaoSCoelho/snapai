export class Message {
  public constructor(
    /** **DATA SHOULD BE SERIALIZABLE** */
    public readonly data: any,
  ) {}

  /**
   * Create a deep copy of the message.
   * This method creates a new instance of the message class with the same data.
   * @returns A new instance of the message class with the same data.
   */
  public clone(): Message {
    return new Message(JSON.parse(JSON.stringify(this.data)));
  }

  public getByteSize(): number {
    return JSON.stringify(this.data).length;
  }
}
