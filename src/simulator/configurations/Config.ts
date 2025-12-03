import z from "zod";
import { Layout } from "./layout/Layout";
import axios from "axios";

export abstract class Config<
  ZodSchema extends z.ZodObject,
  Schema extends z.infer<ZodSchema>,
> {
  /**
   * Constructor for Config class.
   *
   * @param {string} configJsonFilePath - Path to the config JSON file (to write, so use relative path from root, i.e. `./src/simulator/configurations/config.json`)
   * @param {z.infer<typeof this.validatorSchema>} data - Config data.
   */
  public constructor(
    /** Path to the config JSON file (to write, so use relative path from root, i.e. `./src/simulator/configurations/config.json`) */
    public readonly configJsonFilePath: string,
    public readonly data: Schema,
    public readonly layout: Layout,
    public readonly validatorSchema: ZodSchema,
    public readonly defaultData: Partial<Schema>,
  ) {
    this.data = { ...this.defaultData, ...data };
    this.parse(this.data);
  }

  /**
   * Parses the given data into a valid configuration.
   *
   * It tries to parse the given data using the validator schema.
   * If the parsing fails, it checks if the error is due to an undefined field in the configuration file.
   * If so, it logs an error message with the path of the undefined field(s) and throws an error.
   * If not, it re-throws the error.
   *
   * @param {Schema} data - The data to be parsed.
   * @returns {Schema} The parsed data.
   * @throws {Error} If the parsing fails.
   */
  protected parse(data: Schema): Schema {
    try {
      return this.validatorSchema.strict().parse(data) as Schema;
    } catch (error) {
      if (
        error instanceof z.ZodError &&
        error.issues.some(
          (i) =>
            i.code === "invalid_type" &&
            i.message.startsWith("Invalid input: expected") &&
            i.message.endsWith("undefined"),
        )
      ) {
        console.error(
          `\x1b[31mFields:\n  - ${error.issues
            .filter(
              (i) =>
                i.code === "invalid_type" &&
                i.message.startsWith("Invalid input: expected") &&
                i.message.endsWith("undefined"),
            )
            .map((i) => i.path.join("."))
            .join(
              "\n  - ",
            )}\nundefined in configuration file:\x1b[0m ${this.configJsonFilePath}`,
        );

        throw "Can't parse config file";
      } else {
        throw error;
      }
    }
  }

  /**
   * Sets the config data.
   * @param data JSON object. e.g. {paramA: "John", paramB: 30}.
   * @returns this.
   */
  public setData(data: Schema): this {
    // @ts-ignore
    this.data = data;
    return this;
  }

  protected abstract innerToJSON(): Schema;

  /**
   * Convert the config object to a JSON object.
   * Throws an error if the config object is invalid.
   * @returns the JSON object.
   */
  public toJSON(): Schema {
    return this.validatorSchema.strict().parse(this.innerToJSON()) as Schema;
  }
}
