import { NumberField } from "@/simulator/configurations/layout/fields/NumberField";
import { Line } from "@/simulator/configurations/layout/Line";
import { ParametersSubsection } from "@/simulator/configurations/layout/ParametersSubsection";
import { ConnectivityModel } from "@/simulator/models/ConnectivityModel";
import { Node } from "@/simulator/models/Node";
import { Simulation } from "@/simulator/models/Simulation";
import z from "zod";

export type UDGConnectivityParametersSchema = {
  radius: number;
};

export class UDGConnectivity extends ConnectivityModel {
  public name = "Unit Disk Graph";

  public constructor(
    public readonly parameters: UDGConnectivityParametersSchema,
    protected readonly simulation: Simulation,
  ) {
    super(parameters, simulation);
  }

  public static getParametersSubsection(): ParametersSubsection {
    return ParametersSubsection.create({
      lines: [
        new Line([
          NumberField.create({
            name: "radius",
            label: "Radius",
            isFloat: true,
            required: true,
            occupedColumns: 4,
            min: 0,
            schema: z.number().min(0),
            info: {
              title:
                "The radius of the UDG. Nodes are connected if the Euclidean distance between them is less than or equal to the radius.",
            },
          }),
        ]),
      ],
    });
  }

  /**
   * Returns whether the given nodes are connected.
   * Two nodes are considered connected if the Euclidean distance between them is less than or equal to the given radius.
   * @param {Node} nodeFrom The node from which the connection is queried.
   * @param {Node} nodeTo The node to which the connection is queried.
   * @returns {boolean} Whether the nodes are connected.
   */
  public isConnected(nodeFrom: Node, nodeTo: Node): boolean {
    const distance = nodeFrom.position.euclideanDistance(nodeTo.position);
    return distance <= this.parameters.radius;
  }
}
