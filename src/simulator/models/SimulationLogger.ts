import { Simulation } from "./Simulation";
import { prisma } from "@/api/prisma/client";

export class SimulationLogger {
  public constructor(
    private useConsole: boolean = true,
    private simulation: Simulation,
  ) {}

  public init(simulation: Simulation): void {
    this.simulation = simulation;
  }

  public log(message: string): void {
    prisma.simulationLog
      .create({
        data: {
          simulationId: this.simulation.id,
          project: this.simulation.project.name,
          content: message,
        },
      })
      .catch((error: any) => {
        console.warn("Failed to append log to simulation log.", error);
      });
    if (this.useConsole) console.log(message);
  }
}
