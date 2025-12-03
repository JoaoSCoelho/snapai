import { ModelType } from "../utils/modelsUtils";
import { ConcreteModel, Model } from "./Model";
import { Packet } from "./Packet";

export type ConcreteMessageTransmissionModel =
  ConcreteModel<MessageTransmissionModel>;

export abstract class MessageTransmissionModel extends Model {
  public static readonly type = ModelType.MessageTransmission;

  /**
   * Determines the time a packet takes to arrive at its destination.
   *
   * It is called when a packet is sent by a node.
   * @param packet The packet to send
   * @return The time it takes the packet to travel from the source to the destination.
   */
  public abstract timeToReach(packet: Packet): number;
}
