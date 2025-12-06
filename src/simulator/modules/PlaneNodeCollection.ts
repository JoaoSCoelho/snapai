import { Node } from "../models/Node";
import { NodeCollection } from "./NodeCollection";
import { SpatialHash } from "./SpatialHash";

export class PlaneNodeCollection
  extends SpatialHash<Node>
  implements NodeCollection
{
  constructor(private readonly maxConnectionRadius: number) {
    super(maxConnectionRadius);
  }

  public getPossibleNeighbors(node: Node): Node[] {
    return super.queryNeighbors(node);
  }

  public reposition(node: Node, newCoords: [number, number]): void {
    super.move(node, newCoords[0], newCoords[1]);
  }
}
