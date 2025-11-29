import z from "zod";
import { Line } from "./Line";
import { Subsection } from "./Subsection";

export class ModelParametersSubsection extends Subsection {
  public constructor(
    public readonly lines: Line[],
    public readonly title?: string,
    public readonly nestedIn?: string,
  ) {
    super(lines, title, nestedIn);
  }

  /**
   * Returns a Zod schema that represents the parameters of the model.
   * This schema is an object where each key is the name of a parameter
   * and each value is the Zod schema of that parameter.
   * @returns A Zod schema that represents the parameters of the model.
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
