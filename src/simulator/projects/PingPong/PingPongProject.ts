import { Project } from "@/simulator/models/Project";
import { SimulationConfig } from "@/simulator/configurations/Simulation/SimulationConfig";
import { PingPongMobilityModel } from "./models/PingPongMobilityModel";
import simulationJsonConfig from "./config/simulationConfig.json";
import pingPongConfig from "./config/pingPongConfig.json";
import { SimulationConfigSchema } from "@/simulator/configurations/Simulation/simulationConfigSchema";
import { PingPongConfig } from "./config/PingPongConfig";
import { PingPongMessageTransmissionModel } from "./models/PingPongMessageTransmissionModel";

export class PingPongProject extends Project {
  protected constructor() {
    super(
      "PingPong",
      new SimulationConfig(
        "./src/simulator/projects/PingPong/config/simulationConfig.json",
        simulationJsonConfig as SimulationConfigSchema,
      ),
      new PingPongConfig(
        "./src/simulator/projects/PingPong/config/pingPongConfig.json",
        pingPongConfig,
      ),
    );

    this.addModel("PingPongMobilityModel", PingPongMobilityModel);
    this.addModel(
      "PingPongMessageTransmissionModel",
      PingPongMessageTransmissionModel,
    );
  }

  public static create(): PingPongProject {
    return new PingPongProject();
  }
}
