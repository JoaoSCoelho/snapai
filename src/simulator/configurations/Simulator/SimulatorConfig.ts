import { Config } from "../Config";
import { simulatorConfigLayout } from "./simulatorConfigLayout";
import {
  SimulatorConfigSchema,
  simulatorConfigSchema,
} from "./simulatorConfigSchema";
import jsonConfig from "./simulatorConfig.json";
import z from "zod";

export class SimulatorConfig extends Config {
  private static instance: SimulatorConfig;

  public constructor(
    public readonly configJsonFilePath: string,
    public readonly data: z.infer<typeof simulatorConfigSchema>,
  ) {
    super(
      configJsonFilePath,
      data,
      simulatorConfigLayout,
      simulatorConfigSchema,
    );
  }

  public static getInstance(): SimulatorConfig {
    if (!SimulatorConfig.instance) {
      SimulatorConfig.instance = new SimulatorConfig(
        "src/simulator/configurations/Simulator/simulatorConfig.json",
        jsonConfig as SimulatorConfigSchema,
      );
    }
    return SimulatorConfig.instance;
  }

  public getProjectsPath(): string {
    return this.data.projectsPath;
  }

  public getDefaultsPath(): string {
    return this.data.defaultsPath;
  }

  public getModelsPath(): string {
    return this.data.modelsPath;
  }

  protected innerToJSON(): SimulatorConfigSchema {
    return {
      projectsPath: this.data.projectsPath,
      defaultsPath: this.data.defaultsPath,
      modelsPath: this.data.modelsPath,
    };
  }
}
