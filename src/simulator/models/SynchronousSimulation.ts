import { Simulation, SimulationOptions } from "./Simulation";
import { SynchronousSimulationStatistics } from "./SynchronousSimulationStatistics";
import { OrderedTimerSet } from "../modules/OrderedTimerSet";
import { Edge } from "./Edge";
import { Node } from "./Node";
import { SynchronousThread } from "./SynchronousThread";

export type SynchronousSimulationOptions = SimulationOptions & {};

export class SynchronousSimulation extends Simulation {
  public isEvenRound: boolean = false;
  public readonly isAsyncMode: boolean = false;
  public startTimeOfRound: Date | null = null;
  public statistics: SynchronousSimulationStatistics;
  public globalTimers: OrderedTimerSet = new OrderedTimerSet();
  public currentThread: SynchronousThread | null = null;

  public constructor({ ...options }: SimulationOptions) {
    super(options);
    this.statistics = new SynchronousSimulationStatistics(this, {
      registerStatisticsForEveryRound:
        this.project.simulationConfig.getRegisterStatisticsForEveryRound(),
    });
  }

  public handleGlobalTimers() {
    if (this.globalTimers.empty()) return;

    while (
      this.globalTimers.begin().pointer.getFireTime() <= this.currentTime
    ) {
      const timer = this.globalTimers.begin().pointer;

      this.globalTimers.eraseElementByIterator(this.globalTimers.begin());
      timer.fire();
    }
  }

  /**
   * Reevaluates the connections between nodes.
   * This method goes through all nodes and checks if they are connected according to their connectivity model.
   * If a connection is found and there is no edge between the nodes, an edge is added to the simulation graph.
   * If a connection is not found and there is an edge between the nodes, the edge is removed from the simulation graph.
   * The onNeighborhoodChange method is called on each node that has a change in its neighborhood.
   */
  public async reevaluateConnections(
    callback?: (progress: number) => Promise<void>,
  ): Promise<void> {
    const maxConnectionRadius =
      this.project.simulationConfig.maxConnectionRadius;

    let timer = Date.now();
    let progress = 0;
    for (const [, node] of this.nodes) {
      progress++;
      const possibleNeighborhood = maxConnectionRadius
        ? this.nodesCollection.getPossibleNeighbors(node)
        : this.nodes;

      if (Date.now() - timer > 1000 && callback) {
        timer = Date.now();
        if (callback) callback(progress / this.nodes.size);
        await new Promise((r) => setTimeout(r));
      }

      const deprecatedEdges = new Map<number, Edge>();
      node.getOutgoingEdges().forEach((edge) => {
        deprecatedEdges.set(edge.target, edge);
      });
      node.hasNeighborhoodChanges = false;

      for (const pN of possibleNeighborhood) {
        const candidate = pN instanceof Node ? pN : pN[1];
        if (node === candidate) continue;

        const isConnected = node.connectivityModel.isConnected(node, candidate);
        const hasEdge = this.hasEdge(node.id, candidate.id);

        if (isConnected && !hasEdge) {
          this.onlyAddEdge([node.id, candidate.id]);
          node.hasNeighborhoodChanges = true;
        } else if (isConnected && hasEdge) {
          deprecatedEdges.delete(candidate.id);
        } else if (!isConnected && hasEdge) {
          this.onlyRemoveEdge([node.id, candidate.id]);
          deprecatedEdges.delete(candidate.id);
          node.hasNeighborhoodChanges = true;
        }
      }

      if (deprecatedEdges.size > 0) {
        deprecatedEdges.forEach((edge) => {
          this.onlyRemoveEdge(edge);
        });
        node.hasNeighborhoodChanges = true;
      }
    }
  }
}
