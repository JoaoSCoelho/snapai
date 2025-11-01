import { ModulesSearchEngine } from "../systems/ModulesSearchEngine/ModulesSearchEngine";
import { Listener } from "./Listener";

export class AppendSimulationLogListener extends Listener {
  public constructor() {
    super("appendSimulationLog");
  }

  public async exec(transactionId: string, data: any): Promise<any> {}
}
