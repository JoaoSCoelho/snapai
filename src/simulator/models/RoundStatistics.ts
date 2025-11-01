import { BaseStatistics } from "./BaseStatistics";
import { Packet } from "./Packet";

export class RoundStatistics extends BaseStatistics {
  public constructor(public readonly roundTime: number) {
    super();
  }

  public registerSentMessage(packet: Packet): this {
    this.sentMessages++;
    this.sentMessageBytes += packet.message.getByteSize();
    this.sentBytes += packet.getByteSize();
    return this;
  }

  public registerReceivedMessage(packet: Packet): this {
    this.receivedMessages++;
    this.receivedMessageBytes += packet.message.getByteSize();
    this.receivedBytes += packet.getByteSize();
    return this;
  }
}
