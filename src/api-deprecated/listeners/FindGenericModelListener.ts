import { ModelType } from "@/simulator/utils/modelsUtils";
import { ModulesSearchEngine } from "../systems/ModulesSearchEngine/ModulesSearchEngine";
import { Listener } from "./Listener";
import { Model } from "@/simulator/models/Model";

export class FindGenericModelListener extends Listener {
  public constructor(private modulesSearchEngine: ModulesSearchEngine) {
    super("findGenericModel");
  }

  /**
   * Executes the findGenericModel transaction.
   * @param _transactionId - The transaction id.
   * @param data - An array containing the model identifier and the model type.
   * @returns A promise that resolves to the generic model class.
   */
  public async exec(
    _transactionId: string,
    data: [string, ModelType],
  ): Promise<typeof Model> {
    const [modelIdentifier, modelType] = data;
    return await this.modulesSearchEngine.findGenericModel(
      modelIdentifier,
      modelType,
    );
  }
}
