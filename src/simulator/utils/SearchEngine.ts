import { simulator } from "..";
import { Model } from "../models/Model";
import { Project } from "../models/Project";
import { ModelType } from "./types";

export class SearchEngine {
  /**
   * Returns a list of prefixed models names.
   * If modelType is provided, it will return a list of names of all models of that type,
   * prefixed with the project name.
   * Otherwise, it will return a list of names of all models found in the simulator environment,
   * prefixed with the project name.
   *
   * @param modelType The type of models to be returned. If not provided, all models are returned.
   * @returns A list of names of all models found in the simulator environment, prefixed with the project name. I.e. `projectName:modelName`.
   */
  public static getPrefixedModelsNames(modelType?: ModelType): string[] {
    if (modelType)
      return simulator.projects
        .values()
        .flatMap((p) =>
          p.models
            .entries()
            .filter(([, m]) => m.type === modelType)
            .map(([k]) => `${p.name}:${k}`),
        )
        .toArray();
    else
      return simulator.projects
        .values()
        .flatMap((p) => p.models.keys().map((k) => `${p.name}:${k}`))
        .toArray();
  }

  /**
   * Returns a list of names of all nodes found in the simulator environment, prefixed with the project name. I.e. `projectName:nodeName`.
   * @returns A list of names of all nodes found in the simulator environment, prefixed with the project name.
   */
  public static getPrefixedNodesNames(): string[] {
    return simulator.projects
      .values()
      .flatMap((p) => p.nodes.keys().map((k) => `${p.name}:${k}`))
      .toArray();
  }

  /**
   * Returns a map of models found in the simulator environment, prefixed with the project name.
   * If modelType is provided, it will return a map of names of all models of that type,
   * prefixed with the project name.
   * Otherwise, it will return a map of names of all models found in the simulator environment,
   * prefixed with the project name. I.e. `projectName:modelName`.
   *
   * @param modelType The type of models to be returned. If not provided, all models are returned.
   * @returns A map of names of all models found in the simulator environment, prefixed with the project name.
   */
  public static getPrefixedMapOfModels(modelType?: ModelType) {
    if (modelType) {
      return new Map(
        simulator.projects
          .values()
          .flatMap((p) =>
            p.models
              .entries()
              .filter(([, m]) => m.type === modelType)
              .map(([k, v]) => [`${p.name}:${k}`, v]),
          )
          .toArray() as [`${string}:${string}`, typeof Model][],
      );
    } else {
      return new Map(
        simulator.projects
          .values()
          .flatMap((p) =>
            p.models.entries().map(([k, v]) => [`${p.name}:${k}`, v]),
          )
          .toArray() as [`${string}:${string}`, typeof Model][],
      );
    }
  }

  /**
   * Returns the project with the given name.
   * @throws {Error} If the project was not found.
   * @param {string} name The name of the project to be returned.
   * @returns {Project} The project with the given name.
   */
  public static getProjectByName(name: string): Project {
    const project = simulator.projects.get(name);
    if (!project) throw new Error('Project "' + name + '" not found.');
    return project;
  }

  /**
   * @throws
   * ModelNotFoundError if the generic model implementation was not found.
   * @returns
   * The generic model class to be instantiated, or undefined if the model was not found.
   */
  public static findGenericModel(
    modelIdentifier: string,
    modelType: ModelType,
  ): typeof Model | undefined {
    return this.getPrefixedMapOfModels(modelType).get(
      modelIdentifier as `${string}:${string}`,
    );
  }
}
