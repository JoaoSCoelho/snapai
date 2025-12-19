import { Packet } from "@/simulator/models/Packet";
import { ReliabilityModel } from "@/simulator/models/ReliabilityModel";

export class ReliableDelivery extends ReliabilityModel {
  public name = "Reliable Delivery";

  /**
   * Always returns true, meaning that the packet will always reach the destination.
   * @returns {boolean} Always true.
   */
  public reachesDestination(): boolean {
    return true;
  }
}
