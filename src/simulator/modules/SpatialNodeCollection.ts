import { Node } from "../models/Node";
import { KDTree } from "./KDTree.new";
import { NodeCollection } from "./NodeCollection";

export class SpatialNodeCollection
  extends KDTree<Node>
  implements NodeCollection
{
  constructor(private readonly maxConnectionRadius: number) {
    super(3);
  }

  public insert(node: Node): void {
    this._insert({ coords: node.position.getCoordinates(), value: node });
  }

  public remove(node: Node): void {
    this._remove({ coords: node.position.getCoordinates(), value: node });
  }

  public getPossibleNeighbors(node: Node): Node[] {
    return this.filter([
      [
        node.position.x - this.maxConnectionRadius,
        node.position.x + this.maxConnectionRadius,
      ],
      [
        node.position.y - this.maxConnectionRadius,
        node.position.y + this.maxConnectionRadius,
      ],
      [
        node.position.z - this.maxConnectionRadius,
        node.position.z + this.maxConnectionRadius,
      ],
    ]);
  }

  public reposition(node: Node, newCoords: number[]): void {
    this._remove({ coords: node.position.getCoordinates(), value: node });
    this._insert({ coords: newCoords, value: node });
  }
}
