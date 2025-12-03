import { Position } from "../tools/Position";
import { ModelType } from "../utils/modelsUtils";
import { Model } from "./Model";
import { Node } from "./Node";
import { Simulation } from "./Simulation";

export type DistributionModelBaseParameters = {
  numberOfNodes: number;
};

export abstract class DistributionModel extends Model {
  public static readonly type = ModelType.Distribution;

  public constructor(
    protected readonly simulation: Simulation,
    public readonly parameters: Record<string, any> &
      DistributionModelBaseParameters,
  ) {
    super(simulation, parameters);
  }

  /**
   * Returns the next position where a node is placed.
   *
   * You may precalculate all positions and store them in
   * a datastructure. Then, return one after the other
   * of these positions when this method is called.
   * @return The next position where a node is placed.
   */
  public abstract getNextPosition(node: Node): Position;
}
