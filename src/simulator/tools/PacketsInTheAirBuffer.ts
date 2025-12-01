import { Edge } from "../models/Edge";
import { Packet } from "../models/Packet";
import { Simulation } from "../models/Simulation";

export class PacketsInTheAirBuffer {
  private activePackets: Set<Packet> = new Set();
  private passivePackets: Set<Packet> = new Set();
  private hasNewAdded = true;

  public constructor(private readonly simulation: Simulation) {}

  /**
   * Tests all packets for interference, and sets the interference flag if necessary.
   *
   * In the synchronous mode, this method is called in every round, after the nodes
   * have moved. Only packets that are still supposed to arrive are checked.
   *
   * In asynchronous mode, this method is called only when something happens
   * that could change the interference. (Two cases: Either call all the time
   * when the PacketsInTheAir buffer changes, or assume that the interference is
   * 'additive', i.e. interference only decreses if a packet is removed. In the latter
   * case, we need to test for interference only upon removal of a packet and only
   * if there were insertions after the last removal.
   */
  public testForInterference() {
    this.activePackets.forEach((packet) => this.checkPositiveDelivery(packet));
    this.passivePackets.forEach((packet) => this.checkPositiveDelivery(packet));
  }

  /**
   * Checks whether the given packet is positively delivered or not.\
   * Denied packets are not positively delivered.
   * @param packet The packet to check.
   * @remarks In the synchronous mode, this method is called in every round.
   * In asynchronous mode, this method is called only when something happens
   * that could change the interference.
   */
  private checkPositiveDelivery(packet: Packet) {
    if (!packet.positiveDelivery) return;

    const destinationNode = this.simulation.getCertainNode(
      packet.destinationId,
    );

    if (destinationNode.interferenceModel.isDisturbed(packet)) {
      packet.denyDelivery();
    }
  }

  /**
   * In asynchronous mode, this method is called before a packet
   * is removed from the list of packets in the air. If necessary,
   * it determines for all messages currently being sent the interfence.
   *
   * If the interference is not additive, the interference test is performed
   * after every insertion/removal to this list, and this method needs not
   * do anything.
   */
  public performInterferenceTestBeforeRemove() {
    if (!this.simulation.project.simulationConfig.getInterferenceIsAdditive())
      return;

    if (this.hasNewAdded) {
      this.testForInterference();
      this.hasNewAdded = false;
    }
  }

  /**
   * Adds a packet to either the active or passive packet lists.
   * @param packet The packet to add.
   * @param isPassive Whether the packet is passive or not.
   * Passive packets are not tested for interference.
   */
  public add(packet: Packet, isPassive: boolean) {
    if (isPassive) {
      this.passivePackets.add(packet);
    } else {
      this.activePackets.add(packet);
      this.hasNewAdded = true;

      if (
        this.simulation.isAsyncMode &&
        !this.simulation.project.simulationConfig.getInterferenceIsAdditive()
      ) {
        this.testForInterference();
      }
    }
  }

  /**
   * Removes a packet from the list of all passive packets and
   * adds it to the list of active packets. This method is used
   * in the multicast implementation to efficiently find the packet
   * which takes longest to deliver.
   * @param p The packet to upgrade
   */
  public upgradeToActivePacket(packet: Packet) {
    this.passivePackets.delete(packet);
    this.add(packet, false);
  }

  /**
   * Returns the number of packets in the air. Multicast packets are counted as one packet.
   * @return The number of packets in the air.
   */
  public size(): number {
    return this.activePackets.size;
  }

  /**
   * Removes a packet from either the active or passive packet lists.
   * @param packet The packet to remove.
   */
  public remove(packet: Packet) {
    this.activePackets.delete(packet);
    this.passivePackets.delete(packet);

    if (
      this.simulation.isAsyncMode &&
      !this.simulation.project.simulationConfig.getInterferenceIsAdditive()
    ) {
      this.testForInterference();
    }
  }

  /**
   * Denies all packets in the active packet list that have been sent through the given edge.
   * This method is used to deny packets that have been sent through a certain edge.
   * The packets that are denied will be marked as negatively delivered.
   * @param edge The edge through which the packets were sent.
   */
  public denyFromEdge(edge: Edge) {
    for (const packet of this.activePackets) {
      if (packet.edge === edge) {
        packet.denyDelivery();
      }
    }
  }
}
