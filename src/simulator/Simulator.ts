import { DefaultProject } from "./defaults/DefaultProject";
import { ConcreteMessageTransmissionModel } from "./models/MessageTransmissionModel";
import { Project } from "./models/Project";
import { Simulation } from "./models/Simulation";
import { SynchronousSimulation } from "./models/SynchronousSimulation";
import { PingPongProject } from "./projects/PingPong/PingPongProject";
import { TestProject } from "./projects/TestProject/TestProject";
import { ModelType } from "./utils/modelsUtils";
import { SearchEngine } from "./utils/SearchEngine";

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

  /**
   * Initializes a simulation based on the given project.
   *
   * @template Sync If true, the simulation will be synchronous.
   * @param {string | Project} project The project to use for the simulation.
   * @returns {Sync extends true ? SynchronousSimulation : Simulation} The initialized simulation.
   * @throws {Error} If the message transmission model is not found.
   */
  public initSimulation<Sync extends boolean>(
    project: string | Project,
  ): Sync extends true ? SynchronousSimulation : Simulation {
    if (typeof project === "string")
      project = SearchEngine.getProjectByName(project);

    const isAsyncMode = project.simulationConfig.getIsAsynchronous();

    let simulation: Simulation | null = null;

    if (isAsyncMode) {
      // Not implemented yet
    } else {
      const MessageTransmissionModelType = SearchEngine.findGenericModel(
        project.simulationConfig.getMessageTransmissionModel(),
        ModelType.MessageTransmission,
      ) as ConcreteMessageTransmissionModel | undefined;

      if (!MessageTransmissionModelType)
        throw new Error(
          'Message transmission model "' +
            project.simulationConfig.getMessageTransmissionModel() +
            '" not found.',
        );

      const messageTransmissionModel = new MessageTransmissionModelType(
        project.simulationConfig.getMessageTransmissionModelParameters(),
        undefined,
      );

      simulation = new SynchronousSimulation({
        messageTransmissionModel,
        project,
        loggerOptions: {
          useConsole: project.simulationConfig.getLoggerOptions().useConsole,
        },
      });

      messageTransmissionModel.setSimulation(simulation);
    }

    if (!simulation) throw new Error("Simulation not initialized.");

    if (!project.checkRequirementsOnInitializing())
      throw new Error("Project requirements not met.");

    return simulation as Sync extends true ? SynchronousSimulation : Simulation;
  }
}

export const simulator = Simulator.getInstance();
