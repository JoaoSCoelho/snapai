import { Position } from "../tools/Position";
import { ModelType, ModelTypeToModel } from "../utils/modelsUtils";
import { ConnectivityModel } from "./ConnectivityModel";
import { InterferenceModel } from "./InterferenceModel";
import { MobilityModel } from "./MobilityModel";
import { NodeId } from "./Node";
import { ReliabilityModel } from "./ReliabilityModel";
import { Simulation } from "./Simulation";
import { Timer } from "./Timer";
import { Edge } from "./Edge";
import { ParameterizedModule } from "../modules/ParameterizedModule";
import { ParametersSubsection } from "../configurations/layout/ParametersSubsection";
import { OrderedTimerSet } from "../modules/OrderedTimerSet";
import { Color } from "../tools/Color";

export type BaseNodeEventMap = {
  reposition: [oldPosition: Position, newPosition: Position];
};

export type Border = {
  color: Color;
  size: number;
};

export type HighlightBorder = Border & {
  baseColor: Color;
  baseSize: number;
};

export enum NodeType {
  Circle = "circle",
  Bordered = "bordered",
}

export type HighlightBorderCall = {
  border: HighlightBorder;
  nodeSizeFactor: number;
  caller: string;
};

export abstract class BaseNode extends ParameterizedModule<BaseNodeEventMap> {
  protected readonly timers: OrderedTimerSet = new OrderedTimerSet();
  protected readonly outEdges: Map<NodeId, Edge> = new Map();
  public abstract readonly name: string;
  public pinned: boolean = false;
  protected highlightCallStack: Set<string> = new Set();
  protected highlightBorderCallStack: HighlightBorderCall[] = [];
  protected highlighted: boolean;
  protected _highlightBorder: HighlightBorder | null = null;

  public constructor(
    public readonly id: NodeId,
    public mobilityModel: MobilityModel,
    public connectivityModel: ConnectivityModel,
    public interferenceModel: InterferenceModel,
    public reliabilityModel: ReliabilityModel,
    public mobilityEnabled: boolean,
    public connectivityEnabled: boolean,
    public position: Position,
    public readonly simulation: Simulation,
    public size: number,
    public readonly originalSize: number,
    public color: Color,
    public draggable: boolean,
    public forceLabel: boolean,
    public forceHighlight: boolean,
    public label: string = id.toString(),
    public border: Border | null = null,
    public type: NodeType | null = null,
  ) {
    super();
    this.highlighted = this.forceHighlight;
  }

  public arePinned(): boolean {
    return this.pinned;
  }

  public areHighlighted(): boolean {
    return this.highlighted;
  }

  public highlight(caller: string) {
    this.highlightCallStack.add(caller);
    this.highlighted = true;
  }

  /**
   * Unhighlights the node and removes the given caller from the highlight call stack.
   * If the highlight call stack is empty after removing the caller, the node is no longer highlighted.
   * @param caller The caller to remove from the highlight call stack.
   */
  public unhighlight(caller: string) {
    this.highlightCallStack.delete(caller);
    this.highlighted = this.highlightCallStack.size > 0 || this.forceHighlight;
  }

  /**
   * Sets the highlight border of the node to the given border and adds the given caller to the highlight border call stack.
   * The highlight border call stack is used to track which highlight borders were set by which callers.
   * @param border The highlight border to set.
   * @param caller The caller to add to the highlight border call stack.
   */
  public highlightBorder(
    border: HighlightBorder,
    caller: string,
    nodeSizeFactor: number = 1,
  ) {
    this.highlightBorderCallStack.push({ border, nodeSizeFactor, caller });
    this._highlightBorder = border;
    this.size = this.originalSize * nodeSizeFactor;
  }

  /**
   * Removes the given caller from the highlight border call stack and sets the highlight border of the node to the highlight border that was set by the previous caller in the call stack.
   * If the highlight border call stack is empty after removing the caller, the node's highlight border is set to null.
   * @param caller The caller to remove from the highlight border call stack.
   */
  public unhighlightBorder(caller: string) {
    this.highlightBorderCallStack = this.highlightBorderCallStack.filter(
      (call) => call.caller !== caller,
    );
    this._highlightBorder = this.highlightBorderCallStack.length
      ? this.highlightBorderCallStack[this.highlightBorderCallStack.length - 1]
          .border
      : null;
    this.size = this.highlightBorderCallStack.length
      ? this.originalSize *
        this.highlightBorderCallStack[this.highlightBorderCallStack.length - 1]
          .nodeSizeFactor
      : this.originalSize;
  }

  /**
   * Gets the highlight border of the node.
   * The highlight border is the border that was set by the most recent caller in the highlight border call stack.
   * If the highlight border call stack is empty, null is returned.
   * @returns The highlight border of the node or null if the highlight border call stack is empty.
   */
  public getHighlightBorder(): HighlightBorder | null {
    return this._highlightBorder;
  }

  /**
   * Adds an edge to the set of outgoing edges.
   * The edge to be added must have this node as its source.
   * If the edge is not found or does not have this node as its source,
   * an Error is thrown.
   * @param edge - The edge to add.
   * @throws {Error} If the edge is not found or does not have this node as its source.
   */
  public addOutgoingEdge(edge: Edge) {
    if (edge.source !== this.id) throw new Error("Invalid edge");
    this.outEdges.set(edge.target, edge);
  }

  /**
   * Removes an edge from the set of outgoing edges.
   * The edge to be removed must have this node as its source.
   * If the edge is not found or does not have this node as its source,
   * an Error is thrown.
   * @param edge - The edge to remove.
   * @throws {Error} If the edge is not found or does not have this node as its source.
   */
  public removeOutgoingEdge(edge: Edge) {
    if (edge.source !== this.id) throw new Error("Invalid edge");
    this.outEdges.delete(edge.target);
  }

  /**
   * @returns All the edges that are leaving this node.
   */
  public getOutgoingEdges(): Map<NodeId, Edge> {
    return this.outEdges;
  }

  /**
   * Returns the set of timers currently active at this node.
   * This set only holds the timers in synchronous simulation mode.
   * In asynchronous simulation mode, the timers are stored as events in
   * the global event queue.
   * @return The set of timers currently active at this node.
   */
  public getTimers(): OrderedTimerSet {
    return this.timers;
  }

  /**
   * Adds a timer to this node.
   * The timer will be fired in the global event queue if the simulation is running in asynchronous mode,
   * or it will be inserted into the global timers set if the simulation is running in synchronous mode.
   * @param timer - The timer to add.
   */
  public addTimer(timer: Timer<true>) {
    this.timers.insert(timer);
  }

  /**
   * **Child classes should implements this static method to get the parameters subsection layout.**
   *
   * Returns the ParametersSubsection of the node, if it exists.
   * This subsection contains the parameters of the node, which are
   * used to configure the node.
   * @returns The ParametersSubsection of the node, if it exists. Otherwise, undefined.
   */
  public static getParametersSubsection(): ParametersSubsection | undefined {
    return undefined;
  }

  /**
   * Changes the position of the node.
   * This will trigger a reposition event on the node.
   * @param position The new position of the node.
   */
  public reposition(position: Position) {
    const oldPosition = this.position.isInert
      ? this.position
      : this.position.copy();
    this.position = position.isInert ? position : position.copy();
    this.onReposition();
    this.emit("reposition", oldPosition, position);
  }

  /**
   * Child classes should implements this method to handle the reposition event.
   */
  public abstract onReposition(): any;

  /**
   * Checks if two nodes are equal.
   * Two nodes are equal if they have the same id.
   * @param {Node} other The node to compare with.
   * @returns {boolean} True if the nodes are equal, false otherwise.
   */
  public isEqual(other: BaseNode): boolean {
    return this.id === other.id;
  }

  /**
   * Changes the mobility model of the node.
   * This will trigger a model change event on the node.
   * @param {MobilityModel} mobilityModel The new mobility model of the node.
   */
  public setMobilityModel(mobilityModel: MobilityModel) {
    const oldModel = this.mobilityModel;
    this.mobilityModel = mobilityModel;
    this.onModelChange(ModelType.Mobility, oldModel, mobilityModel);
  }

  /**
   * Changes the connectivity model of the node.
   * This will trigger a model change event on the node.
   * @param {ConnectivityModel} connectivityModel The new connectivity model of the node.
   */
  public setConnectivityModel(connectivityModel: ConnectivityModel) {
    const oldModel = this.connectivityModel;
    this.connectivityModel = connectivityModel;
    this.onModelChange(ModelType.Connectivity, oldModel, connectivityModel);
  }

  /**
   * Changes the interference model of the node.
   * This will trigger a model change event on the node.
   * @param {InterferenceModel} interferenceModel The new interference model of the node.
   */
  public setInterferenceModel(interferenceModel: InterferenceModel) {
    const oldModel = this.interferenceModel;
    this.interferenceModel = interferenceModel;
    this.onModelChange(ModelType.Interference, oldModel, interferenceModel);
  }

  /**
   * Changes the reliability model of the node.
   * This will trigger a model change event on the node.
   * @param {ReliabilityModel} reliabilityModel The new reliability model of the node.
   */
  public setReliabilityModel(reliabilityModel: ReliabilityModel) {
    const oldModel = this.reliabilityModel;
    this.reliabilityModel = reliabilityModel;
    this.onModelChange(ModelType.Reliability, oldModel, reliabilityModel);
  }

  /**
   * Called when a model of the node changes.
   * This can happen when the user changes the model type.
   * @param {MT} modelType The type of the model that changed.
   * @param {ModelTypeToModel[MT]} oldModel The old model that was replaced.
   * @param {ModelTypeToModel[MT]} newModel The new model that replaced the old model.
   */
  public abstract onModelChange<MT extends ModelType>(
    modelType: MT,
    oldModel: ModelTypeToModel[MT],
    newModel: ModelTypeToModel[MT],
  ): any;
}
