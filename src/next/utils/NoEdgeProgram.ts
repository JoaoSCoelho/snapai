import { EdgeAttributes, NodeAttributes } from "@/simulator/modules/Graph";
import { EdgeRectangleProgram } from "sigma/rendering";

export class NoEdgeProgram extends EdgeRectangleProgram<
  NodeAttributes,
  EdgeAttributes
> {
  render(): void {}
  reallocate(): void {}
  process(): void {}
  processVisibleItem(): void {}
  protected bindProgram(): void {}
  drawWebGL(): void {}
  hasNothingToRender(): boolean {
    return true;
  }
  protected renderProgram(): void {}
}
