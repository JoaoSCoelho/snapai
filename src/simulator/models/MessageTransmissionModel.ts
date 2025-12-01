import { ModelType } from "../utils/modelsUtils";
import { ConcreteModel, Model } from "./Model";
import { Packet } from "./Packet";

export type ConcreteMessageTransmissionModel =
  ConcreteModel<MessageTransmissionModel>;

export abstract class MessageTransmissionModel extends Model {
  public static readonly type = ModelType.MessageTransmission;

  public abstract timeToReach(packet: Packet): number;
}
