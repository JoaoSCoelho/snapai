import z from "zod";
import { Config } from "../Config";
import { simulationConfigLayout } from "./simulationConfigLayout";
import {
  SimulationConfigSchema,
  simulationConfigSchema,
} from "./simulationConfigSchema";

export class SimulationConfig extends Config {
  public readonly validatorSchema = simulationConfigSchema;
  public readonly layout = simulationConfigLayout;

  private simulationName = "default_simulation";
  private dimX: [number, number] = [0, 1000];
  private dimY: [number, number] = [0, 1000];
  private isAsynchronous = false;
  private shouldSaveTrace = false;
  private registerStatisticsForEveryRound = false;
  private nackMessagesEnabled = true;
  private connectivityEnabled = true;
  private interferenceEnabled = true;
  private messageTransmissionModel = "constant_time";
  private messageTransmissionModelParameters: Record<string, any> = {
    time: 1,
  };

  public constructor(
    configJsonFilePath: string,
    populateData: z.infer<typeof simulationConfigSchema>,
  ) {
    super(configJsonFilePath, populateData);
    this.parse(populateData);
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

  public getRegisterStatisticsForEveryRound(): boolean {
    return this.registerStatisticsForEveryRound;
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

  protected innerToJSON(): SimulationConfigSchema {
    return {
      simulationName: this.simulationName,
      dimX: this.dimX,
      dimY: this.dimY,
      isAsynchronous: this.isAsynchronous,
      shouldSaveTrace: this.shouldSaveTrace,
      registerStatisticsForEveryRound: this.registerStatisticsForEveryRound,
      nackMessagesEnabled: this.nackMessagesEnabled,
      connectivityEnabled: this.connectivityEnabled,
      interferenceEnabled: this.interferenceEnabled,
      messageTransmissionModel: this.messageTransmissionModel,
      messageTransmissionModelParameters:
        this.messageTransmissionModelParameters,
    };
  }
}
