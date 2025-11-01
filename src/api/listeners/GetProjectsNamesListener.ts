import { ModulesSearchEngine } from "../systems/ModulesSearchEngine/ModulesSearchEngine";
import { Listener } from "./Listener";

export class GetProjectsNamesListener extends Listener {
  public constructor(private modulesSearchEngine: ModulesSearchEngine) {
    super("getProjectsNames");
  }

  /**
   * Executes the listener and returns a list of all projects found in environment.
   * @returns A list of project names.
   */
  public async exec(): Promise<string[]> {
    return this.modulesSearchEngine.getProjectsNames();
  }
}
