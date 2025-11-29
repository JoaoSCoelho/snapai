import z from "zod";
import { Layout } from "./layout/Layout";

export abstract class Config {
  /**
   * Constructor for Config class.
   *
   * @param {string} configJsonFilePath - Path to the config JSON file (to write, so use relative path from root, i.e. `./src/simulator/configurations/config.json`)
   * @param {z.infer<typeof this.validatorSchema>} data - Config data.
   */
  public constructor(
    /** Path to the config JSON file (to write, so use relative path from root, i.e. `./src/simulator/configurations/config.json`) */
    public readonly configJsonFilePath: string,
    public readonly data: z.infer<typeof this.validatorSchema>,
    public readonly layout: Layout,
    public readonly validatorSchema: z.ZodObject,
  ) {
    this.parse(data);
  }

  protected parse(data: z.infer<typeof this.validatorSchema>) {
    return this.validatorSchema.strict().parse(data);
  }

  /**
   * Sets the config data.
   * @param data JSON object. e.g. {paramA: "John", paramB: 30}.
   * @returns this.
   */
  public setData(data: z.infer<typeof this.validatorSchema>): this {
    // @ts-ignore
    this.data = data;
    return this;
  }

  protected abstract innerToJSON(): z.infer<typeof this.validatorSchema>;

  /**
   * Convert the config object to a JSON object.
   * Throws an error if the config object is invalid.
   * @returns the JSON object.
   */
  public toJSON(): z.infer<typeof this.validatorSchema> {
    return this.validatorSchema.strict().parse(this.innerToJSON());
  }
}
