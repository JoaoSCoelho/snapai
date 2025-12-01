import { Inbox } from "../tools/Inbox";
import { NackBox } from "../tools/NackBox";
import { AsynchronousSimulation } from "./AsynchronousSimulation";
import { Event } from "./Event";
import { Node } from "./Node";
import { Packet, TransmissionType } from "./Packet";
import { Simulation } from "./Simulation";

export class PacketEvent extends Event {
  private readonly inbox: Inbox = new Inbox([]);
  private readonly nackBox: NackBox = new NackBox([]);

  public constructor(
    public readonly packet: Packet,
    public readonly time: number,
    protected readonly simulation: AsynchronousSimulation,
  ) {
    super(time, simulation);
  }

  public handle(): void {
    if (this.simulation.project.simulationConfig.getInterferenceEnabled()) {
      this.simulation.packetsInTheAir.performInterferenceTestBeforeRemove();
      this.simulation.packetsInTheAir.remove(this.packet);
    }

    if (this.packet.edge) {
      this.packet.edge.removePacket(this.packet);
    }

    if (this.packet.positiveDelivery) {
      const packetDestination = this.simulation.getCertainNode(
        this.packet.destinationId,
      );
      packetDestination.handleMessages(
        this.inbox.resetForPackets([this.packet]),
      );
    } else if (
      this.simulation.project.simulationConfig.getNackMessagesEnabled() &&
      this.packet.transmissionType === TransmissionType.UNICAST
    ) {
      const packetOrigin = this.simulation.getCertainNode(this.packet.originId);
      packetOrigin.handleNackMessages(
        this.nackBox.resetForPackets([this.packet]),
      );
    }
  }

  /**
   * Similar to the arrival of a packet in the asynchronous case, this method
   * will remove the packet from the packets in the air and from the edge
   * if interference is enabled and if the packet is associated with an edge.
   * This method is typically called when a packet is dropped (not delivered) in
   * the asynchronous case.
   */
  public drop(): void {
    // similar to the arrival of a packet in the asynchronous case
    if (this.simulation.project.simulationConfig.getInterferenceEnabled()) {
      this.simulation.packetsInTheAir.remove(this.packet);
    }
    if (this.packet.edge) {
      this.packet.edge.removePacket(this.packet);
    }
  }

  public getEventNode(): Node | null {
    return this.simulation.getCertainNode(this.packet.destinationId);
  }

  public isNodeEvent(): boolean {
    return true;
  }
}
