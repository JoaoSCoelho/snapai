import { Project } from "./models/Project";

export class Simulator {
  public static readonly instance: Simulator = new Simulator();
  public projects: Map<string, Project> = new Map<string, Project>();

  private constructor() {}

  public addProject(project: Project): void {
    this.projects.set(project.name, project);
  }
}

export const simulator = Simulator.instance;
