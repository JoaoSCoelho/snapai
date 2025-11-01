import { SimulationConfig } from "../configurations/Simulation/SimulationConfig";
import { Message } from "./Message";
import { Model } from "./Model";
import { Node } from "./Node";

export type ProjectSchema = {
  name: string;
  simulationConfig: SimulationConfig;
  models: Map<string, Model>;
  nodes: Map<string, Node>;
  messages: Map<string, Message>;
  timers: Map<string, Timer>;
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
