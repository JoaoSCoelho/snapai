import { Position } from "../tools/Position";
import { ModelType } from "../utils/modelsUtils";
import { Model } from "./Model";
import { Node } from "./Node";

export abstract class MobilityModel extends Model {
  public static readonly type = ModelType.Mobility;

  /**
   * This method returns the next position of a node.
   * It is called from the system to update the
   * position of the nodes during the update pass of a round.
   *
   * @param node The node to get the next position for.
   * @return The next position of the given node.
   */
  public abstract getNextPosition(node: Node): Position;
}
