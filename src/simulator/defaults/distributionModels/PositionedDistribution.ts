import { NumberField } from "@/simulator/configurations/layout/fields/NumberField";
import { NumberTripleField } from "@/simulator/configurations/layout/fields/NumberTripleField";
import { Line } from "@/simulator/configurations/layout/Line";
import { ParametersSubsection } from "@/simulator/configurations/layout/ParametersSubsection";
import {
  DistributionModel,
  DistributionModelBaseParameters,
} from "@/simulator/models/DistributionModel";
import { Simulation } from "@/simulator/models/Simulation";
import { Position } from "@/simulator/tools/Position";
import z from "zod";

export type PositionedDistributionParameters =
  DistributionModelBaseParameters & {
    coordinates: [number, number, number];
  };

export class PositionedDistribution extends DistributionModel {
  public name = "Positioned";

  public constructor(
    public readonly parameters: PositionedDistributionParameters,
    protected readonly simulation: Simulation,
  ) {
    super(parameters, simulation);
  }

  public static getParametersSubsection(): ParametersSubsection {
    return ParametersSubsection.create({
      lines: [
        new Line([
          NumberTripleField.create({
            name: "coordinates",
            label: "Coordinates (X, Y, Z)",
            required: true,
            isFloat: true,
            schema: z.tuple([z.number(), z.number(), z.number()]),
            info: { title: "Coordinates for position the nodes" },
            occupedColumns: 12,
          }),
        ]),
      ],
    });
  }

  public getNextPosition(): Position {
    return new Position(
      this.parameters.coordinates[0],
      this.parameters.coordinates[1],
      this.parameters.coordinates[2],
    );
  }
}
