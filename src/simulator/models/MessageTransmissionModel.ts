import { ModelType } from "../utils/modelsUtils";
import { ConcreteModel, Model } from "./Model";
import { Packet } from "./Packet";

export type ConcreteMessageTransmissionModel =
  ConcreteModel<MessageTransmissionModel>;

export abstract class MessageTransmissionModel extends Model {
  public static readonly type = ModelType.MessageTransmission;

  /**
   * Returns the time it takes for the packet to reach the destination node.
   * @param packet
   */
  public abstract timeToReach(packet: Packet): number;
}
