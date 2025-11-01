import { SimulationConfig } from "../configurations/Simulation/SimulationConfig";
import { Message } from "./Message";
import { Model } from "./Model";
import { Node } from "./Node";
import { Timer } from "./Timer";

export type ProjectSchema = {
  name: string;
  simulationConfig: SimulationConfig;
  models: Map<string, typeof Model>;
  nodes: Map<string, typeof Node>;
  messages: Map<string, typeof Message>;
  timers: Map<string, typeof Timer>;
};

export abstract class Project {
  protected constructor(
    public readonly name: string,
    public readonly simulationConfig: SimulationConfig,
    public readonly models: Map<string, Model>,
    public readonly nodes: Map<string, Node>,
    public readonly messages: Map<string, Message>,
    public readonly timers: Map<string, Timer>,
  ) {}
}
