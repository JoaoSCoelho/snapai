export abstract class Config {
  /**
   * Populate the config object from an object.
   * @param data JSON object. e.g. {paramA: "John", paramB: 30}.
   */
  public populate(data: Record<string, any>): this {
    Object.assign(this, data);
    return this;
  }

  public abstract toJSON(): Record<string, any>;
}
