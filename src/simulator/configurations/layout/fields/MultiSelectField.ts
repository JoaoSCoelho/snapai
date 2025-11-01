import { ReactNode } from "react";
import z from "zod";
import { SelectField, SelectFieldSchema } from "./SelectField";

export type MultiSelectFieldSchema = SelectFieldSchema & {
  minSelected: number;
  maxSelected: number;
};

export class MultiSelectField extends SelectField {
  private constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly options: { value: any; label: string }[],
    public readonly minSelected: number,
    public readonly maxSelected: number,
    info: { title: ReactNode; helpText?: ReactNode },
  ) {
    super(name, label, occupedColumns, schema, required, options, info);
  }

  public static create(
    field: Omit<
      MultiSelectFieldSchema,
      "info" | "minSelected" | "maxSelected"
    > & {
      minSelected?: number;
      maxSelected?: number;
      info: { title: ReactNode; helpText?: ReactNode };
    },
  ) {
    return new MultiSelectField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.options,
      field.minSelected ?? 0,
      field.maxSelected ?? Infinity,
      field.info,
    );
  }
}
