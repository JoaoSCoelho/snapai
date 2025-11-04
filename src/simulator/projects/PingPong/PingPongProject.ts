import { Project } from "@/simulator/models/Project";
import { SimulationConfig } from "@/simulator/configurations/Simulation/SimulationConfig";
import { PingPongMobilityModel } from "./models/PingPongMobilityModel";
import simulationJsonConfig from "./config/simulationConfig.json";
import { SimulationConfigSchema } from "@/simulator/configurations/Simulation/simulationConfigSchema";

export class PingPongProject extends Project {
  protected constructor() {
    super(
      "PingPong",
      new SimulationConfig(
        "./src/simulator/projects/PingPong/config/simulationConfig.json",
        simulationJsonConfig as SimulationConfigSchema,
      ),
    );

    this.addModel("PingPongMobilityModel", PingPongMobilityModel);
  }

  public static create(): PingPongProject {
    return new PingPongProject();
  }
}
