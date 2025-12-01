import { Edge } from "./Edge";
import { Message } from "./Message";
import { NodeId } from "./Node";

export enum TransmissionType {
  UNICAST,
  BROADCAST,
  MULTICAST,
}

export type ConcretePacket = new (
  message: Message,
  originId: NodeId,
  destinationId: NodeId,
  transmissionType: TransmissionType,
) => Packet;

export abstract class Packet {
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
  ) {}

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

  public denyDelivery() {
    this._positiveDelivery = false;
  }

  public setEdge(edge: Edge | null) {
    this._edge = edge;
  }

  public abstract getByteSize(): number;
}
