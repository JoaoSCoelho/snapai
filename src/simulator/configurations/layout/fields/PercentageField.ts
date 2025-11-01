import { ReactNode } from "react";
import z from "zod";
import { NumberField, NumberFieldSchema } from "./NumberField";

export type PercentageFieldSchema = NumberFieldSchema & {};

export class PercentageField extends NumberField {
  private constructor(
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
    super(
      name,
      label,
      occupedColumns,
      schema,
      required,
      min,
      max,
      isFloat,
      info,
    );
  }

  public static create(
    field: Omit<PercentageFieldSchema, "info" | "min" | "max"> & {
      min?: number;
      max?: number;
      info: { title: ReactNode; helpText?: ReactNode };
    },
  ) {
    return new PercentageField(
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
