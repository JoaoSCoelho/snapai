import { Config } from "../Config";
import { simulatorConfigLayout } from "./simulatorConfigLayout";
import {
  SimulatorConfigSchema,
  simulatorConfigSchema,
} from "./simulatorConfigSchema";
import jsonConfig from "./simulatorConfig.json";

export const simulatorDefaultConfig: SimulatorConfigSchema = {
  projectsPath: "src/simulator/projects",
  defaultsPath: "src/simulator/defaults",
  modelsPath: "src/simulator/models",
};

export class SimulatorConfig extends Config<
  typeof simulatorConfigSchema,
  SimulatorConfigSchema
> {
  private static instance: SimulatorConfig;

  public constructor(configJsonFilePath: string, data: SimulatorConfigSchema) {
    super(
      configJsonFilePath,
      data,
      simulatorConfigLayout,
      simulatorConfigSchema,
      simulatorDefaultConfig,
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
