import z from "zod";
import { FieldPartialInfoSchema, FieldSchema } from "./Field";
import {
  ParameterizedSelectField,
  ParameterizedSelectFieldSchema,
} from "./ParameterizedSelectField";
import { SearchEngine } from "@/simulator/utils/SearchEngine";

export type NodeSelectFieldSchema = ParameterizedSelectFieldSchema & {};

export class NodeSelectField extends ParameterizedSelectField {
  protected constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
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
        return SearchEngine.getPrefixedNodesNames().map((nn) => ({
          value: nn,
          label: nn,
        }));
      },
      disabled,
      info,
    );
  }

  public static create(
    field: Omit<NodeSelectFieldSchema, "info" | "options"> & {
      info: FieldPartialInfoSchema;
    },
  ) {
    return new NodeSelectField(
      field.name,
      field.label,
      field.occupedColumns,
      field.schema,
      field.required,
      field.disabled,
      field.info,
    );
  }
}
