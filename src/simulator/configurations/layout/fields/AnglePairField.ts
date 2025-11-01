import { ReactNode } from "react";
import z from "zod";
import { NumberPairField, NumberPairFieldSchema } from "./NumberPairField";
import { AngleUnit } from "@/simulator/utils/types";

export type AnglePairFieldSchema = NumberPairFieldSchema & {
  angleUnit: AngleUnit;
};

export class AnglePairField extends NumberPairField {
  protected constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly minLeft: number,
    public readonly maxLeft: number,
    public readonly minRight: number,
    public readonly maxRight: number,
    public readonly isFloat: boolean,
    public readonly angleUnit: AngleUnit,
    info: { title: ReactNode; helpText?: ReactNode },
  ) {
    super(
      name,
      label,
      occupedColumns,
      schema,
      required,
      minLeft,
      maxLeft,
      minRight,
      maxRight,
      isFloat,
      info,
    );
  }

  public static create(
    field: Omit<
      AnglePairFieldSchema,
      "info" | "minLeft" | "maxLeft" | "minRight" | "maxRight"
    > & {
      minLeft?: number;
      maxLeft?: number;
      minRight?: number;
      maxRight?: number;
      info: { title: ReactNode; helpText?: ReactNode };
    },
  ) {
    return new AnglePairField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.minLeft ?? -Infinity,
      field.maxLeft ?? Infinity,
      field.minRight ?? -Infinity,
      field.maxRight ?? Infinity,
      field.isFloat,
      field.angleUnit,
      field.info,
    );
  }
}
