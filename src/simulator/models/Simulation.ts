import { SimulationLogger } from "./SimulationLogger";
import { Project } from "./Project";
import { SimulationStatistics } from "./SimulationStatistics";
import { MessageTransmissionModel } from "./MessageTransmissionModel";
import { Global } from "@/simulator/Global";
import { DirectedGraph } from "graphology";
import { PacketsInTheAirBuffer } from "../tools/PacketsInTheAirBuffer";
import { ConcreteNode, Node, NodeId } from "./Node";
import { Edge } from "./Edge";
import { AddNodesFormSchema } from "@/next/components/AddNodesForm";
import { SearchEngine } from "../utils/SearchEngine";
import { ConcreteModel } from "./Model";
import { ModelType } from "../utils/modelsUtils";
import { Position } from "../tools/Position";
import { Graph } from "../modules/Graph";
import { set } from "zod";
import { Thread } from "./Thread";
import { SynchronousThread } from "./SynchronousThread";
import { SynchronousSimulation } from "./SynchronousSimulation";

export type SimulationOptions = {
  loggerOptions?: { useConsole: boolean };
  project: Project;

  messageTransmissionModel: MessageTransmissionModel;
};

export abstract class Simulation {
  public readonly id: number = ++Global.lastId;
  public isRunnig: boolean = false;
  public abstract readonly isAsyncMode: boolean;
  public readonly startTime: Date | null = null;
  public readonly project: Project;
  public readonly logger: SimulationLogger;
  public abstract statistics: SimulationStatistics;
  public currentTime: number = 0;
  public readonly messageTransmissionModel: MessageTransmissionModel;
  public lastNodeId = 0;
  public readonly graph = new Graph();
  public readonly packetsInTheAir: PacketsInTheAirBuffer;
  private currentThread: Thread | null = null;

  public constructor({
    loggerOptions,
    project,
    messageTransmissionModel,
  }: SimulationOptions) {
    this.project = project;
    this.logger = new SimulationLogger(loggerOptions?.useConsole, this);
    this.messageTransmissionModel = messageTransmissionModel;
    this.packetsInTheAir = new PacketsInTheAirBuffer(this);
  }

  /**
   * Runs the simulation using the given thread.
   * @param thread the thread to be used for the simulation
   * @returns a promise that resolves when the simulation is finished
   */
  public async run(thread: Thread): Promise<void> {
    if (this.isRunnig) return;

    this.currentThread = thread;

    await this.project.preRun();
    await this.currentThread.run();
  }

  /**
   * Stops the simulation.
   * @returns a promise that resolves when the simulation is stopped
   */
  public async stop() {
    await this.currentThread?.stop();
    this.isRunnig = false;
    this.currentThread = null;
  }

  /**
   * Retrieves all nodes in the simulation.
   * @returns {Node[]} An array of all nodes in the simulation.
   */
  public getNodes(): Node[] {
    return this.graph.reduceNodes(
      (acc, _, { implementation }) =>
        implementation ? [...acc, implementation] : acc,
      [] as Node[],
    );
  }

  /**
   * Retrieves the number of nodes in the simulation.
   * @returns {number} The number of nodes in the simulation.
   */
  public nodeSize(): number {
    return this.graph.nodes().length;
  }

  /**
   * Retrieves all edges in the simulation.
   * @returns {Edge[]} An array of all edges in the simulation.
   */
  public getEdges(): Edge[] {
    return this.graph.reduceEdges(
      (acc, _, { implementation }) =>
        implementation ? [...acc, implementation] : acc,
      [] as Edge[],
    );
  }

  /**
   * Retrieves the number of edges in the simulation.
   * @returns {number} The number of edges in the simulation.
   */
  public edgeSize(): number {
    return this.graph.edges().length;
  }

  /**
   * Retrieves a node by its ID.
   * @param {number} id - The ID of the node to retrieve.
   * @returns {Node} The retrieved node or undefined if the node does not exist.
   */
  public getNode(id: number): Node | undefined {
    return this.graph.getNodeAttribute(id, "implementation");
  }

  /**
   * Retrieves a node by its ID and throws an error if the node does not exist.
   * @param {number} id - The ID of the node to retrieve.
   * @returns {Node} The retrieved node.
   * @throws {Error} If the node does not exist.
   */
  public getCertainNode(id: number): Node {
    const node = this.getNode(id);

    if (!node) throw new Error("Node not found");

    return node;
  }

  /**
   * Checks if an edge exists between two nodes.
   * @param {number} source - The source node of the edge.
   * @param {number} target - The target node of the edge.
   * @throws {Error} If the edges are not consistent.
   * @returns {boolean} True if the edge exists, false otherwise.
   */
  public hasEdge(source: number, target: number): boolean {
    return this.graph.hasEdge(source, target);
  }

  /**
   * Retrieves an edge by its source and target nodes.
   * @param {number} source - The source node of the edge.
   * @param {number} target - The target node of the edge.
   * @returns {Edge} The retrieved edge or undefined if the edge does not exist.
   */
  public getEdge(source: number, target: number): Edge | undefined {
    return this.graph.getEdgeAttribute(source, target, "implementation");
  }

  /**
   * Adds an edge to the graph.\
   * The edge is expected to be an instance of the Edge class or an array in the format [source, target].\
   * If the edge is provided as an array, it is assumed to be an edge in the format [source, target].\
   * The edge is then added to the graph and stored in the this.edges map.\
   * The edge is also stored in the graph with the implementation as the attribute.
   *
   * @example
   * // Add an edge using an Edge instance
   * const edge = new Edge(1, 2);
   * simulation.addEdge(edge);
   *
   * @example
   * // Add an edge using an array
   * simulation.addEdge([1, 2]);
   *
   * @throws {Error} If the edge already exists.
   * @throws {Error} If the node does not exist.
   * @param {Edge | [number, number]} edge - The edge to add. If an array is provided, it is assumed to be an edge in the format [source, target].
   */
  public addEdge(edge: Edge | [number, number]) {
    if (Array.isArray(edge)) edge = Edge.fromPair(edge);

    if (this.hasEdge(edge.source, edge.target))
      throw new Error("Edge already exists");

    this.onlyAddEdge(edge);

    this.notifyNeighborhoodChanged([edge.source, edge.target]);
  }

  /**
   * Adds an edge to the graph without checking if the edge already exists.
   * @param {Edge | [number, number]} edge - The edge to add. If an array is provided, it is assumed to be an edge in the format [source, target].
   */
  public onlyAddEdge(edge: Edge | [number, number]) {
    if (Array.isArray(edge)) edge = Edge.fromPair(edge);
    this.graph.addEdge(edge.source, edge.target, {
      implementation: edge,
      width: 1,
      type: "arrow", // TODO: turn it dinamically
    });
  }

  /**
   * Removes an edge from the graph.
   * The edge is expected to be an instance of the Edge class or an array in the format [source, target].
   * If the edge is provided as an array, it is assumed to be an edge in the format [source, target].
   * The edge is then removed from the graph and deleted from the this.edges map.
   * The edge is also removed from the graph with the implementation as the attribute.
   *
   * @example
   * // Remove an edge using an Edge instance
   * const edge = new Edge(1, 2);
   * simulation.removeEdge(edge);
   *
   * @example
   * // Remove an edge using an array
   * simulation.removeEdge([1, 2]);
   *
   * @param {Edge | [number, number]} edge - The edge to remove. If an array is provided, it is assumed to be an edge in the format [source, target].
   */
  public removeEdge(edge: Edge | [number, number]) {
    if (!Array.isArray(edge)) edge = [edge.source, edge.target];

    this.onlyRemoveEdge(edge);

    this.notifyNeighborhoodChanged(edge);
  }

  public onlyRemoveEdge(edge: Edge | [number, number]) {
    if (!Array.isArray(edge)) edge = [edge.source, edge.target];

    this.graph.dropEdge(edge[0], edge[1]);
  }

  /**
   * Adds a batch of nodes to the simulation.
   * The nodes are expected to be of the same type and have the same parameters.
   * The nodes are added to the simulation and their initial positions are set based on the distributionModel.
   * The nodes are also initialized and added to the graph.
   * The nodes are stored in the this.nodes map.
   *
   * @param {AddNodesFormSchema} data - The data to add the batch of nodes.
   * @throws {Error} If a node does not satisfy its requirements.
   */
  public addBatchOfNodes(data: AddNodesFormSchema) {
    for (let _ = 0; _ < data.numberOfNodes; _++) {
      const NodeCls = SearchEngine.getNodeByIdentifier(data.node);
      const MobilityModelCls = SearchEngine.getGenericModel(
        data.mobilityModel,
        ModelType.Mobility,
      );
      const ConnectivityModelCls = SearchEngine.getGenericModel(
        data.connectivityModel,
        ModelType.Connectivity,
      );
      const ReliabilityModelCls = SearchEngine.getGenericModel(
        data.reliabilityModel,
        ModelType.Reliability,
      );
      const InterferenceModelCls = SearchEngine.getGenericModel(
        data.interferenceModel,
        ModelType.Interference,
      );
      const DistributionModelCls = SearchEngine.getGenericModel(
        data.distributionModel,
        ModelType.Distribution,
      );
      const UsedPacketCls = SearchEngine.getPacketByIdentifier(data.usedPacket);

      const mobilityModel = new MobilityModelCls(
        data.mobilityModelParameters,
        this,
      );
      const connectivityModel = new ConnectivityModelCls(
        data.connectivityModelParameters,
        this,
      );
      const reliabilityModel = new ReliabilityModelCls(
        data.reliabilityModelParameters,
        this,
      );
      const interferenceModel = new InterferenceModelCls(
        data.interferenceModelParameters,
        this,
      );
      const distributionModel = new DistributionModelCls(
        data.distributionModelParameters,
        this,
      );

      const node = new NodeCls(
        ++this.lastNodeId,
        mobilityModel,
        connectivityModel,
        interferenceModel,
        reliabilityModel,
        UsedPacketCls,
        Position.inert(),
        data.nodeParameters,
        this,
      );

      node.reposition(distributionModel.getNextPosition(node)); // Set the initial position of the node based on the distributionModel.

      if (!node.checkRequirements()) {
        throw new Error(
          `Node ${NodeCls.name} - ${node.id} does not satisfy its requirements.`,
        );
      }

      node.init();

      this.addNode(node);
    }
  }

  /**
   * Adds a node to the simulation.
   *
   * If a node with the same id already exists, an error is thrown.
   *
   * @param {Node} node - The node to add.
   * @throws {Error} If a node with the same id already exists.
   */
  protected addNode(node: Node) {
    if (this.hasNode(node.id)) throw new Error("Node already exists");

    this.graph.addNode(node.id, {
      x: node.position.x,
      y: node.position.y,
      z: node.position.z,
      size: 5,
      implementation: node,
      label: node.id.toString(),
    });
  }

  /**
   * Checks if a node is stored in this.nodes and this.graph.
   * Throws an error if the nodes are not consistent.
   * @param {Node | NodeId} node - The node to check.
   * @returns {boolean} True if the node is stored, false otherwise.
   * @throws {Error} If the nodes are not consistent.
   */
  public hasNode(node: Node | NodeId): boolean {
    node = node instanceof Node ? node.id : node;

    return this.graph.hasNode(node);
  }

  /**
   * Notifies all nodes in the provided array that their neighborhood has changed.
   *
   * If the array contains NodeId, it will be converted to Node[].
   * If the array contains a mix of Node and NodeId, an error will be thrown.
   *
   * @param {Node[] | NodeId[]} nodes - The array of nodes to notify.
   */
  private notifyNeighborhoodChanged(nodes: Node[] | NodeId[]) {
    if (!nodes.length) return;

    if (nodes.some((n) => !(n instanceof Node))) {
      nodes = nodes.map((id) => {
        if (id instanceof Node)
          throw new Error(
            "Node array not consistent, should be entire Node[] or entire NodeId[]",
          );

        const node = this.getCertainNode(id);

        return node;
      });
    }

    for (const node of nodes) (node as Node).onNeighborhoodChange();
  }

  /**
   * Retrieves all the edges that are leaving the given node.
   *
   * If the input is a NodeId, it will be converted to Node.
   * If the input is a mix of Node and NodeId, an error will be thrown.
   *
   * @param {Node | NodeId} node - The node from which the edges are retrieved.
   * @returns {Edge[]} The retrieved edges.
   */
  public getOutgoingEdges(node: Node | NodeId): Edge[] {
    node = node instanceof Node ? node.id : node;

    return this.graph
      .outEdges(node)
      .filter((e) => this.graph.getEdgeAttributes(e).implementation)
      .map((e) => this.graph.getEdgeAttributes(e).implementation!);
  }
}
