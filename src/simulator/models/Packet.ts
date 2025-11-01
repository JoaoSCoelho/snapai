import { Message } from "./Message";
import { NodeId } from "./Node";

export enum TransmissionType {
  UNICAST,
  BROADCAST,
  MULTICAST,
}

export abstract class Packet {
  public positiveDelivery: boolean = true;
  protected _arrivingTime: number | null = null;
  protected _sendingTime: number | null = null;
  protected _intensity: number | null = null;

  public constructor(
    public readonly message: Message,
    public readonly originId: NodeId,
    public readonly destination: NodeId,
    public readonly transmissionType: TransmissionType,
  ) {}

  public abstract get arrivingTime(): number | null;
  public abstract get sendingTime(): number | null;
  public abstract get intensity(): number | null;
  public abstract set arrivingTime(time: number);
  public abstract set sendingTime(time: number);
  public abstract set intensity(intensity: number);

  public denyDelivery() {
    this.positiveDelivery = false;
  }

  public abstract getByteSize(): number;
}
