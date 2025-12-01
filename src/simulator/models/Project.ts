import { ProjectConfig } from "../configurations/Project/ProjectConfig";
import { SimulationConfig } from "../configurations/Simulation/SimulationConfig";
import { Message } from "./Message";
import { Model } from "./Model";
import { Node } from "./Node";
import { Packet } from "./Packet";
import { Timer } from "./Timer";

export type ProjectSchema = {
  name: string;
  simulationConfig: SimulationConfig;
  projectConfig?: ProjectConfig;
  models: Map<string, typeof Model>;
  nodes: Map<string, typeof Node>;
  messages: Map<string, typeof Message>;
  timers: Map<string, typeof Timer>;
  packets: Map<string, typeof Packet>;
};

export abstract class Project {
  protected constructor(
    public readonly name: string,
    public readonly simulationConfig: SimulationConfig,
    public readonly projectConfig?: ProjectConfig,
    public readonly models: Map<string, typeof Model> = new Map(),
    public readonly nodes: Map<string, typeof Node> = new Map(),
    public readonly messages: Map<string, typeof Message> = new Map(),
    public readonly timers: Map<string, typeof Timer> = new Map(),
    public readonly packets: Map<string, typeof Packet> = new Map(),
  ) {}

  public addModel(modelName: string, modelCls: typeof Model): this {
    this.models.set(modelName, modelCls);
    return this;
  }

  public addNode(nodeName: string, nodeCls: typeof Node): this {
    this.nodes.set(nodeName, nodeCls);
    return this;
  }

  public addMessage(messageName: string, messageCls: typeof Message): this {
    this.messages.set(messageName, messageCls);
    return this;
  }

  public addTimer(timerName: string, timerCls: typeof Timer): this {
    this.timers.set(timerName, timerCls);
    return this;
  }

  public addPacket(packetName: string, packetCls: typeof Packet): this {
    this.packets.set(packetName, packetCls);
    return this;
  }

  /**
   * Checks if the project is ready to be initialized.\
   * Returns true if the project is ready to be initialized, false otherwise.\
   * **Should be implemented in child classes.**
   */
  public abstract checkRequirementsOnInitializing(): boolean;
}
