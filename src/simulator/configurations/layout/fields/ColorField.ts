import { ReactNode } from "react";
import { Field, FieldPartialInfoSchema, FieldSchema } from "./Field";
import z from "zod";

export type ColorFieldSchema = FieldSchema & {};

export class ColorField extends Field {
  private constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly disabled: boolean = false,
    info: FieldPartialInfoSchema,
  ) {
    super(name, label, occupedColumns, schema, required, disabled, info);
  }

  public static create(
    field: Omit<ColorFieldSchema, "info"> & {
      info: FieldPartialInfoSchema;
    },
  ) {
    return new ColorField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.disabled,
      field.info,
    );
  }
}
