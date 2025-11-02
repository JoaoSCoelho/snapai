import { ReactNode } from "react";
import z from "zod";
import { NumberField, NumberFieldSchema } from "./NumberField";
import { AngleUnit } from "@/simulator/utils/types";

export type AngleFieldSchema = NumberFieldSchema & {
  angleUnit: AngleUnit;
};

export class AngleField extends NumberField {
  private constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly min: number,
    public readonly max: number,
    public readonly isFloat: boolean,
    public readonly angleUnit: AngleUnit,
    info: { title: string; helpText?: ReactNode },
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
    field: Omit<AngleFieldSchema, "info" | "min" | "max"> & {
      min?: number;
      max?: number;
      info: { title: string; helpText?: ReactNode };
    },
  ) {
    return new AngleField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.min ?? -Infinity,
      field.max ?? Infinity,
      field.isFloat,
      field.angleUnit,
      field.info,
    );
  }
}
