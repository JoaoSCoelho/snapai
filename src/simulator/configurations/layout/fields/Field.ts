import { ReactNode } from "react";
import z from "zod";

export type FieldSchema = {
  name: string;
  label: string;
  occupedColumns: number;
  schema: z.ZodType;
  required: boolean;
  info: {
    title: string;
    helpText: ReactNode;
  };
};

export abstract class Field {
  public readonly info: {
    title: string;
    helpText: ReactNode;
  };

  protected constructor(
    public readonly name: string,
    public readonly label: string,
    public readonly occupedColumns: number,
    public readonly schema: z.ZodType,
    public readonly required: boolean,
    info: { title: string; helpText?: ReactNode },
  ) {
    this.info = {
      helpText: info.helpText ?? info.title,
      ...info,
    };
  }
}
