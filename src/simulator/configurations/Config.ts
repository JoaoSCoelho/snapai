import z from "zod";
import { Layout } from "./layout/Layout";

export abstract class Config {
  public abstract readonly layout: Layout;
  public abstract readonly validatorSchema: z.ZodObject;

  /**
   * Constructor for Config class.
   *
   * **Recommended to call `this.parse(this.innerToJSON());` after `super()` call in non-abstract child classes.**
   * @param {string} configJsonFilePath - Path to the config JSON file (to write, so use relative path from root, i.e. `./src/simulator/configurations/config.json`)
   * @param {z.infer<typeof this.validatorSchema>} populateData - Data to populate the config object with.
   */
  public constructor(
    /** Path to the config JSON file (to write, so use relative path from root, i.e. `./src/simulator/configurations/config.json`) */
    public readonly configJsonFilePath: string,
    populateData: z.infer<typeof this.validatorSchema>,
  ) {
    this.populate(populateData);
  }

  protected parse(data: z.infer<typeof this.validatorSchema>) {
    return this.validatorSchema.strict().safeParse(data);
  }

  /**
   * Populate the config object from an object.
   * @param data JSON object. e.g. {paramA: "John", paramB: 30}.
   */
  public populate(data: z.infer<typeof this.validatorSchema>): this {
    Object.assign(this, data);
    return this;
  }

  protected abstract innerToJSON(): z.infer<typeof this.validatorSchema>;

  /**
   * Convert the config object to a JSON object.
   * Throws an error if the config object is invalid.
   * @returns the JSON object.
   */
  public toJSON(): z.infer<typeof this.validatorSchema> {
    const parsed = this.validatorSchema.strict().safeParse(this.innerToJSON());
    if (parsed.error) throw new Error("Error parsing Config", parsed.data);
    return this.innerToJSON();
  }
}
