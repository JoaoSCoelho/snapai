import { NumberPairField } from "@/simulator/configurations/layout/fields/NumberPairField";
import { Line } from "@/simulator/configurations/layout/Line";
import { ParametersSubsection } from "@/simulator/configurations/layout/ParametersSubsection";
import { MessageTransmissionModel } from "@/simulator/models/MessageTransmissionModel";
import { Packet } from "@/simulator/models/Packet";
import { Simulation } from "@/simulator/models/Simulation";
import z from "zod";

export type RandomTimeParameters = {
  timeRange: [number, number];
};

export class RandomTime extends MessageTransmissionModel {
  public name = "Random Time";

  constructor(
    public readonly parameters: RandomTimeParameters,
    protected readonly simulation: Simulation,
  ) {
    super(parameters, simulation);
  }

  public timeToReach(packet: Packet): number {
    return (
      Math.random() *
        (this.parameters.timeRange[1] - this.parameters.timeRange[0]) +
      this.parameters.timeRange[0]
    );
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
          NumberPairField.create({
            name: "timeRange",
            label: "Time range",
            isFloat: true,
            required: true,
            occupedColumns: 6,
            minLeft: 1,
            minRight: 1,
            schema: z
              .tuple([z.number().min(1), z.number().min(1)])
              .refine(([left, right]) => left <= right, {
                message:
                  "The minimum value must be less than or equal to the maximum value",
              }),
            info: {
              title:
                "The range of times it takes for a packet to reach the destination node (min, max).",
            },
          }),
        ]),
      ],
    });
  }
}
