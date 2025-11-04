import { ModelParametersSubsection } from "../configurations/layout/ModelParametersSubsection";
import { ModelType } from "../utils/types";
import { Module } from "./Module";

export abstract class Model extends Module {
  public static readonly type: ModelType;

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
