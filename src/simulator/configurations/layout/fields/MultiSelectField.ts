import z from "zod";
import {
  SelectField,
  SelectFieldOption,
  SelectFieldSchema,
} from "./SelectField";
import { FieldPartialInfoSchema } from "./Field";

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
    public readonly options: SelectFieldOption[] | (() => SelectFieldOption[]),
    public readonly minSelected: number,
    public readonly maxSelected: number,
    public readonly disabled: boolean = false,
    info: FieldPartialInfoSchema,
  ) {
    super(
      name,
      label,
      occupedColumns,
      schema,
      required,
      options,
      disabled,
      info,
    );
  }

  public static create(
    field: Omit<
      MultiSelectFieldSchema,
      "info" | "minSelected" | "maxSelected"
    > & {
      minSelected?: number;
      maxSelected?: number;
      info: FieldPartialInfoSchema;
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
      field.disabled,
      field.info,
    );
  }
}
