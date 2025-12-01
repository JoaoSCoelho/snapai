import { Packet } from "../models/Packet";
import { Simulation } from "../models/Simulation";
import { Inbox } from "./Inbox";

export class InboxPacketBuffer {
  private readonly arrivingPackets: Packet[] = [];
  private readonly buffer: Packet[] = [];
  private readonly inbox: Inbox = new Inbox([]);

  constructor(private readonly simulation: Simulation) {}

/**
 * Returns the Inbox instance associated with this InboxPacketBuffer.
 * The Inbox instance holds the packets that are currently in the inbox
 * of a node.
 * @returns The Inbox instance associated with this InboxPacketBuffer.
 */
  public getInbox(): Inbox {
    return this.inbox;
  }

  /**
   * Adds a packet to the buffer.
   * @param packet The packet to add.
   * @returns This InboxPacketBuffer instance.
   */
  public addPacket(packet: Packet) {
    this.buffer.push(packet);
    return this;
  }

  /**
   * Removes a packet from the buffer.
   * @param packet The packet to remove.
   * @returns This InboxPacketBuffer instance.
   */
  public removePacket(packet: Packet) {
    this.buffer.splice(this.buffer.indexOf(packet), 1);
    return this;
  }

  public updateMessageBuffer() {
    this.arrivingPackets.splice(0, this.arrivingPackets.length);

    for (const p of [...this.buffer]) {
      if (p.arrivingTime ?? 0 <= this.simulation.currentTime) {
        this.simulation.packetsInTheAir.remove(p);

        this.removePacket(p);

        if (this.simulation.hasEdge(p.originId, p.destinationId)) {
          this.simulation.getEdge(p.originId, p.destinationId)!.removePacket();
        }

        if (p.positiveDelivery) {
            this.arrivingPackets.push(p);
            this.simulation.logger.log(`Message \"${p.message.data}\" (${p.originId}->${p.destinationId}) arrived`);
        } else {
          if (this.simulation.project.simulationConfig.getNackMessagesEnabled()) {
            const origin = this.simulation.getCertainNode(p.originId);

            origin.addNackPacket(p);
          }
        }
    }
  }
}
