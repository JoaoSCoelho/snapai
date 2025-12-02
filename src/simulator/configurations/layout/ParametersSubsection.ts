import z from "zod";
import { Line } from "./Line";
import { Subsection } from "./Subsection";
import { Global } from "@/simulator/Global";

export type ParametersSubsectionOptions = {
  lines: Line[];
  title?: string;
};

export class ParametersSubsection extends Subsection {
  protected constructor(
    public readonly lines: Line[],
    public readonly title?: string,
    public readonly nestedIn?: string,
    /** Only set it if you know what you're doing! */
    public readonly id = ++Global.lastId,
  ) {
    super(lines, title, nestedIn, id);
  }

  /**
   * Creates a new ParametersSubsection instance.
   * @param data The options for the new ParametersSubsection instance.
   * @returns A new ParametersSubsection instance created with the given options.
   */
  public static create(
    data: ParametersSubsectionOptions,
  ): ParametersSubsection {
    return new ParametersSubsection(data.lines, data.title);
  }

  /**
   * Returns a Zod schema that represents the parameters of a module.
   * This schema is an object where each key is the name of a parameter
   * and each value is the Zod schema of that parameter.
   * @returns A Zod schema that represents the parameters of the module.
   */
  public getSchema(): z.ZodObject {
    return z.object(
      Object.fromEntries(
        this.lines.flatMap((line) =>
          line.fields.map((field) => [field.name, field.schema]),
        ),
      ),
    );
  }
}
