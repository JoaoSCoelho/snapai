import { NumberPairField } from "@/simulator/configurations/layout/fields/NumberPairField";
import { Line } from "@/simulator/configurations/layout/Line";
import { ParametersSubsection } from "@/simulator/configurations/layout/ParametersSubsection";
import { MobilityModel } from "@/simulator/models/MobilityModel";
import { Node } from "@/simulator/models/Node";
import { Simulation } from "@/simulator/models/Simulation";
import { Position } from "@/simulator/tools/Position";
import { RandomUtils } from "@/simulator/utils/RandomUtils";
import z from "zod";

export type PingPongMobilityModelParameters = {
  speedRange: [number, number];
};

export class PingPongMobilityModel extends MobilityModel {
  public name = "PingPong Mobility";

  public constructor(
    public readonly parameters: PingPongMobilityModelParameters,
    protected readonly simulation: Simulation,
  ) {
    super(parameters, simulation);
  }

  /**
   * Returns the next position of a node using the PingPongMobilityModel.
   * The next position is calculated by generating a random speed within the speed range
   * and a random angle. The position is then calculated by moving the node by the generated
   * speed and angle from its current position.
   * @see MobilityModel#getNextPosition
   * @param node The node for which to calculate the next position
   * @returns The next position of the node
   */
  public getNextPosition(node: Node): Position {
    const [minSpeed, maxSpeed] = this.parameters.speedRange;
    const radius = RandomUtils.randomFloat(minSpeed, maxSpeed);
    const angle = RandomUtils.randomFloat(0, 2 * Math.PI);

    return Position.cropToDimensions(
      Position.fromPositionAndDelta(node.position, [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0,
      ]),
      [
        this.simulation.project.simulationConfig.dimX,
        this.simulation.project.simulationConfig.dimY,
        this.simulation.project.simulationConfig.dimZ,
      ],
    );
  }

  public static getParametersSubsection(): ParametersSubsection {
    return ParametersSubsection.create({
      lines: [
        new Line([
          NumberPairField.create({
            name: "speedRange",
            label: "Speed Range",
            isFloat: true,
            occupedColumns: 12,
            required: true,
            schema: z.tuple([z.number().min(0), z.number().min(0)]),
            info: {
              title:
                "The range of speed that the model will use to move node. It's a tuple of [minSpeed, maxSpeed]. Choiced randomly between minSpeed and maxSpeed",
            },
            minLeft: 0,
            minRight: 0,
          }),
        ]),
      ],
    });
  }
}
