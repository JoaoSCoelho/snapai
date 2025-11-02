import { ReactNode } from "react";
import { Field, FieldSchema } from "./Field";
import z from "zod";

export type ColorFieldSchema = FieldSchema & {};

export class ColorField extends Field {
  private constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    info: { title: string; helpText?: ReactNode },
  ) {
    super(name, label, occupedColumns, schema, required, info);
  }

  public static create(
    field: Omit<ColorFieldSchema, "info"> & {
      info: { title: string; helpText?: ReactNode };
    },
  ) {
    return new ColorField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.info,
    );
  }
}
