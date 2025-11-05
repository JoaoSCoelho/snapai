import { MessageTransmissionModel } from "@/simulator/models/MessageTransmissionModel";
import { Packet } from "@/simulator/models/Packet";

export class PingPongMessageTransmissionModel extends MessageTransmissionModel {
  public timeToReach(packet: Packet): number {
    return 1;
  }
}
