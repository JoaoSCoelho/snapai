import { NumberField } from "@/simulator/configurations/layout/fields/NumberField";
import { Line } from "@/simulator/configurations/layout/Line";
import { ParametersSubsection } from "@/simulator/configurations/layout/ParametersSubsection";
import { MessageTransmissionModel } from "@/simulator/models/MessageTransmissionModel";
import { Packet } from "@/simulator/models/Packet";
import { Simulation } from "@/simulator/models/Simulation";
import z from "zod";

export type ConstantTimeParameters = {
  time: number;
};

export class ConstantTime extends MessageTransmissionModel {
  constructor(
    protected readonly simulation: Simulation,
    public readonly parameters: ConstantTimeParameters,
  ) {
    super(simulation, parameters);
  }

  public timeToReach(packet: Packet): number {
    return this.parameters.time;
  }

  /**
   * Returns the ParametersSubsection of the model.
   * This subsection contains the parameters of the model, which are
   * used to configure the model.
   * @returns The ParametersSubsection of the model.
   */
  public static getParametersSubsection(): ParametersSubsection | undefined {
    return ParametersSubsection.create({
      lines: [
        new Line([
          NumberField.create({
            name: "time",
            label: "Time",
            isFloat: true,
            required: true,
            occupedColumns: 4,
            min: 1,
            schema: z.number().min(1),
            info: {
              title:
                "The time it takes for a packet to reach the destination node.",
            },
          }),
        ]),
      ],
    });
  }
}
