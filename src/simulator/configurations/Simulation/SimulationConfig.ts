import z from "zod";
import { Config } from "../Config";
import { simulationConfigLayout } from "./simulationConfigLayout";
import {
  LoggerOptionsSchema,
  SimulationConfigSchema,
  simulationConfigSchema,
} from "./simulationConfigSchema";

export class SimulationConfig extends Config {
  public constructor(
    public readonly configJsonFilePath: string,
    public readonly data: z.infer<typeof simulationConfigSchema>,
  ) {
    super(
      configJsonFilePath,
      data,
      simulationConfigLayout,
      simulationConfigSchema,
    );
  }

  public getSimulationName(): string {
    return this.data.simulationName;
  }

  public getDimX(): number[] {
    return this.data.dimX;
  }

  public getDimY(): number[] {
    return this.data.dimY;
  }

  public getLoggerOptions(): LoggerOptionsSchema {
    return this.data.loggerOptions;
  }

  public getIsAsynchronous(): boolean {
    return this.data.isAsynchronous;
  }

  public getShouldSaveTrace(): boolean {
    return this.data.shouldSaveTrace;
  }

  public getRegisterStatisticsForEveryRound(): boolean {
    return this.data.registerStatisticsForEveryRound;
  }

  public getNackMessagesEnabled(): boolean {
    return this.data.nackMessagesEnabled;
  }

  public getConnectivityEnabled(): boolean {
    return this.data.connectivityEnabled;
  }

  public getInterferenceEnabled(): boolean {
    return this.data.interferenceEnabled;
  }

  public getInterferenceIsAdditive(): boolean {
    return this.data.interferenceIsAdditive;
  }

  public getMessageTransmissionModel(): string {
    return this.data.messageTransmissionModel;
  }

  public getMessageTransmissionModelParameters(): Record<string, any> {
    return this.data.messageTransmissionModelParameters;
  }

  protected innerToJSON(): SimulationConfigSchema {
    return {
      simulationName: this.data.simulationName,
      dimX: this.data.dimX,
      dimY: this.data.dimY,
      loggerOptions: this.data.loggerOptions,
      isAsynchronous: this.data.isAsynchronous,
      shouldSaveTrace: this.data.shouldSaveTrace,
      registerStatisticsForEveryRound:
        this.data.registerStatisticsForEveryRound,
      nackMessagesEnabled: this.data.nackMessagesEnabled,
      connectivityEnabled: this.data.connectivityEnabled,
      interferenceEnabled: this.data.interferenceEnabled,
      interferenceIsAdditive: this.data.interferenceIsAdditive,
      messageTransmissionModel: this.data.messageTransmissionModel,
      messageTransmissionModelParameters:
        this.data.messageTransmissionModelParameters,
    };
  }
}
