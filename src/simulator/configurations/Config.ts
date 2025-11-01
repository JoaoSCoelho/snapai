import fs from "node:fs";

export abstract class Config {
  /**
   * Populate the config object from a JSON file.
   * @param path JSON file path. e.g. src/resources/config.json
   */
  public loadFromFile(path: string): this {
    const data = JSON.parse(fs.readFileSync(path, "utf-8"));
    return this.populate(data);
  }

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
