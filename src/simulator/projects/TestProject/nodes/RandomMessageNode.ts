import { CheckboxField } from "@/simulator/configurations/layout/fields/CheckboxField";
import { ColorField } from "@/simulator/configurations/layout/fields/ColorField";
import { NumberField } from "@/simulator/configurations/layout/fields/NumberField";
import { Line } from "@/simulator/configurations/layout/Line";
import { ParametersSubsection } from "@/simulator/configurations/layout/ParametersSubsection";
import { ConnectivityModel } from "@/simulator/models/ConnectivityModel";
import { InterferenceModel } from "@/simulator/models/InterferenceModel";
import { Message } from "@/simulator/models/Message";
import { MobilityModel } from "@/simulator/models/MobilityModel";
import { Node, NodeId } from "@/simulator/models/Node";
import { ConcretePacket } from "@/simulator/models/Packet";
import { ReliabilityModel } from "@/simulator/models/ReliabilityModel";
import { Simulation } from "@/simulator/models/Simulation";
import { Inbox } from "@/simulator/tools/Inbox";
import { Position } from "@/simulator/tools/Position";
import { ModelType, ModelTypeToModel } from "@/simulator/utils/modelsUtils";
import { RandomUtils } from "@/simulator/utils/RandomUtils";
import z from "zod";

export type RandomMessageNodeParametersSchema = {
  initialColor: string;
  size: number;
  haveMobility: boolean;
};

export class RandomMessageNode extends Node {
  public readonly name = "Random message Node";

  public constructor(
    public readonly id: NodeId,
    public mobilityModel: MobilityModel,
    public connectivityModel: ConnectivityModel,
    public interferenceModel: InterferenceModel,
    public reliabilityModel: ReliabilityModel,
    public UsedPacket: ConcretePacket,
    public position: Position,
    public readonly parameters: RandomMessageNodeParametersSchema,
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

  public static getParametersSubsection() {
    return ParametersSubsection.create({
      lines: [
        new Line([
          ColorField.create({
            name: "initialColor",
            label: "Initial Color",
            occupedColumns: 4,
            required: true,
            schema: z.string().min(7).max(7).startsWith("#"),
            info: {
              title: "Initial color of the node in the simulation",
            },
          }),
          NumberField.create({
            name: "size",
            label: "Size",
            occupedColumns: 4,
            required: true,
            isFloat: true,
            min: 0,
            schema: z.number().min(0),
            info: {
              title: "Size of the node in the simulation",
            },
          }),
          CheckboxField.create({
            name: "haveMobility",
            label: "Have Mobility",
            occupedColumns: 4,
            schema: z.boolean(),
            info: {
              title: "True if the node has mobility",
            },
          }),
        ]),
      ],
    });
  }

  public handleMessages(inbox: Inbox): void {
    const edge = RandomUtils.randomChoice(
      this.getOutgoingEdges().values().toArray(),
    );

    if (!edge) return;

    const target = this.simulation.getCertainNode(edge.target);

    const message = new Message(`Message from ${this.id} to ${target.id}`);
    this.send(message, target);
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

  public onNeighborhoodChange(): void {
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
