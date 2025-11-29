import { DefaultProject } from "./defaults/DefaultProject";
import { Project } from "./models/Project";
import { PingPongProject } from "./projects/PingPong/PingPongProject";
import { TestProject } from "./projects/TestProject/TestProject";

export class Simulator {
  public static readonly inited = false;

  private static instance: Simulator;
  public projects: Map<string, Project> = new Map();

  private constructor() {}

  public addProject(project: Project): void {
    this.projects.set(project.name, project);
  }

  private init() {
    this.addProject(DefaultProject.create());
    this.addProject(PingPongProject.create());
    this.addProject(TestProject.create());
    // @ts-ignore
    Simulator.inited = true;
  }

  public static getInstance(): Simulator {
    if (!Simulator.instance) {
      const simulator = new Simulator();
      simulator.init();
      Simulator.instance = simulator;
    }
    return Simulator.instance;
  }
}

export const simulator = Simulator.getInstance();
