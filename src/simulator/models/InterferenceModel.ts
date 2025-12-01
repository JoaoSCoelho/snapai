import { ModelType } from "../utils/modelsUtils";
import { Model } from "./Model";
import { Packet } from "./Packet";

export abstract class InterferenceModel extends Model {
  public static readonly type = ModelType.Interference;

  /**
   * The framework calls this method to determine whether a given packet
   * is disturbed (will not be received at the destination).
   *
   * In the synchronous setting, this test is called for each message not yet delivered
   * at the end of each simulation round.
   *
   * In the asynchronous setting, this test is only performed upon arrival of a message.
   * Note: For 'additive interference', the test is performed only if absolutely needed.
   *
   * @param packet The packet to check.
   * @return True if the message is disturbed, otherwise false.
   */
  public abstract isDisturbed(packet: Packet): boolean;
}
