import { Config } from "../Config";
import { simulationConfigLayout } from "./simulationConfigLayout";
import {
  LoggerOptionsSchema,
  SimulationConfigSchema,
  simulationConfigSchema,
} from "./simulationConfigSchema";

export const defaultSimulationConfig: Partial<SimulationConfigSchema> = {
  simulationName: "default",
  connectivityEnabled: false,
  dimX: [0, 0],
  dimY: [0, 0],
  dimZ: [0, 0],
  loggerOptions: {
    useConsole: false,
  },
  isAsynchronous: false,
  shouldSaveTrace: false,
  registerStatisticsForEveryRound: false,
  nackMessagesEnabled: false,
  interferenceEnabled: false,
  interferenceIsAdditive: false,
  messageTransmissionModel: "default:ConstantTime",
  messageTransmissionModelParameters: {},
};

export class SimulationConfig extends Config<
  typeof simulationConfigSchema,
  SimulationConfigSchema
> {
  public constructor(configJsonFilePath: string, data: SimulationConfigSchema) {
    super(
      configJsonFilePath,
      data,
      simulationConfigLayout,
      simulationConfigSchema,
      defaultSimulationConfig,
    );
  }

  public get simulationName(): string {
    return this.data.simulationName;
  }

  public get dimX(): [number, number] {
    return this.data.dimX;
  }

  public get dimY(): [number, number] {
    return this.data.dimY;
  }

  public get dimZ(): [number, number] {
    return this.data.dimZ;
  }

  public get loggerOptions(): LoggerOptionsSchema {
    return this.data.loggerOptions;
  }

  public get isAsynchronous(): boolean {
    return this.data.isAsynchronous;
  }

  public get shouldSaveTrace(): boolean {
    return this.data.shouldSaveTrace;
  }

  public get registerStatisticsForEveryRound(): boolean {
    return this.data.registerStatisticsForEveryRound;
  }

  public get nackMessagesEnabled(): boolean {
    return this.data.nackMessagesEnabled;
  }

  public get connectivityEnabled(): boolean {
    return this.data.connectivityEnabled;
  }

  public get interferenceEnabled(): boolean {
    return this.data.interferenceEnabled;
  }

  public get interferenceIsAdditive(): boolean {
    return this.data.interferenceIsAdditive;
  }

  public get messageTransmissionModel(): string {
    return this.data.messageTransmissionModel;
  }

  public get messageTransmissionModelParameters(): Record<string, any> {
    return this.data.messageTransmissionModelParameters;
  }

  public getSimulationName(): string {
    return this.data.simulationName;
  }

  public getDimX(): [number, number] {
    return this.data.dimX;
  }

  public getDimY(): [number, number] {
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
      dimZ: this.data.dimZ,
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
