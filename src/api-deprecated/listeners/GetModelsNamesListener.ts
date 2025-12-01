import { ModelType } from "@/simulator/utils/modelsUtils";
import { ModulesSearchEngine } from "../systems/ModulesSearchEngine/ModulesSearchEngine";
import { Listener } from "./Listener";

export class GetModelsNamesListener extends Listener {
  public constructor(private modulesSearchEngine: ModulesSearchEngine) {
    super("getModelsNames");
  }

  /**
   * Executes the listener and returns a list of all models found in simulator environment.
   * If modelType is provided, it returns a list of names of all models of that type.
   * Otherwise, it returns a list of names of all models found in the simulator environment.
   * @param _transactionId Unique identifier for the transaction.
   * @param modelType Type of the models to be returned. If not provided, all models are returned.
   * @returns A list of names of all models found in the simulator environment.
   */
  public async exec(
    _transactionId: string,
    modelType?: ModelType,
  ): Promise<string[]> {
    return this.modulesSearchEngine.getModelsNames(modelType);
  }
}
