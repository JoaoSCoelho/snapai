import { Node } from "@/simulator/models/Node";
import { Inbox } from "@/simulator/tools/Inbox";
import { ModelType, ModelTypeToModel } from "@/simulator/utils/modelsUtils";

export class InertNode extends Node {
  public readonly name = "Inert Node";

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
