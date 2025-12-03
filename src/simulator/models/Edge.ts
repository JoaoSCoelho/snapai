import { NodeId } from "./Node";
import { Packet } from "./Packet";

export class Edge {
  private packetsQty = 0;

  constructor(
    public readonly source: NodeId,
    public readonly target: NodeId,
  ) {}

  /**
   * Creates an Edge from a pair of node IDs.
   * @param {[[NodeId, NodeId]]} pair - The pair of node IDs.
   * @returns {Edge} The created edge.
   */
  public static fromPair([source, target]: [NodeId, NodeId]): Edge {
    return new Edge(source, target);
  }

  /**
   * Returns the number of packets queued on this edge.
   * @returns The number of packets queued on this edge.
   */
  public getPacketsQty(): number {
    return this.packetsQty;
  }

  /**
   * Increments the number of packets queued on this edge.
   * @remarks This method should be called when a packet is added to the edge.
   * It is used to keep track of the number of packets that are currently queued on the edge.
   * @returns The number of packets remaining on the edge.
   */
  public addPacket(packet: Packet): number {
    return ++this.packetsQty;
  }

  /**
   * Decrements the number of packets queued on this edge.
   * @remarks This method should be called when a packet is removed from the edge.
   * It is used to keep track of the number of packets that are currently queued on the edge.
   * @returns The number of packets remaining on the edge.
   */
  public removePacket(packet: Packet): number {
    return --this.packetsQty;
  }
}
