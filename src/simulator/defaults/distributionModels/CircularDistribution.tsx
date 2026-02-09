import { AngleField } from "@/simulator/configurations/layout/fields/AngleField";
import { NumberField } from "@/simulator/configurations/layout/fields/NumberField";
import { NumberTripleField } from "@/simulator/configurations/layout/fields/NumberTripleField";
import { SelectField } from "@/simulator/configurations/layout/fields/SelectField";
import { Line } from "@/simulator/configurations/layout/Line";
import { ParametersSubsection } from "@/simulator/configurations/layout/ParametersSubsection";
import {
  DistributionModel,
  DistributionModelBaseParameters,
} from "@/simulator/models/DistributionModel";
import { Simulation } from "@/simulator/models/Simulation";
import { Position } from "@/simulator/tools/Position";
import { AngleUnit } from "@/simulator/utils/types";
import z, { number } from "zod";

export type CircularDistributionParameters = DistributionModelBaseParameters & {
  centerPoint: [number, number, number];
  radius: number;
  numberOfNodes: number;
  initialAngle: number;
  direction: "clockwise" | "counterclockwise";
  plane: "xy" | "xz" | "yz";
};

export class CircularDistribution extends DistributionModel {
  public name = "Circular";
  private remainingNodes: number;

  public constructor(
    public readonly parameters: CircularDistributionParameters,
    protected readonly simulation: Simulation,
  ) {
    super(parameters, simulation);
    this.remainingNodes = parameters.numberOfNodes;
  }

  public static getParametersSubsection(): ParametersSubsection {
    return ParametersSubsection.create({
      lines: [
        new Line([
          NumberTripleField.create({
            name: "centerPoint",
            label: "Center Point (X, Y, Z)",
            required: true,
            isFloat: true,
            occupedColumns: 8,
            schema: z.tuple([z.number(), z.number(), z.number()]),
            info: { title: "Center point of the circle" },
          }),
          NumberField.create({
            name: "radius",
            label: "Radius",
            required: true,
            isFloat: true,
            schema: z.number().min(0),
            min: 0,
            occupedColumns: 2,
            info: { title: "Radius of the circle" },
          }),
          NumberField.create({
            name: "numberOfNodes",
            label: "Number of nodes",
            required: true,
            isFloat: false,
            schema: z.number().min(1),
            min: 1,
            occupedColumns: 2,
            info: {
              title:
                "Number of nodes to calculate the position of each one in the circle",
              helpText: (
                <>
                  <p>
                    The number of nodes to calculate the position of each one in
                    the circle
                  </p>
                  <p>
                    Example: If you're adding 10 nodes to the simulation and
                    input 20 in this field, the 10 nodes will be distributed in
                    a semi circle
                  </p>
                </>
              ),
            },
          }),
        ]),
        new Line([
          AngleField.create({
            name: "initialAngle",
            label: "Initial Angle",
            required: true,
            isFloat: true,
            angleUnit: AngleUnit.DEG,
            schema: z.number().min(0).max(360),
            min: 0,
            max: 360,
            occupedColumns: 4,
            info: { title: "Initial angle of the circle" },
          }),
          SelectField.create({
            name: "direction",
            label: "Direction",
            required: true,
            schema: z.enum(["clockwise", "counterclockwise"]),
            options: [
              {
                label: "Clockwise",
                value: "clockwise",
              },
              {
                label: "Counter clockwise",
                value: "counterclockwise",
              },
            ],
            occupedColumns: 4,
            info: { title: "Direction of the circle" },
          }),
          SelectField.create({
            name: "plane",
            label: "Plane",
            required: true,
            schema: z.enum(["xy", "xz", "yz"]),
            options: [
              {
                label: "XY",
                value: "xy",
              },
              {
                label: "XZ",
                value: "xz",
              },
              {
                label: "YZ",
                value: "yz",
              },
            ],
            occupedColumns: 4,
            info: { title: "Plane of the circle" },
          }),
        ]),
      ],
    });
  }

  public getNextPosition(): Position {
    if (this.remainingNodes <= 0) {
      this.remainingNodes = this.parameters.numberOfNodes + this.remainingNodes;
    }

    const {
      centerPoint: [cx, cy, cz],
      radius,
      numberOfNodes,
      initialAngle,
      direction,
      plane,
    } = this.parameters;

    // Índice do nó atual (0, 1, 2, ...)
    const index = numberOfNodes - this.remainingNodes;

    // Passo angular (em radianos)
    const step = (2 * Math.PI) / numberOfNodes;

    // Direção do giro
    const sign = direction === "clockwise" ? -1 : 1;

    // Ângulo atual (graus → radianos)
    const angle = ((90 - initialAngle) * Math.PI) / 180 + sign * index * step;

    let x = cx;
    let y = cy;
    let z = cz;

    // Aplica o círculo no plano escolhido
    switch (plane) {
      case "xy":
        x = cx + radius * Math.cos(angle);
        y = cy + radius * Math.sin(angle);
        break;

      case "xz":
        x = cx + radius * Math.cos(angle);
        z = cz + radius * Math.sin(angle);
        break;

      case "yz":
        y = cy + radius * Math.cos(angle);
        z = cz + radius * Math.sin(angle);
        break;
    }

    this.remainingNodes--;

    return new Position(x, y, z);
  }
}
