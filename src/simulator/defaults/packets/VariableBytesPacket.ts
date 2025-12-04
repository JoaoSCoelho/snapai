import { Message } from "../../models/Message";
import { NodeId } from "../../models/Node";
import { Packet, TransmissionType } from "../../models/Packet";

export type VariableBytesPacketParameters = {
  headersSize: number;
};

export class VariableBytesPacket extends Packet {
  protected _positiveDelivery: boolean = true;
  protected _arrivingTime: number | null = null;
  protected _sendingTime: number | null = null;
  protected _intensity: number | null = null;
  protected parameters: VariableBytesPacketParameters = null!; // should be set by setParameters

  public constructor(
    public readonly message: Message,
    public readonly originId: NodeId,
    public readonly destinationId: NodeId,
    public readonly transmissionType: TransmissionType,
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

  private get headersSize(): number {
    if (!this.parameters) throw new Error("Parameters not set");
    return this.parameters.headersSize;
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

  public setParameters(parameters: VariableBytesPacketParameters): void {
    this.parameters = parameters;
  }

  public getByteSize(): number {
    if (!this.headersSize) throw new Error("Headers size is not set");
    return this.message.getByteSize() + this.headersSize;
  }
}
