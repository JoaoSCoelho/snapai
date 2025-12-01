import { ModelType } from "../utils/modelsUtils";
import { Model } from "./Model";
import { Packet } from "./Packet";

export abstract class ReliabilityModel extends Model {
  public static readonly type = ModelType.Reliability;

  /**
   * Returns whether the given packet reaches the destination node.
   * @param {Packet} packet The packet to check.
   * @returns {boolean} Whether the packet reaches the destination node.
   */
  public abstract reachesDestination(packet: Packet): boolean;
}
