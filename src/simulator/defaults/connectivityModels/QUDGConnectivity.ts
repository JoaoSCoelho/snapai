import { NumberField } from "@/simulator/configurations/layout/fields/NumberField";
import { PercentageField } from "@/simulator/configurations/layout/fields/PercentageField";
import { Line } from "@/simulator/configurations/layout/Line";
import { ParametersSubsection } from "@/simulator/configurations/layout/ParametersSubsection";
import { ConnectivityModel } from "@/simulator/models/ConnectivityModel";
import { Node } from "@/simulator/models/Node";
import { Simulation } from "@/simulator/models/Simulation";
import z from "zod";

export type QUDGConnectivityParametersSchema = {
  shortRadius: number;
  longRadius: number;
  probability: number;
};

export class QUDGConnectivity extends ConnectivityModel {
  public name = "Quasi Unit Disk Graph";

  public constructor(
    public readonly parameters: QUDGConnectivityParametersSchema,
    protected readonly simulation: Simulation,
  ) {
    super(parameters, simulation);
  }

  public static getParametersSubsection(): ParametersSubsection {
    return ParametersSubsection.create({
      lines: [
        new Line([
          NumberField.create({
            name: "shortRadius",
            label: "Short Radius",
            isFloat: true,
            required: true,
            occupedColumns: 4,
            min: 0,
            schema: z.number().min(0),
            info: {
              title:
                "The short radius of the QUDG. Nodes are connected if the Euclidean distance between them is less than or equal to the short radius.",
            },
          }),
          NumberField.create({
            name: "longRadius",
            label: "Long Radius",
            isFloat: true,
            required: true,
            occupedColumns: 4,
            min: 0,
            schema: z.number().min(0),
            info: {
              title:
                "The long radius of the QUDG. Nodes are connected with a probability if the Euclidean distance between them is less than or equal to the long radius and greater than the short radius.",
            },
          }),
          PercentageField.create({
            name: "probability",
            label: "Probability",
            isFloat: true,
            required: true,
            occupedColumns: 4,
            min: 0,
            schema: z.number().min(0).max(100),
            info: {
              title:
                "The probability of connection. Nodes are connected with this probability if the Euclidean distance between them is less than or equal to the long radius and greater than the short radius.",
            },
          }),
        ]),
      ],
    });
  }

  public isConnected(nodeFrom: Node, nodeTo: Node): boolean {
    const distance = nodeFrom.position.euclideanDistance(nodeTo.position);
    if (distance <= this.parameters.shortRadius) {
      return true;
    }
    if (distance <= this.parameters.longRadius) {
      return Math.random() * 100 < this.parameters.probability;
    } else {
      return false;
    }
  }
}
