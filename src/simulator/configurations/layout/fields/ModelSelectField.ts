import { ReactNode } from "react";
import z from "zod";
import { Field, FieldPartialInfoSchema, FieldSchema } from "./Field";
import { ModelType } from "@/simulator/utils/modelsUtils";
import {
  ParameterizedSelectField,
  ParameterizedSelectFieldSchema,
} from "./ParameterizedSelectField";
import { SearchEngine } from "@/simulator/utils/SearchEngine";

export type ModelSelectFieldSchema = ParameterizedSelectFieldSchema & {
  modelType: ModelType;
};

export class ModelSelectField extends ParameterizedSelectField {
  private constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly modelType: ModelType,
    public readonly disabled: boolean = false,
    info: FieldPartialInfoSchema,
  ) {
    super(
      name,
      label,
      occupedColumns,
      schema,
      required,
      () => {
        return SearchEngine.getPrefixedModelsNames(modelType).map(
          (modelPrefixedName) => ({
            value: modelPrefixedName,
            label: modelPrefixedName,
          }),
        );
      },
      disabled,
      info,
    );
  }

  public static create(
    field: Omit<ModelSelectFieldSchema, "info" | "options" | "modelType"> & {
      info: FieldPartialInfoSchema;
    },
    complement: Pick<ModelSelectFieldSchema, "modelType">,
  ) {
    return new ModelSelectField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      complement.modelType,
      field.disabled,
      field.info,
    );
  }
}
