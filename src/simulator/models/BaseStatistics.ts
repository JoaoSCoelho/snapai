export abstract class BaseStatistics {
  protected sentMessages: number = 0;
  protected receivedMessages: number = 0;
  protected sentBytes: number = 0;
  protected receivedBytes: number = 0;
  protected sentMessageBytes: number = 0;
  protected receivedMessageBytes: number = 0;

  getSentMessages(): number {
    return this.sentMessages;
  }
  getReceivedMessages(): number {
    return this.receivedMessages;
  }
  getSentBytes(): number {
    return this.sentBytes;
  }
  getReceivedBytes(): number {
    return this.receivedBytes;
  }
  getSentMessageBytes(): number {
    return this.sentMessageBytes;
  }
  getReceivedMessageBytes(): number {
    return this.receivedMessageBytes;
  }
}
