import { ProjectConfig } from "@/simulator/configurations/Project/ProjectConfig";
import { pingPongConfigLayout } from "./pingPongConfigLayout";
import {
  pingPongConfigSchema,
  PingPongConfigSchema,
} from "./pingPongConfigSchema";
import z from "zod";

export class PingPongConfig extends ProjectConfig {
  public constructor(
    public readonly configJsonFilePath: string,
    public readonly data: z.infer<typeof pingPongConfigSchema>,
  ) {
    super(configJsonFilePath, data, pingPongConfigLayout, pingPongConfigSchema);
  }

  protected innerToJSON(): PingPongConfigSchema {
    return {};
  }
}
