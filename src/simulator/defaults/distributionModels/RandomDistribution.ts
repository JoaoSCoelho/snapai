import { SelectField } from "@/simulator/configurations/layout/fields/SelectField";
import { Line } from "@/simulator/configurations/layout/Line";
import { ParametersSubsection } from "@/simulator/configurations/layout/ParametersSubsection";
import {
  DistributionModel,
  DistributionModelBaseParameters,
} from "@/simulator/models/DistributionModel";
import { Simulation } from "@/simulator/models/Simulation";
import { Position } from "@/simulator/tools/Position";
import { RandomUtils } from "@/simulator/utils/RandomUtils";
import z from "zod";

export type RandomMobilityParameters = DistributionModelBaseParameters & {
  topology: "2D" | "3D";
};

export class RandomDistribution extends DistributionModel {
  public constructor(
    public readonly parameters: RandomMobilityParameters,
    protected readonly simulation: Simulation,
  ) {
    super(parameters, simulation);
  }

  public static getParametersSubsection(): ParametersSubsection {
    return ParametersSubsection.create({
      lines: [
        new Line([
          SelectField.create({
            name: "topology",
            label: "Topology",
            occupedColumns: 4,
            required: true,
            schema: z.enum(["2D", "3D"]),
            options: [
              { value: "2D", label: "2D" },
              { value: "3D", label: "3D" },
            ],
            info: {
              title: "How much dimensions should be simulated by the model.",
            },
          }),
        ]),
      ],
    });
  }

  public getNextPosition(): Position {
    const topology = this.parameters.topology;
    const [[minX, maxX], [minY, maxY], [minZ, maxZ]] = [
      this.simulation.project.simulationConfig.dimX,
      this.simulation.project.simulationConfig.dimY,
      this.simulation.project.simulationConfig.dimZ,
    ];

    if (topology === "2D") {
      return new Position(
        RandomUtils.randomFloat(minX, maxX),
        RandomUtils.randomFloat(minY, maxY),
        0,
      );
    } else {
      return new Position(
        RandomUtils.randomFloat(minX, maxX),
        RandomUtils.randomFloat(minY, maxY),
        RandomUtils.randomFloat(minZ, maxZ),
      );
    }
  }
}
