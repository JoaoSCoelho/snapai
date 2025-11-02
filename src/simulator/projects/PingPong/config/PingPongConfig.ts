import { ProjectConfig } from "@/simulator/configurations/Project/ProjectConfig";
import { pingPongConfigLayout } from "./pingPongConfigLayout";
import {
  pingPongConfigSchema,
  PingPongConfigSchema,
} from "./pingPongConfigSchema";

export class PingPongConfig extends ProjectConfig {
  public readonly layout = pingPongConfigLayout;
  public readonly validatorSchema = pingPongConfigSchema;

  protected innerToJSON(): PingPongConfigSchema {
    return {};
  }
}
