"use client";
import type { Sigma } from "sigma";
import { Node } from "./Node";
import { SynchronousSimulation } from "./SynchronousSimulation";
import { Thread } from "./Thread";
import { Graph } from "../modules/Graph";

export type SynchronousThreadEventMap = {
  start: [];
  stop: [];
  end: [];
  interrupt: [];
  roundEnd: [];
  finish: [];
  preRound: [];
  frame: [reason: "refresh" | "frame"];
};

export class SynchronousThread extends Thread<SynchronousThreadEventMap> {
  private shouldStop = false;
  public currentRound = 0;

  public constructor(
    public readonly simulation: SynchronousSimulation,
    public readonly rounds: number,
    public readonly refreshRate: number,
    public readonly frameRate: number,
  ) {
    super(simulation);
  }

  public async stop() {
    this.shouldStop = true;
  }

  /**
   * Runs the simulation.
   * This method sets the isRunnig flag to true and starts the simulation.
   * It is used to start the simulation from running.
   * @returns A promise that resolves when the simulation has finished.
   */
  public async run() {
    try {
      let startTime = new Date();
      this.simulation.isRunning = true;
      this.simulation.logger.log("Simulation started.");
      if (this.simulation.currentTime === 0) {
        // @ts-ignore
        this.simulation.startTime = startTime;
      }
      this.simulation.startTimeOfRound = startTime;
      this.emit("start");
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
      for (
        this.currentRound = 0;
        this.currentRound < this.rounds;
        this.currentRound++
      ) {
        if ((this.simulation.isRunning as boolean) === false) {
          this.emit("interrupt");
          this.emit("end");
          this.simulation.logger.log(
            `Simulation is not running in round ${this.currentRound} of ${this.rounds} in ${(Date.now() - startTime.getTime()) / 1000} s.`,
          );
          return;
        }
        if (this.shouldStop) {
          this.simulation.logger.log(
            `Simulation stopped in round ${this.currentRound} of ${this.rounds} in ${(Date.now() - startTime.getTime()) / 1000} s.`,
          );
          this.simulation.isRunning = false;
          this.emit("stop");
          this.emit("end");
          return;
        }

        if (shouldSleepRound) {
          const sleepTime = roundEach - (Date.now() - lastTime) - pendent;
          pendent = 0;
          if (sleepTime > 0) {
            if (sleepTime < 6) {
              pendent += 6 - sleepTime;
            }

            this.emit("frame", "refresh");
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

          lastFrameTime = Date.now();

          this.emit("frame", "frame");
          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        passedTime = Date.now() - refreshingTime;
        if (passedTime > 250) {
          refreshingCount.push(
            (1000 / passedTime) * (this.currentRound - lastFrameCount),
          );
          if (refreshingCount.length > 10) refreshingCount.shift();
          this.refreshingRate =
            refreshingCount.reduce((a, b) => a + b, 0) / refreshingCount.length;
          lastFrameCount = this.currentRound;
          refreshingTime = Date.now();
        }

        this.simulation.currentTime++;
        this.simulation.isEvenRound = !this.simulation.isEvenRound;

        this.emit("preRound");

        await this.simulation.project.preRound();
        await this.round();
        await this.simulation.project.postRound();
        this.emit("roundEnd");
        if (this.simulation.project.hasTerminated()) this.stop();
      }

      this.simulation.isRunning = false;
      this.emit("finish");
      this.emit("end");
      this.simulation.logger.log(
        `Simulation finished ${this.rounds} rounds in ${(Date.now() - startTime.getTime()) / 1000} s.`,
      );
    } catch (e) {
      this.simulation.isRunning = false;
      this.emit("interrupt");
      this.emit("end");
      this.simulation.logger.log(
        `Simulation interrupted in round ${this.rounds} by error: ${e}.`,
      );
      throw e;
    }
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

    if (this.simulation.project.simulationConfig.mobilityEnabled) {
      this.moveNodes();
    }

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
      if (node.mobilityEnabled) this.repositionNode(node);
    }
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

  /**
   * Repositions a node in the simulation.
   * This method is used to update the position of a node in the simulation.
   * It calls the reposition method of the node with the next position as given by the mobility model.
   * The node attributes in the simulation graph are then updated with the new position of the node.
   * @param node The node to reposition.
   */
  private repositionNode(node: Node): void {
    const newPosition = node.mobilityModel.getNextPosition(node);

    this.simulation.updateNodePosition(node, newPosition);
  }
}
