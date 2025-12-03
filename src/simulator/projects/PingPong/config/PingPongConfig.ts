import { ProjectConfig } from "@/simulator/configurations/Project/ProjectConfig";
import { pingPongConfigLayout } from "./pingPongConfigLayout";
import {
  pingPongConfigSchema,
  PingPongConfigSchema,
} from "./pingPongConfigSchema";

export const pingPongDefaultConfig: PingPongConfigSchema = {
  initialColor: "",
};

export class PingPongConfig extends ProjectConfig<
  typeof pingPongConfigSchema,
  PingPongConfigSchema
> {
  public constructor(configJsonFilePath: string, data: PingPongConfigSchema) {
    super(
      configJsonFilePath,
      data,
      pingPongConfigLayout,
      pingPongConfigSchema,
      pingPongDefaultConfig,
    );
  }

  protected innerToJSON(): PingPongConfigSchema {
    return {
      initialColor: this.data.initialColor,
    };
  }
}
