import { ReactNode } from "react";
import z from "zod";
import { Field, FieldSchema } from "./Field";

export type NodeSelectFieldSchema = FieldSchema & {};

export class NodeSelectField extends Field {
  private constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    info: { title: string; helpText?: ReactNode },
  ) {
    super(name, label, occupedColumns, schema, required, info);
  }

  public static create(
    field: Omit<NodeSelectFieldSchema, "info"> & {
      info: { title: string; helpText?: ReactNode };
    },
  ) {
    return new NodeSelectField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.info,
    );
  }
}
