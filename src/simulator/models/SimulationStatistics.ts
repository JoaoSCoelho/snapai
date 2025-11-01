import { BaseStatistics } from "./BaseStatistics";
import { Packet } from "./Packet";

export type SimulationStatisticsOptions = {};

export abstract class SimulationStatistics extends BaseStatistics {
  public constructor(options: SimulationStatisticsOptions) {
    super();
  }
  /**
   * Increment the number of sent messages and
   * update the total number of bytes and message bytes sent.
   * @param packet The packet that was sent.
   */
  public registerSentMessage(packet: Packet): this {
    this.sentMessages++;
    this.sentBytes += packet.getByteSize();
    this.sentMessageBytes += packet.message.getByteSize();

    return this;
  }

  /**
   * Increment the number of received messages and
   * update the total number of bytes and message bytes received.
   * @param packet The packet that was received.
   */
  public registerReceivedMessage(packet: Packet): this {
    this.receivedMessages++;
    this.receivedBytes += packet.getByteSize();
    this.receivedMessageBytes += packet.message.getByteSize();

    return this;
  }
}
