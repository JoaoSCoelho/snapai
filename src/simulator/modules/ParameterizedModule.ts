import { ParametersSubsection } from "../configurations/layout/ParametersSubsection";

export abstract class ParameterizedModule {
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
