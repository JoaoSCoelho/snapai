import { ConnectivityModel } from "@/simulator/models/ConnectivityModel";
import { InterferenceModel } from "@/simulator/models/InterferenceModel";
import { MobilityModel } from "@/simulator/models/MobilityModel";
import { Node, NodeId } from "@/simulator/models/Node";
import { ConcretePacket } from "@/simulator/models/Packet";
import { ReliabilityModel } from "@/simulator/models/ReliabilityModel";
import { Simulation } from "@/simulator/models/Simulation";
import { Inbox } from "@/simulator/tools/Inbox";
import { Position } from "@/simulator/tools/Position";
import { ModelType, ModelTypeToModel } from "@/simulator/utils/modelsUtils";

export class InertNode extends Node {
  public constructor(
    public readonly id: NodeId,
    public mobilityModel: MobilityModel,
    public connectivityModel: ConnectivityModel,
    public interferenceModel: InterferenceModel,
    public reliabilityModel: ReliabilityModel,
    public UsedPacket: ConcretePacket,
    public position: Position,
    public readonly parameters: Record<string, any>,
    public readonly simulation: Simulation,
  ) {
    super(
      id,
      mobilityModel,
      connectivityModel,
      interferenceModel,
      reliabilityModel,
      UsedPacket,
      position,
      parameters,
      simulation,
    );
  }

  public handleMessages(inbox: Inbox): void {
    // Do nothing
  }

  public preStep(): void {
    // Do nothing
  }

  public postStep(): void {
    // Do nothing
  }

  public init(): void {
    // Do nothing
  }

  public checkRequirements(): boolean {
    // Do nothing
    return true;
  }

  public onReposition() {
    // Do nothing
  }

  public onNeighborhoodChange() {
    // Do nothing
  }

  public onModelChange<MT extends ModelType>(
    modelType: MT,
    oldModel: ModelTypeToModel[MT],
    newModel: ModelTypeToModel[MT],
  ) {
    // Do nothing
  }
}
