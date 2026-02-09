import { Field, FieldPartialInfoSchema, FieldSchema } from "./Field";
import z from "zod";

export type NumberTripleFieldSchema = FieldSchema & {
  minFirst: number;
  maxFirst: number;
  minMiddle: number;
  maxMiddle: number;
  minLast: number;
  maxLast: number;
  isFloat: boolean;
};

export class NumberTripleField extends Field {
  protected constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly minFirst: number,
    public readonly maxFirst: number,
    public readonly minMiddle: number,
    public readonly maxMiddle: number,
    public readonly minLast: number,
    public readonly maxLast: number,
    public readonly isFloat: boolean,
    public readonly disabled: boolean = false,
    info: FieldPartialInfoSchema,
  ) {
    super(name, label, occupedColumns, schema, required, disabled, info);
  }

  public static create(
    field: Omit<
      NumberTripleFieldSchema,
      | "info"
      | "minFirst"
      | "maxFirst"
      | "minMiddle"
      | "maxMiddle"
      | "minLast"
      | "maxLast"
    > & {
      minFirst?: number;
      maxFirst?: number;
      minMiddle?: number;
      maxMiddle?: number;
      minLast?: number;
      maxLast?: number;
      info: FieldPartialInfoSchema;
    },
  ) {
    return new NumberTripleField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.minFirst ?? -Infinity,
      field.maxFirst ?? Infinity,
      field.minMiddle ?? -Infinity,
      field.maxMiddle ?? Infinity,
      field.minLast ?? -Infinity,
      field.maxLast ?? Infinity,
      field.isFloat,
      field.disabled,
      field.info,
    );
  }
}
