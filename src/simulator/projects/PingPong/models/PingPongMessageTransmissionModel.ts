import { MessageTransmissionModel } from "@/simulator/models/MessageTransmissionModel";
import { Packet } from "@/simulator/models/Packet";

export class PingPongMessageTransmissionModel extends MessageTransmissionModel {
  public name = "PingPong Message Transmission";

  public timeToReach(packet: Packet): number {
    return 1;
  }
}
