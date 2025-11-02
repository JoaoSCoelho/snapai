import { ReactNode } from "react";
import { Field, FieldSchema } from "./Field";
import z from "zod";

export type NumberPairFieldSchema = FieldSchema & {
  minLeft: number;
  maxLeft: number;
  minRight: number;
  maxRight: number;
  isFloat: boolean;
};

export class NumberPairField extends Field {
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
    info: { title: string; helpText?: ReactNode },
  ) {
    super(name, label, occupedColumns, schema, required, info);
  }

  public static create(
    field: Omit<
      NumberPairFieldSchema,
      "info" | "minLeft" | "maxLeft" | "minRight" | "maxRight"
    > & {
      minLeft?: number;
      maxLeft?: number;
      minRight?: number;
      maxRight?: number;
      info: { title: string; helpText?: ReactNode };
    },
  ) {
    return new NumberPairField(
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
      field.info,
    );
  }
}
