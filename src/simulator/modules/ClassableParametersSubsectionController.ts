import { ParametersSubsection } from "../configurations/layout/ParametersSubsection";
import { ParameterizedModule } from "./ParameterizedModule";
import { ParametersSubsectionController } from "./ParametersSubsectionController";

export class ClassableParametersSubsectionController extends ParametersSubsectionController {
  public constructor(
    public readonly parameterizedModulesProvider: () => Map<
      string,
      typeof ParameterizedModule
    >,
  ) {
    super();
  }

  /**
   * Returns the ParametersSubsection of the ParameterizedModule with the given identifier.
   * If the ParameterizedModule with the given identifier does not exist, it will return undefined.
   * @param identifier The identifier of the ParameterizedModule to get the ParametersSubsection for.
   * @returns The ParametersSubsection of the ParameterizedModule with the given identifier, or undefined if the ParameterizedModule does not exist.
   */
  public getParametersSubsection(
    identifier: string,
  ): ParametersSubsection | undefined {
    const foundClass = this.parameterizedModulesProvider().get(identifier);

    if (!foundClass) throw new Error(`Class ${identifier} not found`);

    return foundClass.getParametersSubsection();
  }
}
