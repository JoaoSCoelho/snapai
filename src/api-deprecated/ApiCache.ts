import { ExtendedModelType } from "@/simulator/utils/modelsUtils";

export class ApiCache {
  public readonly projectsNames: Set<string> = new Set();
  public readonly modelsNames: Map<ExtendedModelType, Set<string>> = new Map();

  public clear() {
    this.projectsNames.clear();
    this.modelsNames.clear();
  }

  /**
   * Sets the list of projects names in the cache.
   * @param {string[]} projectsNames The list of projects names to set.
   */
  public setProjectsNames(projectsNames: string[]) {
    this.projectsNames.clear();
    projectsNames.forEach((name) => this.projectsNames.add(name));
  }

  /**
   * Sets the list of models names for a given model type.
   * If modelType is "all", it will set the list of models names for all model types.
   * @param modelType The model type to set the list of models names for.
   * @param modelsNames The list of models names to set.
   */
  public setModelsNames(modelType: ExtendedModelType, modelsNames: string[]) {
    this.modelsNames.set(modelType, new Set(modelsNames));
  }
}
