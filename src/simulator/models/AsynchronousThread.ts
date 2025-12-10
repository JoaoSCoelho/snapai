"use client";
import type { Sigma } from "sigma";
import { Thread } from "./Thread";
import { AsynchronousSimulation } from "./AsynchronousSimulation";

// TODO: finish to implement it
export class AsynchronousThread extends Thread {
  private shouldStop = false;
  public currentEvent = 0;

  public constructor(
    public readonly simulation: AsynchronousSimulation,
    public readonly events: number,
    public readonly refreshRate: number,
    public readonly frameRate: number,
    public readonly sigma: Sigma,
    public readonly onStart: () => void = () => {},
    public readonly onEnd: () => void = () => {},
    public readonly onInterrupt: () => void = () => {},
    public readonly onEventEnd: () => void = () => {},
    public readonly onFinish: () => void = () => {},
    public readonly onStop: () => void = () => {},
  ) {
    super(simulation);
  }

  public async stop() {
    this.shouldStop = true;
  }

  public async run() {
    // TODO: NOT IMPLEMENTED
  }

  /**
   * Updates the connections of all nodes in the simulation.
   * This method goes through all nodes and checks if they are connected according to their connectivity model.
   * If a connection is found and there is no edge between the nodes, an edge is added to the simulation graph.
   * If a connection is not found and there is an edge between the nodes, the edge is removed from the simulation graph.
   * The onNeighborhoodChange method is called on each node that has a change in its neighborhood.
   */
  private async updateConnections() {
    await this.simulation.reevaluateConnections();
  }

  /**
   * Steps all nodes in the simulation.
   * This method goes through all nodes and calls their step method.
   * The step method is responsible for updating the node's internal state and sending messages.
   */
  private stepNodes() {
    for (const [, node] of this.simulation.nodes) {
      node.step();
    }
  }
}
