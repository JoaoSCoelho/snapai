import { ParametersSubsection } from "../configurations/layout/ParametersSubsection";

export abstract class ParametersSubsectionController {
  public abstract getParametersSubsection(
    identifier: string,
  ): ParametersSubsection | undefined;
}
