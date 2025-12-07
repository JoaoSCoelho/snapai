"use client";
import type { Sigma } from "sigma";
import { Node } from "./Node";
import { SynchronousSimulation } from "./SynchronousSimulation";
import { Thread } from "./Thread";
import { Graph } from "../modules/Graph";

export class SynchronousThread extends Thread {
  public constructor(
    public readonly simulation: SynchronousSimulation,
    public readonly rounds: number,
    public readonly refreshRate: number,
    public readonly frameRate: number,
    public readonly sigma: Sigma,
    public readonly onStart: () => void = () => {},
    public readonly onEnd: () => void = () => {},
    public readonly onInterrupt: () => void = () => {},
    public readonly onRoundEnd: () => void = () => {},
  ) {
    super(simulation);
  }

  /**
   * Stops the simulation.
   * This method sets the isRunnig flag to false.
   * It is used to stop the simulation from running.
   * @returns A promise that resolves when the simulation has been stopped.
   */
  public async stop() {
    this.simulation.isRunnig = false;
  }

  /**
   * Runs the simulation.
   * This method sets the isRunnig flag to true and starts the simulation.
   * It is used to start the simulation from running.
   * @returns A promise that resolves when the simulation has finished.
   */
  public async run() {
    let startTime = new Date();
    this.simulation.isRunnig = true;
    this.simulation.logger.log("Simulation started.");
    if (this.simulation.currentTime === 0) {
      // @ts-ignore
      this.simulation.startTime = startTime;
    }
    this.simulation.startTimeOfRound = startTime;
    this.onStart();

    const frameEach = this.frameRate === 0 ? 0 : 1000 / this.frameRate;
    const roundEach = 1000 / this.refreshRate;
    const shouldSleepRound = roundEach !== Infinity;
    let lastFrameTime = Date.now();
    let refreshingTime = Date.now();
    let lastTime = Date.now();
    let lastFrameCount = 0;
    let framingCount = [];
    let refreshingCount = [];
    let pendent = 0;
    for (let i = 0; i < this.rounds; i++) {
      if ((this.simulation.isRunnig as boolean) === false) {
        this.onInterrupt();
        this.simulation.logger.log(
          `Simulation stopped in round ${i} of ${this.rounds} in ${(Date.now() - startTime.getTime()) / 1000} s.`,
        );
        return;
      }

      if (shouldSleepRound) {
        const sleepTime = roundEach - (Date.now() - lastTime) - pendent;
        pendent = 0;
        if (sleepTime > 0) {
          if (sleepTime < 6) {
            pendent += 6 - sleepTime;
          }
          await new Promise((resolve) => setTimeout(resolve, sleepTime));
        }
        lastTime = Date.now();
      }

      let passedTime = Date.now() - lastFrameTime;
      if (passedTime > frameEach) {
        framingCount.push(1000 / passedTime);
        if (framingCount.length > 10) framingCount.shift();
        this.framingRate =
          framingCount.reduce((a, b) => a + b, 0) / framingCount.length;
        await new Promise((resolve) => setTimeout(resolve, 0));
        lastFrameTime = Date.now();
      }

      passedTime = Date.now() - refreshingTime;
      if (passedTime > 250) {
        refreshingCount.push((1000 / passedTime) * (i - lastFrameCount));
        if (refreshingCount.length > 10) refreshingCount.shift();
        this.refreshingRate =
          refreshingCount.reduce((a, b) => a + b, 0) / refreshingCount.length;
        lastFrameCount = i;
        refreshingTime = Date.now();
      }

      this.simulation.currentTime++;
      this.simulation.isEvenRound = !this.simulation.isEvenRound;

      this.sigma.setGraph(new Graph());
      await this.simulation.project.preRound();
      await this.round();
      await this.simulation.project.postRound();
      this.onRoundEnd();
      this.sigma.setGraph(this.simulation.graph);
      if (this.simulation.project.hasTerminated()) this.stop();
    }

    this.simulation.isRunnig = false;
    this.onEnd();
    this.simulation.logger.log(
      `Simulation finished ${this.rounds} rounds in ${(Date.now() - startTime.getTime()) / 1000} s.`,
    );
  }

  /**
   * Simulates one round of the simulation.
   * In this round, it first handles all global timers that fire in this round.
   * Then, it moves all nodes to their new positions.
   * If connectivity is enabled, it updates the connections between nodes.
   * If interference is enabled, it tests all packets in the air for interference.
   * Finally, it steps all nodes, i.e. it calls their step() method.
   */
  private async round() {
    this.simulation.handleGlobalTimers();

    this.moveNodes();

    if (this.simulation.project.simulationConfig.connectivityEnabled) {
      await this.updateConnections();
    }

    if (this.simulation.project.simulationConfig.interferenceEnabled) {
      this.simulation.packetsInTheAir.testForInterference();
    }

    this.stepNodes();
  }

  /**
   * Moves all nodes in the simulation to their new positions.
   * This method goes through all nodes and repositions them according to their mobility model.
   * The node attributes in the simulation graph are then updated with the new position of the node.
   */
  private moveNodes() {
    for (const [, node] of this.simulation.nodes) {
      this.repositionNode(node);
    }
  }

  /**
   * Repositions a node in the simulation.
   * This method is used to update the position of a node in the simulation.
   * It calls the reposition method of the node with the next position as given by the mobility model.
   * The node attributes in the simulation graph are then updated with the new position of the node.
   * @param node The node to reposition.
   */
  private repositionNode(node: Node): void {
    const newPosition = node.mobilityModel.getNextPosition(node);

    // This call should be before node reposition
    this.simulation.nodesCollection.reposition(
      node,
      newPosition.getCoordinates(),
    );

    node.reposition(newPosition);
    this.simulation.graph.updateNodeAttributes(node.id, (att) => ({
      ...att,
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
    }));
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
