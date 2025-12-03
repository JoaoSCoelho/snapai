import { ReactNode } from "react";
import { Field, FieldPartialInfoSchema, FieldSchema } from "./Field";
import z from "zod";

export type CheckboxFieldSchema = FieldSchema & {};

export class CheckboxField extends Field {
  private constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly disabled: boolean = false,
    info: FieldPartialInfoSchema,
  ) {
    super(name, label, occupedColumns, schema, true, disabled, info);
  }

  public static create(
    field: Omit<CheckboxFieldSchema, "info" | "required"> & {
      info: FieldPartialInfoSchema;
    },
  ) {
    return new CheckboxField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.disabled,
      field.info,
    );
  }
}
