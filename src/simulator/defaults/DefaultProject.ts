import { SimulationConfig } from "../configurations/Simulation/SimulationConfig";
import { SimulationConfigSchema } from "../configurations/Simulation/simulationConfigSchema";
import { Project } from "../models/Project";
import jsonConfig from "./defaultConfig.json";
import { ConstantTime } from "./messageTransmissionModels/ConstantTime";

export class DefaultProject extends Project {
  protected constructor() {
    super(
      "default",
      new SimulationConfig(
        "./src/simulator/defaults/defaultConfig.json",
        jsonConfig as unknown as SimulationConfigSchema,
      ),
      undefined,
      new Map([["ConstantTime", ConstantTime]]),
      new Map(),
      new Map(),
      new Map(),
    );
  }

  public static create(): DefaultProject {
    return new DefaultProject();
  }
}
