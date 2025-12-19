import { SimulationLogger } from "./SimulationLogger";
import { Project } from "./Project";
import { SimulationStatistics } from "./SimulationStatistics";
import { MessageTransmissionModel } from "./MessageTransmissionModel";
import { Global } from "@/simulator/Global";
import { PacketsInTheAirBuffer } from "../tools/PacketsInTheAirBuffer";
import { Node, NodeId } from "./Node";
import { Edge } from "./Edge";
import { AddNodesFormSchema } from "@/next/components/AddNodesForm";
import { SearchEngine } from "../utils/SearchEngine";
import { ModelType } from "../utils/modelsUtils";
import { Position } from "../tools/Position";
import { Graph } from "../modules/Graph";
import { Thread } from "./Thread";
import { NodeCollection } from "../modules/NodeCollection";
import { EdgeMap } from "../modules/EdgeMap";
import EventEmitter from "node:events";
import { strongContrastWithColor } from "../utils/colorUtils";

export type SimulationOptions = {
  loggerOptions?: { useConsole: boolean };
  project: Project;
  messageTransmissionModel: MessageTransmissionModel;
  nodeCollection: NodeCollection;
};

export type SimulationEventMap = {
  preRun: [thread: Thread];
  addNode: [node: Node];
  repositionNode: [node: Node, oldPosition: Position, newPosition: Position];
};

export abstract class Simulation extends EventEmitter<SimulationEventMap> {
  public readonly id: number = ++Global.lastId;
  public isRunning: boolean = false;
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
  public currentThread: Thread | null = null;
  public readonly nodesCollection: NodeCollection;
  public readonly nodes: Map<NodeId, Node> = new Map();
  public readonly edges: EdgeMap = new EdgeMap();
  public readonly pinnedNodes: Map<NodeId, Node> = new Map();

  public constructor({
    loggerOptions,
    project,
    messageTransmissionModel,
    nodeCollection,
  }: SimulationOptions) {
    super();
    this.project = project;
    this.logger = new SimulationLogger(loggerOptions?.useConsole, this);
    this.messageTransmissionModel = messageTransmissionModel;
    this.packetsInTheAir = new PacketsInTheAirBuffer(this);
    this.nodesCollection = nodeCollection;
  }

  /**
   * Runs the simulation using the given thread.
   * @param thread the thread to be used for the simulation
   * @returns a promise that resolves when the simulation is finished
   */
  public async run(thread: Thread): Promise<void> {
    if (this.isRunning) return;

    this.currentThread = thread;

    await this.project.preRun();
    this.emit("preRun", thread);
    await this.currentThread.run();
  }

  /**
   * Stops the simulation.
   * @returns a promise that resolves when the simulation is stopped
   */
  public async stop() {
    await this.currentThread?.stop();
    this.currentThread = null;
  }

  /** Reevaluates the connections between nodes */
  public abstract reevaluateConnections(
    callback?: (progress: number) => Promise<void>,
  ): Promise<void>;

  /**
   * Updates the position of the given node in the simulation graph.
   * @param node the node to update the position for or its id
   * @param newPosition the new position of the node
   */
  public updateNodePosition(node: Node | NodeId, newPosition: Position) {
    node = node instanceof Node ? node : this.getCertainNode(node);
    const oldPosition = node.position.copy();
    newPosition = Position.cropToDimensions(newPosition, [
      this.project.simulationConfig.dimX,
      this.project.simulationConfig.dimY,
      this.project.simulationConfig.dimZ,
    ]);
    // This call should be before node reposition
    this.nodesCollection.reposition(node, newPosition.getCoordinates());

    node.reposition(newPosition);
    this.graph.updateNodeAttributes(node.id, (att) => ({
      ...att,
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
    }));

    this.emit("repositionNode", node, oldPosition, newPosition.copy());
  }

  /**
   * Retrieves all nodes in the simulation.
   * @complexity O(n)
   * @returns {Node[]} An array of all nodes in the simulation.
   */
  public getNodesArray(): Node[] {
    return this.nodes.values().toArray();
  }

  /**
   * Retrieves the tree of nodes in the simulation.
   * The tree is used to efficiently query nodes in range.
   * @returns {NodeCollection} The tree of nodes in the simulation.
   */
  public getNodesTree(): NodeCollection {
    return this.nodesCollection;
  }

  /**
   * Retrieves the number of nodes in the simulation.
   * @returns {number} The number of nodes in the simulation.
   */
  public nodeSize(): number {
    return this.nodes.size;
  }

  /**
   * Retrieves all edges in the simulation.
   * @complexity O(n)
   * @returns {Edge[]} An array of all edges in the simulation.
   */
  public getEdgesArray(): Edge[] {
    return this.edges.values().toArray();
  }

  /**
   * Retrieves the number of edges in the simulation.
   * @returns {number} The number of edges in the simulation.
   */
  public edgeSize(): number {
    return this.edges.size;
  }

  /**
   * Retrieves a node by its ID.
   * @param {number} id - The ID of the node to retrieve.
   * @returns {Node} The retrieved node or undefined if the node does not exist.
   */
  public getNode(id: number): Node | undefined {
    return this.nodes.get(id);
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
    return this.edges.has(`${source}:${target}`);
  }

  /**
   * Retrieves an edge by its source and target nodes.
   * @param {number} source - The source node of the edge.
   * @param {number} target - The target node of the edge.
   * @returns {Edge} The retrieved edge or undefined if the edge does not exist.
   */
  public getEdge(source: number, target: number): Edge | undefined {
    return this.edges.get(`${source}:${target}`);
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

    this.notifyNeighborhoodChanged([
      this.getCertainNode(edge.source),
      this.getCertainNode(edge.target),
    ]);
  }

  /**
   * Adds an edge to the graph without checking if the edge already exists.
   * @param {Edge | [number, number]} edge - The edge to add. If an array is provided, it is assumed to be an edge in the format [source, target].
   */
  public onlyAddEdge(edge: Edge | [number, number]) {
    if (Array.isArray(edge)) edge = Edge.fromPair(edge);
    const sourceNode = this.getCertainNode(edge.source);
    this.graph.addEdgeWithKey(
      `${edge.source}:${edge.target}`,
      edge.source,
      edge.target,
      {
        implementation: edge,
        width: 1,
        // type: "arrow", // TODO: turn it dinamically
      },
    );
    this.edges.set(`${edge.source}:${edge.target}`, edge);
    sourceNode.addOutgoingEdge(edge);
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

    this.notifyNeighborhoodChanged(edge.map((n) => this.getCertainNode(n)));
  }

  /**
   * Removes an edge from the graph without notifying the listeners.
   * The edge is expected to be an instance of the Edge class or an array in the format [source, target].
   * If the edge is provided as an array, it is assumed to be an edge in the format [source, target].
   * The edge is then removed from the graph and deleted from the this.edges map.
   * The edge is also removed from the graph with the implementation as the attribute.
   * @param {Edge | [number, number]} edge - The edge to remove. If an array is provided, it is assumed to be an edge in the format [source, target].
   */
  public onlyRemoveEdge(edge: Edge | [number, number]) {
    if (!Array.isArray(edge)) edge = [edge.source, edge.target];
    const sourceNode = this.getCertainNode(edge[0]);

    this.graph.dropEdge(`${edge[0]}:${edge[1]}`);
    this.edges.delete(`${edge[0]}:${edge[1]}`);
    sourceNode.removeOutgoingEdge(Edge.fromPair(edge));
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

      this.addNode(node, data.size, data.draggable, data.color);
    }

    if (this.project.simulationConfig.connectOnAddNodes) {
      this.reevaluateConnections();
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
  protected addNode(
    node: Node,
    size: number = 5,
    draggable: boolean = true,
    color?: string,
  ) {
    if (this.hasNode(node.id)) throw new Error("Node already exists");

    this.graph.addNode(node.id, {
      x: node.position.x,
      y: node.position.y,
      z: node.position.z,
      size: size,
      originalSize: size,
      implementation: node,
      label: node.id.toString(),
      draggable: draggable,
      forceLabel: false,
      color: color,
      highlighted: false,
      forceHighlight: false,
      bound: false,
    });
    this.nodes.set(node.id, node);
    this.nodesCollection.insert(node);
    this.emit("addNode", node);
  }

  public highlightNode(node: Node | NodeId) {
    node = node instanceof Node ? node.id : node;

    this.graph.setNodeAttribute(node, "highlighted", true);
  }

  public unhighlightNode(node: Node | NodeId) {
    node = node instanceof Node ? node.id : node;

    this.graph.setNodeAttribute(node, "highlighted", false);
  }

  public highlightNodeBorder(node: Node | NodeId, color: string = "#000000") {
    node = node instanceof Node ? node.id : node;

    const nodeSize = this.graph.getNodeAttribute(node, "originalSize")!;

    this.graph.setNodeAttribute(node, "highlightSize", 0.25);
    this.graph.setNodeAttribute(node, "size", nodeSize * 1.9);
    this.graph.setNodeAttribute(node, "highlightColor", "#ffffff00");
    this.graph.setNodeAttribute(node, "highlightBaseColor", color);
    this.graph.setNodeAttribute(node, "highlightBaseSize", 0.2);
  }

  public unhighlightNodeBorder(node: Node | NodeId) {
    node = node instanceof Node ? node.id : node;

    const nodeSize = this.graph.getNodeAttribute(node, "originalSize")!;

    this.graph.setNodeAttribute(node, "highlightSize", undefined);
    this.graph.setNodeAttribute(node, "size", nodeSize);
    this.graph.setNodeAttribute(node, "highlightColor", undefined);
    this.graph.setNodeAttribute(node, "highlightBaseColor", undefined);
    this.graph.setNodeAttribute(node, "highlightBaseSize", undefined);
  }

  public pinNode(node: Node | NodeId) {
    node = node instanceof Node ? node : this.getCertainNode(node);

    this.pinnedNodes.set(node.id, node);
    // @ts-ignore
    node.pinned = true;
    this.highlightNodeBorder(node, "#aaaaaa");
  }

  public unpinNode(node: Node | NodeId) {
    node = node instanceof Node ? node : this.getCertainNode(node);

    this.pinnedNodes.delete(node.id);
    // @ts-ignore
    node.pinned = false;
    this.unhighlightNodeBorder(node);
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

    return this.nodes.has(node);
  }

  /**
   * Notifies all nodes in the provided array that their neighborhood has changed.
   *
   * @param {Node[]} nodes - The array of nodes to notify.
   */
  private notifyNeighborhoodChanged(nodes: Node[]) {
    for (const node of nodes) {
      node.onNeighborhoodChange();
    }
  }

  /**
   * Retrieves all the edges that are leaving the given node.
   * @param {number} node - The ID of the node from which to retrieve the outgoing edges.
   * @returns {Map<number, edge>} A map of edges that are leaving the given node, with the key being the ID of the node to which the edge is directed and the value being the edge itself.
   * @throws {Error} If the node does not exist.
   */
  public getOutgoingEdges(node: NodeId): Map<NodeId, Edge> {
    return this.getCertainNode(node).getOutgoingEdges();
  }
}
