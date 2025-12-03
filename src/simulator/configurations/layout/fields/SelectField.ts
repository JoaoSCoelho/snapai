import z from "zod";
import { Field, FieldPartialInfoSchema, FieldSchema } from "./Field";

export type SelectFieldOption = { value: string | number; label: string };

export type SelectFieldSchema = FieldSchema & {
  options: SelectFieldOption[] | (() => SelectFieldOption[]);
};

export class SelectField extends Field {
  protected constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly options: SelectFieldOption[] | (() => SelectFieldOption[]),
    public readonly disabled: boolean = false,
    info: FieldPartialInfoSchema,
  ) {
    super(name, label, occupedColumns, schema, required, disabled, info);
  }

  public static create(
    field: Omit<SelectFieldSchema, "info"> & {
      info: FieldPartialInfoSchema;
    },
  ) {
    return new SelectField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.options,
      field.disabled,
      field.info,
    );
  }
}
