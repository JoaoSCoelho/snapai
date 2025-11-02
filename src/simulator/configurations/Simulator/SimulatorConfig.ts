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

  public readonly validatorSchema = simulatorConfigSchema;
  public readonly layout = simulatorConfigLayout;

  private readonly projectsPath = "src/simulator/projects";
  private readonly defaultsPath = "src/simulator/defaults";
  private readonly modelsPath = "src/simulator/models";

  public constructor(
    configJsonFilePath: string,
    populateData: z.infer<typeof simulatorConfigSchema>,
  ) {
    super(configJsonFilePath, populateData);
    this.parse(populateData);
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
    return this.projectsPath;
  }

  public getDefaultsPath(): string {
    return this.defaultsPath;
  }

  public getModelsPath(): string {
    return this.modelsPath;
  }

  protected innerToJSON(): SimulatorConfigSchema {
    return {
      projectsPath: this.projectsPath,
      defaultsPath: this.defaultsPath,
      modelsPath: this.modelsPath,
    };
  }
}
