import { ReactNode } from "react";
import z from "zod";
import { Field, FieldSchema } from "./Field";
import { ModelType } from "@/simulator/utils/types";

export type ModelSelectFieldSchema = FieldSchema & {
  modelType: ModelType;
};

export class ModelSelectField extends Field {
  private constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly modelType: ModelType,
    info: { title: string; helpText?: ReactNode },
  ) {
    super(name, label, occupedColumns, schema, required, info);
  }

  public static create(
    field: Omit<ModelSelectFieldSchema, "info"> & {
      info: { title: string; helpText?: ReactNode };
    },
  ) {
    return new ModelSelectField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.modelType,
      field.info,
    );
  }
}
