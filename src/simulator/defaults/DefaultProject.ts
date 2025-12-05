import { SimulationConfig } from "../configurations/Simulation/SimulationConfig";
import { SimulationConfigSchema } from "../configurations/Simulation/simulationConfigSchema";
import { Packet232Bytes } from "./packets/Packet232Bytes";
import { Project } from "../models/Project";
import { UDGConnectivity } from "./connectivityModels/UDGConnectivity";
import jsonConfig from "./defaultConfig.json";
import { RandomDistribution } from "./distributionModels/RandomDistribution";
import { NoInterference } from "./interferenceModels/NoInterference";
import { ConstantTime } from "./messageTransmissionModels/ConstantTime";
import { RandomMobility } from "./mobilityModels/RandomMobility";
import { InertNode } from "./nodes/InertNode";
import { ReliableDelivery } from "./reliabilityModels/ReliableDelivery";
import { VariableBytesPacket } from "./packets/VariableBytesPacket";

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
    this.addModel("RandomMobility", RandomMobility);
    this.addModel("NoInterference", NoInterference);
    this.addModel("RandomDistribution", RandomDistribution);
    this.addModel("ReliableDelivery", ReliableDelivery);
    this.addModel("UDGConnectivity", UDGConnectivity);
    this.addPacket("232BytesPacket", Packet232Bytes);
    this.addPacket("VariableBytesPacket", VariableBytesPacket);
    this.addNode("InertNode", InertNode);
  }

  public static create(): DefaultProject {
    return new DefaultProject();
  }

  public checkRequirementsOnInitializing(): boolean {
    return true;
  }

  public async preRound(): Promise<void> {
    // Do nothing
  }

  public async postRound(): Promise<void> {
    // Do nothing
  }

  public async preRun(): Promise<void> {
    // Do nothing
  }

  public hasTerminated(): boolean {
    return false;
  }
}
