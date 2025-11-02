import { Config } from "../Config";
import { simulatorConfigLayout } from "./simulatorConfigLayout";
import {
  SimulatorConfigSchema,
  simulatorConfigSchema,
} from "./simulatorConfigSchema";

export class SimulatorConfig extends Config {
  private static instance: SimulatorConfig;

  public readonly validatorSchema = simulatorConfigSchema;
  public readonly layout = simulatorConfigLayout;

  private readonly projectsPath = "src/simulator/projects";
  private readonly defaultsPath = "src/simulator/defaults";
  private readonly modelsPath = "src/simulator/models";

  private constructor() {
    super();
    const parsed = simulatorConfigSchema.strict().safeParse(this.toJSON());
    if (parsed.error)
      throw new Error("Error parsing SimulatorConfig", parsed.data);
  }

  public static getInstance(): SimulatorConfig {
    if (!SimulatorConfig.instance) {
      SimulatorConfig.instance = new SimulatorConfig();
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

  public toJSON(): SimulatorConfigSchema {
    return {
      projectsPath: this.projectsPath,
      defaultsPath: this.defaultsPath,
      modelsPath: this.modelsPath,
    };
  }
}
