import z, { ZodObject } from "zod";
import { Config } from "../Config";

export type GenericProjectConfig = ProjectConfig<ZodObject, z.infer<ZodObject>>;

export abstract class ProjectConfig<
  ZodSchema extends z.ZodObject,
  Schema extends z.infer<ZodSchema>,
> extends Config<ZodSchema, Schema> {}
