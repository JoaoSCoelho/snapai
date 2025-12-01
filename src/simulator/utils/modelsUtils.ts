import { ConnectivityModel } from "../models/ConnectivityModel";
import { DistributionModel } from "../models/DistributionModel";
import { InterferenceModel } from "../models/InterferenceModel";
import { MessageTransmissionModel } from "../models/MessageTransmissionModel";
import { MobilityModel } from "../models/MobilityModel";
import { ReliabilityModel } from "../models/ReliabilityModel";

export enum ModelType {
  Connectivity = "connectivity",
  Mobility = "mobility",
  Interference = "interference",
  Reliability = "reliability",
  Distribution = "distribution",
  MessageTransmission = "message_transmission",
}

export enum ExtendedModelType {
  Connectivity = "connectivity",
  Mobility = "mobility",
  Interference = "interference",
  Reliability = "reliability",
  Distribution = "distribution",
  MessageTransmission = "message_transmission",
  All = "all",
}

export type ModelTypeToModel = {
  connectivity: ConnectivityModel;
  mobility: MobilityModel;
  interference: InterferenceModel;
  reliability: ReliabilityModel;
  distribution: DistributionModel;
  message_transmission: MessageTransmissionModel;
};

export type ModelTypeToModelConstructor = {
  connectivity: typeof ConnectivityModel;
  mobility: typeof MobilityModel;
  interference: typeof InterferenceModel;
  reliability: typeof ReliabilityModel;
  distribution: typeof DistributionModel;
  message_transmission: typeof MessageTransmissionModel;
};
