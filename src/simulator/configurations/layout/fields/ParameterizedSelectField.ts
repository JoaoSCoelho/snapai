import z from "zod";
import { Field, FieldPartialInfoSchema } from "./Field";
import {
  SelectField,
  SelectFieldOption,
  SelectFieldSchema,
} from "./SelectField";

export type ParameterizedSelectFieldSchema = SelectFieldSchema & {};

export class ParameterizedSelectField extends SelectField {
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
    field: Omit<ParameterizedSelectFieldSchema, "info"> & {
      info: FieldPartialInfoSchema;
    },
    /** This args is to be able to pass more information in child classes */
    ...args: any
  ) {
    return new ParameterizedSelectField(
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
