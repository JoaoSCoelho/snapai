import { Node } from "../models/Node";

export interface NodeCollection {
  /**
   * Returns all nodes that are candidates for being neighbors of the given node.
   */
  getPossibleNeighbors(node: Node): Node[];

  /** Inserts the given node into the collection. */
  insert(node: Node): void;

  /** Removes the given node from the collection. */
  remove(node: Node): void;

  /** Updates the position of the given node. */
  reposition(node: Node, newCoords: number[]): void;
}
