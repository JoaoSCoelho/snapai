import { Message } from "./Message";
import { NodeId } from "./Node";
import { Packet, TransmissionType } from "./Packet";

export class Packet232Bytes extends Packet {
  protected _positiveDelivery: boolean = true; // 1 bit
  protected _arrivingTime: number | null = null; // 64 bits
  protected _sendingTime: number | null = null; // 64 bits
  protected _intensity: number | null = null; // 32 bits

  public constructor(
    public readonly message: Message, // Variable
    public readonly originId: NodeId, // 32 bits
    public readonly destinationId: NodeId, // 32 bits
    public readonly transmissionType: TransmissionType, // 7 bits
  ) {
    if (originId < -3.4e38)
      throw new Error("Origin ID must be greater than -3.4e38");
    if (destinationId < -3.4e38)
      throw new Error("Destination ID must be greater than -3.4e38");
    if (originId > 3.4e38)
      throw new Error("Origin ID must be less than 3.4e38");
    if (destinationId > 3.4e38)
      throw new Error("Destination ID must be less than 3.4e38");

    super(message, originId, destinationId, transmissionType);
  }

  public get arrivingTime(): number | null {
    return this._arrivingTime;
  }
  public get sendingTime(): number | null {
    return this._sendingTime;
  }

  public get intensity(): number | null {
    return this._intensity;
  }

  public set arrivingTime(time: number) {
    if (time < -1.7e308)
      throw new Error("Arriving time must be greater than -1.7e308");
    if (time > 1.7e308)
      throw new Error("Arriving time must be less than 1.7e308");
    this._arrivingTime = time;
  }

  public set sendingTime(time: number) {
    if (time < -1.7e308)
      throw new Error("Sending time must be greater than -1.7e308");
    if (time > 1.7e308)
      throw new Error("Sending time must be less than 1.7e308");
    this._sendingTime = time;
  }

  public set intensity(intensity: number) {
    if (intensity < -3.4e38)
      throw new Error("Intensity must be greater than -3.4e38");
    if (intensity > 3.4e38)
      throw new Error("Intensity must be less than 3.4e38");
    this._intensity = intensity;
  }

  public getByteSize(): number {
    return this.message.getByteSize() + 232;
  }
}
