import { Packet } from "../models/Packet";

export class Inbox {
  private activePacketIndex: number = 0;

  public constructor(private readonly packets: Packet[]) {}

  /**
   * Returns the number of packets in the inbox.
   * @returns The number of packets in the inbox.
   */
  public size(): number {
    return this.packets.length;
  }

  /**
   * Returns the next packet in the inbox, or null if there are no more packets.
   * The active packet index is incremented by one after calling this method.
   * @returns The next packet in the inbox, or null if there are no more packets.
   */
  public next(): Packet | null {
    if (this.activePacketIndex < this.packets.length) {
      return this.packets[++this.activePacketIndex];
    } else {
      return null;
    }
  }

  /**
   * Returns the currently active packet in the inbox, or null if there is no active packet.
   * The currently active packet is the packet that is currently being processed.
   * The active packet index can be changed by calling the next() or reset() methods.
   * @returns The currently active packet in the inbox, or null if there is no active packet.
   */
  public getActivePacket(): Packet | null {
    return this.packets[this.activePacketIndex];
  }

  /**
   * Returns a shallow copy of the list of packets in the inbox.
   * @returns A shallow copy of the list of packets in the inbox.
   */
  public getPacketList(): Packet[] {
    return [...this.packets];
  }

  /**
   * Resets the active packet index to 0.
   * This method is typically used at the end of a simulation round
   * to reset the inbox for the next round.
   */
  public reset(): this {
    this.activePacketIndex = 0;
    return this;
  }

  /**
   * Resets the active packet index to 0 and replaces the list of packets with the given packets.
   * This method is typically used at the end of a simulation round
   * to reset the inbox for the next round.
   * @param packets The new list of packets to replace the current list of packets.
   */
  public resetForPackets(packets: Packet[]): this {
    this.reset();
    this.packets.splice(0, this.packets.length, ...packets);
    return this;
  }

  /**
   * Returns the sender (origin ID) of the currently active packet in the inbox, or throws an error if there is no active packet.
   * @returns The sender (origin ID) of the currently active packet in the inbox.
   * @throws {Error} If there is no active packet to get the sender from.
   */
  public getSender() {
    const activePacket = this.getActivePacket();
    if (activePacket) {
      return activePacket.originId;
    } else {
      throw new Error("No active packet to get sender from");
    }
  }

  /**
   * Returns the receiver (destination ID) of the currently active packet in the inbox, or throws an error if there is no active packet.
   * @returns The receiver (destination ID) of the currently active packet in the inbox.
   * @throws {Error} If there is no active packet to get the receiver from.
   */
  public getReceiver() {
    const activePacket = this.getActivePacket();

    if (activePacket) {
      return activePacket.destinationId;
    } else {
      throw new Error("No active packet to get receiver from");
    }
  }

  /**
   * Returns the arrival time of the currently active packet in the inbox, or throws an error if there is no active packet.
   * @returns The arrival time of the currently active packet in the inbox.
   * @throws {Error} If there is no active packet to get the arrival time from.
   */
  public getArrivingTime() {
    const activePacket = this.getActivePacket();

    if (activePacket) {
      return activePacket.arrivingTime;
    } else {
      throw new Error("No active packet to get arrival time from");
    }
  }

  /**
   * Returns the intensity of the currently active packet in the inbox, or throws an error if there is no active packet.
   * @returns The intensity of the currently active packet in the inbox.
   * @throws {Error} If there is no active packet to get the intensity from.
   */
  public getIntensity() {
    const activePacket = this.getActivePacket();

    if (activePacket) {
      return activePacket.intensity;
    } else {
      throw new Error("No active packet to get intensity from");
    }
  }

  /**
   * Returns the sending time of the currently active packet in the inbox, or throws an error if there is no active packet.
   * @returns The sending time of the currently active packet in the inbox.
   * @throws {Error} If there is no active packet to get the sending time from.
   */
  public getSendingTime() {
    const activePacket = this.getActivePacket();

    if (activePacket) {
      return activePacket.sendingTime;
    } else {
      throw new Error("No active packet to get sending time from");
    }
  }
}
