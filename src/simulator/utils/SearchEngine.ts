import { simulator } from "..";
import { Model } from "../models/Model";
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

  public static getPrefixedNodesNames(): string[] {
    return simulator.projects
      .values()
      .flatMap((p) => p.nodes.keys().map((k) => `${p.name}:${k}`))
      .toArray();
  }

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
}
