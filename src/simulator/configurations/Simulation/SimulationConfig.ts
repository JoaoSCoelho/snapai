import { Config } from "../Config";
import {
  SimulationConfigSchema,
  simulationConfigSchema,
} from "./SimulationConfigSchema";

export class SimulationConfig extends Config {
  private simulationName = "default_simulation";
  private dimX: [number, number] = [0, 1000];
  private dimY: [number, number] = [0, 1000];
  private isAsynchronous = false;
  private shouldSaveTrace = false;
  private nackMessagesEnabled = true;
  private connectivityEnabled = true;
  private interferenceEnabled = true;
  private messageTransmissionModel = "constant_time";
  private messageTransmissionModelParameters: Record<string, any> = {
    time: 1,
  };

  public constructor() {
    super();
    const parsed = simulationConfigSchema.strict().safeParse(this.toJSON());
    if (parsed.error)
      throw new Error("Error parsing SimulationConfig", parsed.data);
  }

  public getSimulationName(): string {
    return this.simulationName;
  }

  public getDimX(): number[] {
    return this.dimX;
  }

  public getDimY(): number[] {
    return this.dimY;
  }

  public getIsAsynchronous(): boolean {
    return this.isAsynchronous;
  }

  public getShouldSaveTrace(): boolean {
    return this.shouldSaveTrace;
  }

  public getNackMessagesEnabled(): boolean {
    return this.nackMessagesEnabled;
  }

  public getConnectivityEnabled(): boolean {
    return this.connectivityEnabled;
  }

  public getInterferenceEnabled(): boolean {
    return this.interferenceEnabled;
  }

  public getMessageTransmissionModel(): string {
    return this.messageTransmissionModel;
  }

  public getMessageTransmissionModelParameters(): Record<string, any> {
    return this.messageTransmissionModelParameters;
  }

  public toJSON(): SimulationConfigSchema {
    return {
      simulationName: this.simulationName,
      dimX: this.dimX,
      dimY: this.dimY,
      isAsynchronous: this.isAsynchronous,
      shouldSaveTrace: this.shouldSaveTrace,
      nackMessagesEnabled: this.nackMessagesEnabled,
      connectivityEnabled: this.connectivityEnabled,
      interferenceEnabled: this.interferenceEnabled,
      messageTransmissionModel: this.messageTransmissionModel,
      messageTransmissionModelParameters:
        this.messageTransmissionModelParameters,
    };
  }
}
