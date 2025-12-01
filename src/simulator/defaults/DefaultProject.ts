import { SimulationConfig } from "../configurations/Simulation/SimulationConfig";
import { SimulationConfigSchema } from "../configurations/Simulation/simulationConfigSchema";
import { Packet232Bytes } from "../models/Packet232Bytes";
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
    );

    this.addModel("ConstantTime", ConstantTime);
    this.addPacket("232Bytes", Packet232Bytes);
  }

  public static create(): DefaultProject {
    return new DefaultProject();
  }

  public checkRequirementsOnInitializing(): boolean {
    return true;
  }
}
