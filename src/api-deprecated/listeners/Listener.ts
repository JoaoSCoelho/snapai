import { ModulesSearchEngine } from "../systems/ModulesSearchEngine/ModulesSearchEngine";

export abstract class Listener {
  public constructor(public readonly name: string) {}

  public abstract exec(transactionId: string, data: any): Promise<any>;
}
