import { v4 as uuidv4 } from "uuid";
import { SimulationLogger } from "./SimulationLogger";
import { Project } from "./Project";
import { SimulationStatistics } from "./SimulationStatistics";
import { MessageTransmissionModel } from "./MessageTransmissionModel";

export type SimulationOptions = {
  loggerOptions?: { useConsole: boolean };
  project: Project;

  messageTransmissionModel: MessageTransmissionModel;
};

export abstract class Simulation {
  public id: string;
  public isRunnig: boolean = false;
  public abstract isAsyncMode: boolean;
  public startTime: Date | null = null;
  public project: Project;
  public logger: SimulationLogger;
  public abstract statistics: SimulationStatistics;
  public currentTime: number = 0;
  public messageTransmissionModel: MessageTransmissionModel;

  public constructor({
    loggerOptions,
    project,
    messageTransmissionModel,
  }: SimulationOptions) {
    this.id = uuidv4();
    this.project = project;
    this.logger = new SimulationLogger(loggerOptions?.useConsole, this);
    this.messageTransmissionModel = messageTransmissionModel;
  }
}
