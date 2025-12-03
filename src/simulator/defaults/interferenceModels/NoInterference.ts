import { InterferenceModel } from "@/simulator/models/InterferenceModel";
import { Packet } from "@/simulator/models/Packet";

export class NoInterference extends InterferenceModel {
  /**
   * This method is a placeholder for more complex interference models.
   * It always returns false, meaning that the packet will not be disturbed.
   * @param packet The packet to check.
   * @return False, always.
   */
  public isDisturbed(packet: Packet): boolean {
    return false;
  }
}
