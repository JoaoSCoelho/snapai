import { Api } from "@/api/Api";
import { Simulation } from "./Simulation";

export class SimulationLogger {
  public constructor(
    private useConsole: boolean = true,
    private simulation: Simulation,
  ) {}

  public init(simulation: Simulation): void {
    this.simulation = simulation;
  }

  public log(message: string): void {
    Api.appendSimulationLogListener({
      simulationId: this.simulation.id,
      project: this.simulation.project.name,
      content: message,
    }).then((success) => {
      if (!success) console.warn("Failed to append log to simulation log.");
    });
    if (this.useConsole) console.log(message);
  }
}
