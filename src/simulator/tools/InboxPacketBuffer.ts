import { Packet } from "../models/Packet";
import { Simulation } from "../models/Simulation";
import { Inbox } from "./Inbox";
import { Edge } from "../models/Edge";
import { OrderedPacketSet } from "../modules/OrderedPacketSet";

export class InboxPacketBuffer {
  private readonly arrivingPackets: OrderedPacketSet = new OrderedPacketSet();
  private readonly buffer: Set<Packet> = new Set([]);
  private readonly inbox: Inbox = new Inbox([]);

  constructor(private readonly simulation: Simulation) {}

  /**
   * This method returns a Inbox instance for this PacketBuffer. The inbox instance is used to
   * iterate over the PacketBuffer and to get the Header-Information from the Packets.\
   * Returns the Inbox instance associated with this InboxPacketBuffer.
   * The Inbox instance holds the packets that are currently in the inbox
   * of a node.
   * @returns The Inbox instance associated with this InboxPacketBuffer.
   */
  public getInbox(): Inbox {
    return this.inbox.resetForPackets([...this.arrivingPackets]);
  }

  /**
   * Adds a packet to the buffer.
   * @param packet The packet to add.
   * @returns This InboxPacketBuffer instance.
   */
  public addPacket(packet: Packet) {
    this.buffer.add(packet);
    return this;
  }

  /**
   * Removes a packet from the buffer.
   * @param packet The Packet to remove from the buffer.
   * @returns This InboxPacketBuffer instance
   */
  public removePacket(packet: Packet) {
    this.buffer.delete(packet);
    return this;
  }

  public getBufferCopy(): Set<Packet> {
    return new Set([...this.buffer]);
  }

  /**
   * This method updates the messageBuffer for the node. This means, that it
   * prepares all the messages that are incoming in this round for the user
   * to get them.
   */
  public updateMessageBuffer() {
    this.arrivingPackets.clear();

    for (const packet of this.getBufferCopy()) {
      if (packet.arrivingTime ?? 0 <= this.simulation.currentTime) {
        if (this.simulation.project.simulationConfig.interferenceEnabled) {
          this.simulation.packetsInTheAir.remove(packet);
        }

        this.removePacket(packet);

        if (packet.edge) {
          packet.edge.removePacket(packet);
        }

        if (packet.positiveDelivery) {
          this.arrivingPackets.insert(packet);
          this.simulation.logger.log(
            `Message \"${packet.message.data}\" (${packet.originId}->${packet.destinationId}) arrived`,
          );
        } else {
          if (this.simulation.project.simulationConfig.nackMessagesEnabled) {
            const origin = this.simulation.getCertainNode(packet.originId);

            origin.addNackPacket(packet);
          }
        }
      }
    }
  }

  /**
   * This method returns the number of packets arriving in this round.
   *
   * @return The number of Packets arriving this node in this round.
   */
  public waitingPacketsQty(): number {
    return this.arrivingPackets.size();
  }

  /**
   * Denies all packets if they are sent over the
   * specified edge and removes the edge from the packets.
   *
   * @param edge The edge for which the packets have to be invalidated.
   */
  public invalidatePacketsSentOverThisEdge(edge: Edge) {
    for (const packet of this.getBufferCopy()) {
      if (packet.edge === edge) {
        packet.denyDelivery();
        packet.setEdge(null);
      }
    }
  }
}
