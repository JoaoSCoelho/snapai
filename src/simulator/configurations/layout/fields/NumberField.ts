import { ReactNode } from "react";
import { Field, FieldSchema } from "./Field";
import z from "zod";

export type NumberFieldSchema = FieldSchema & {
  min: number;
  max: number;
  isFloat: boolean;
};

export class NumberField extends Field {
  protected constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly min: number,
    public readonly max: number,
    public readonly isFloat: boolean,
    info: { title: ReactNode; helpText?: ReactNode },
  ) {
    super(name, label, occupedColumns, schema, required, info);
  }

  public static create(
    field: Omit<NumberFieldSchema, "info" | "min" | "max"> & {
      min?: number;
      max?: number;
      info: { title: ReactNode; helpText?: ReactNode };
    },
  ) {
    return new NumberField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.min ?? -Infinity,
      field.max ?? Infinity,
      field.isFloat,
      field.info,
    );
  }
}
