import { ModelType } from "../utils/modelsUtils";
import { Model } from "./Model";
import { Node } from "./Node";

export abstract class ConnectivityModel extends Model {
  public static readonly type = ModelType.Connectivity;

  /**
   * Returns whether the given nodes are connected.
   * Remember that the connectivity edge is unidirectional.
   */
  public abstract isConnected(nodeFrom: Node, nodeTo: Node): boolean;
}
