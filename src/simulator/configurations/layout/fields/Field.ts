import { Global } from "@/simulator/Global";
import { ReactNode } from "react";
import z from "zod";

export type FieldPartialInfoSchema = {
  title: string;
  helpText?: ReactNode;
};

export type FieldInfoSchema = FieldPartialInfoSchema & {
  title: string;
  helpText: ReactNode;
};

export type FieldSchema = {
  name: string;
  label: string;
  occupedColumns: number;
  schema: z.ZodType;
  required: boolean;
  disabled?: boolean;
  info: FieldInfoSchema;
};

export abstract class Field {
  public readonly info: FieldInfoSchema;

  public readonly id = ++Global.lastId;

  protected constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    public readonly disabled: boolean = false,
    info: FieldPartialInfoSchema,
  ) {
    this.info = {
      helpText: info.helpText ?? info.title,
      ...info,
    };
  }
}
