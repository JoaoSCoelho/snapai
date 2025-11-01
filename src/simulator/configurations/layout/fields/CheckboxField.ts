import { ReactNode } from "react";
import { Field, FieldSchema } from "./Field";
import z from "zod";

export type CheckboxFieldSchema = FieldSchema & {};

export class CheckboxField extends Field {
  private constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    info: { title: ReactNode; helpText?: ReactNode },
  ) {
    super(name, label, occupedColumns, schema, true, info);
  }

  public static create(
    field: Omit<CheckboxFieldSchema, "info" | "required"> & {
      info: { title: ReactNode; helpText?: ReactNode };
    },
  ) {
    return new CheckboxField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.info,
    );
  }
}
