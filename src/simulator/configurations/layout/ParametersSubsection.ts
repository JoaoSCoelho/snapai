import z from "zod";
import { Line } from "./Line";
import { Subsection } from "./Subsection";
import { Global } from "@/simulator/Global";

export type ParametersSubsectionOptions = {
  lines: Line[];
  title?: string;
  disabled?: boolean;
};

export class ParametersSubsection extends Subsection {
  protected constructor(
    public readonly lines: Line[],
    public readonly title?: string,
    public readonly nestedIn?: string,
    public readonly disabled: boolean = false,
    /** Only set it if you know what you're doing! */
    public readonly id = ++Global.lastId,
  ) {
    super(lines, title, nestedIn, disabled, id);
  }

  /**
   * Creates a new ParametersSubsection instance that is a partial copy of this one.
   * If a property is not given, it will be set to the same value as this one.
   * @param lines The lines of the new ParametersSubsection.
   * @param title The title of the new ParametersSubsection.
   * @param nestedIn The nested in of the new ParametersSubsection.
   * @param id The id of the new ParametersSubsection.
   * @returns A new ParametersSubsection instance that is a partial copy of this one.
   */
  public createPartialCopy(data?: {
    lines?: Line[];
    title?: string;
    nestedIn?: string;
    disabled?: boolean;
    id?: number;
  }): ParametersSubsection {
    return new ParametersSubsection(
      data?.lines ?? this.lines,
      data?.title ?? this.title,
      data?.nestedIn ?? this.nestedIn,
      data?.disabled ?? this.disabled,
      data?.id ?? this.id,
    );
  }

  /**
   * Creates a new ParametersSubsection instance.
   * @param data The options for the new ParametersSubsection instance.
   * @returns A new ParametersSubsection instance created with the given options.
   */
  public static create(
    data: ParametersSubsectionOptions,
  ): ParametersSubsection {
    return new ParametersSubsection(
      data.lines,
      data.title,
      undefined,
      data.disabled,
    );
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
