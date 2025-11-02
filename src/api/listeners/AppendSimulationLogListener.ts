import { AppendSimulationLogDto } from "../dtos/AppendSimulationLogDto";
import { prisma } from "../prisma/client.js";
import { Listener } from "./Listener";

export class AppendSimulationLogListener extends Listener {
  public constructor() {
    super("appendSimulationLog");
  }

  /**
   * Appends a log to the simulation log.
   * @param _transactionId Unique identifier for the transaction.
   * @param data The data to be appended to the simulation log.
   * @returns A promise that resolves to true if the log has been appended successfully, otherwise false.
   */
  public async exec(
    _transactionId: string,
    data: AppendSimulationLogDto,
  ): Promise<boolean> {
    try {
      await prisma.simulationLog.create({
        data: {
          simulationId: data.simulationId,
          project: data.project,
          content: data.content,
        },
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
