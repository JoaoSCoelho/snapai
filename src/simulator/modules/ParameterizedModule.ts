import EventEmitter from "node:events";
import { ParametersSubsection } from "../configurations/layout/ParametersSubsection";
import { DefaultEventMap, EventMap } from "../utils/types";

export abstract class ParameterizedModule<
  T extends EventMap<T> = DefaultEventMap,
> extends EventEmitter<T> {
  /**
   * **Child classes should implements this static method to get the parameters subsection layout.**
   *
   * Returns the ParametersSubsection of the class, if it exists.
   * This subsection contains the parameters of the class.
   * @returns The ParametersSubsection of the class, if it exists. Otherwise, undefined.
   */
  public static getParametersSubsection(): ParametersSubsection | undefined {
    return undefined;
  }
}
