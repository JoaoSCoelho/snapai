import { Model } from "./Model";
import { Packet } from "./Packet";

export abstract class MessageTransmissionModel extends Model {
  public static readonly type = "message_transmission";

  public abstract timeToReach(packet: Packet): number;
}
