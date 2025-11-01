import { ReactNode } from "react";
import z from "zod";
import { Field, FieldSchema } from "./Field";

export type SelectFieldSchema = FieldSchema & {
  options: { value: any; label: string }[];
};

export class SelectField extends Field {
  protected constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly options: { value: any; label: string }[],
    info: { title: ReactNode; helpText?: ReactNode },
  ) {
    super(name, label, occupedColumns, schema, required, info);
  }

  public static create(
    field: Omit<SelectFieldSchema, "info"> & {
      info: { title: ReactNode; helpText?: ReactNode };
    },
  ) {
    return new SelectField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.options,
      field.info,
    );
  }
}
