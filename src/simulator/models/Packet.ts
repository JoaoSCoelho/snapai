import { ParameterizedModule } from "../modules/ParameterizedModule";
import { Edge } from "./Edge";
import { Message } from "./Message";
import { NodeId } from "./Node";

export enum TransmissionType {
  UNICAST,
  BROADCAST,
  // MULTICAST, TODO: think about implement multicast
}

export type ConcretePacket = new (
  message: Message,
  originId: NodeId,
  destinationId: NodeId,
  transmissionType: TransmissionType,
) => Packet;

export abstract class Packet extends ParameterizedModule {
  protected _positiveDelivery: boolean = true;
  protected _arrivingTime: number | null = null;
  protected _sendingTime: number | null = null;
  protected _intensity: number | null = null;
  protected _edge: Edge | null = null;

  public constructor(
    public readonly message: Message,
    public readonly originId: NodeId,
    public readonly destinationId: NodeId,
    public readonly transmissionType: TransmissionType,
  ) {
    super();
  }

  public abstract get arrivingTime(): number | null;
  public abstract get sendingTime(): number | null;
  public abstract get intensity(): number | null;
  public abstract set arrivingTime(time: number);
  public abstract set sendingTime(time: number);
  public abstract set intensity(intensity: number);

  public get edge(): Edge | null {
    return this._edge;
  }

  public get positiveDelivery(): boolean {
    return this._positiveDelivery;
  }

  /**
   * Denies delivery of the packet to the destination node.
   * This method is typically called when the packet is dropped by the network.
   * After calling this method, the packet will no longer be considered as having been delivered to the destination.
   */
  public denyDelivery() {
    this._positiveDelivery = false;
  }

  public setEdge(edge: Edge | null) {
    this._edge = edge;
  }

  /**
   * Returns the size of the packet in bytes.
   * Calculated by the size of headers plus the size of the payload
   */
  public abstract getByteSize(): number;
}
