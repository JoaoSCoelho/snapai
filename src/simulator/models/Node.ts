import { Module } from "./Module";

export type NodeId = number;

export abstract class Node extends Module {
  public constructor(public readonly id: NodeId) {
    super();
  }
}
