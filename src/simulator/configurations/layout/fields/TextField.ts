import { ReactNode } from "react";
import { Field, FieldSchema } from "./Field";
import z from "zod";

export type TextFieldSchema = FieldSchema & {
  minLength: number;
  maxLength: number;
};

export class TextField extends Field {
  private constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly minLength: number,
    public readonly maxLength: number,
    info: { title: ReactNode; helpText?: ReactNode },
  ) {
    super(name, label, occupedColumns, schema, required, info);
  }

  public static create(
    field: Omit<TextFieldSchema, "info" | "minLength" | "maxLength"> & {
      minLength?: number;
      maxLength?: number;
      info: { title: ReactNode; helpText?: ReactNode };
    },
  ) {
    return new TextField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.minLength ?? 0,
      field.maxLength ?? Infinity,
      field.info,
    );
  }
}
