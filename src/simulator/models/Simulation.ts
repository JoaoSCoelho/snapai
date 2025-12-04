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

export type SimulationOptions = {
  loggerOptions?: { useConsole: boolean };
  project: Project;

  messageTransmissionModel: MessageTransmissionModel;
};

export type NodeAttributes = {
  implementation: Node;
};

export type EdgeAttributes = {
  implementation: Edge;
};

export abstract class Simulation {
  public id: number = ++Global.lastId;
  public isRunnig: boolean = false;
  public abstract isAsyncMode: boolean;
  public startTime: Date | null = null;
  public project: Project;
  public logger: SimulationLogger;
  public abstract statistics: SimulationStatistics;
  public currentTime: number = 0;
  public messageTransmissionModel: MessageTransmissionModel;
  public lastNodeId = 0;
  public graph = new DirectedGraph<NodeAttributes, EdgeAttributes>(); // TODO: Turn it a multiDigraph
  public packetsInTheAir: PacketsInTheAirBuffer;
  private nodes = new Map<number, Node>();
  private edges = new Map<[number, number], Edge>();

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
    if (!this.checkEdgeConsistency([source, target]))
      throw new Error("Edges not consistent");

    return this.graph.hasEdge(source, target);
  }

  /**
   * Retrieves an edge by its source and target nodes.
   * @param {number} source - The source node of the edge.
   * @param {number} target - The target node of the edge.
   * @returns {Edge} The retrieved edge or undefined if the edge does not exist.
   */
  public getEdge(source: number, target: number): Edge | undefined {
    return this.edges.get([source, target]);
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

    this.edges.set([edge.source, edge.target], edge);
    this.graph.addEdge(edge.source, edge.target, {
      implementation: edge,
    });

    this.notifyNeighborhoodChanged([edge.source, edge.target]);
  }

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

  protected addNode(node: Node) {
    if (this.hasNode(node.id)) throw new Error("Node already exists");

    this.nodes.set(node.id, node);
    this.graph.addNode(node.id, {
      implementation: node,
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

    if (!this.checkNodeConsistency(node))
      throw new Error("Nodes not consistent");

    return this.nodes.has(node);
  }

  /**
   * Checks if the edges stored in this.edges and the edges stored in this.graph are consistent.
   *
   * @param {Edge | [number, number]} edge - The edge to check. If an array is provided, it is assumed to be an edge in the format [source, target].
   * @returns {boolean} True if the edges are consistent, false otherwise.
   */
  private checkEdgeConsistency(edge: Edge | [number, number]): boolean {
    if (Array.isArray(edge)) {
      if (
        (this.edges.has(edge) && !this.graph.hasEdge(...edge)) ||
        (!this.edges.has(edge) && this.graph.hasEdge(...edge))
      )
        return false;
    } else {
      if (
        (this.edges.has([edge.source, edge.target]) &&
          !this.graph.hasEdge(edge.source, edge.target)) ||
        (!this.edges.has([edge.target, edge.source]) &&
          this.graph.hasEdge(edge.source, edge.target))
      )
        return false;
    }

    return true;
  }

  /**
   * Checks if the nodes stored in this.nodes and the nodes stored in this.graph are consistent.
   *
   * @param {NodeId} node - The node to check.
   * @returns {boolean} True if the nodes are consistent, false otherwise.
   */
  private checkNodeConsistency(node: NodeId): boolean {
    return (
      (this.nodes.has(node) && this.graph.hasNode(node)) ||
      (!this.nodes.has(node) && !this.graph.hasNode(node))
    );
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
      .map((e) => this.graph.getEdgeAttributes(e).implementation);
  }
}
