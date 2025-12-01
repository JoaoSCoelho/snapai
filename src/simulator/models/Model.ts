import { ModelParametersSubsection } from "../configurations/layout/ModelParametersSubsection";
import { ModelType } from "../utils/modelsUtils";
import { Module } from "./Module";

export type ConcreteModel<T extends Model> = new (
  parameters: Record<string, any>,
) => T;

export abstract class Model extends Module {
  public static readonly type: ModelType;

  public constructor(public readonly parameters: Record<string, any>) {
    super();
  }

  /**
   * **Child classes should implements this static method to get the parameters subsection layout.**
   *
   * Returns the ModelParametersSubsection of the model, if it exists.
   * This subsection contains the parameters of the model, which are
   * used to configure the model.
   * @returns The ModelParametersSubsection of the model, if it exists. Otherwise, undefined.
   */
  public static getParametersSubsection():
    | ModelParametersSubsection
    | undefined {
    return undefined;
  }
}
