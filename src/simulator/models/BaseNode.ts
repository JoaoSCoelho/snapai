import { NodeParametersSubsection } from "../configurations/layout/NodeParametersSubsection";
import { Position } from "../tools/Position";
import { ModelType, ModelTypeToModel } from "../utils/modelsUtils";
import { ConnectivityModel } from "./ConnectivityModel";
import { InterferenceModel } from "./InterferenceModel";
import { MobilityModel } from "./MobilityModel";
import { Module } from "./Module";
import { NodeId } from "./Node";
import { ReliabilityModel } from "./ReliabilityModel";
import { Simulation } from "./Simulation";

export abstract class BaseNode extends Module {
  public constructor(
    public readonly id: NodeId,
    public mobilityModel: MobilityModel,
    public connectivityModel: ConnectivityModel,
    public interferenceModel: InterferenceModel,
    public reliabilityModel: ReliabilityModel,
    public position: Position,
    public readonly simulation: Simulation,
  ) {
    super();
  }

  /**
   * **Child classes should implements this static method to get the parameters subsection layout.**
   *
   * Returns the NodeParametersSubsection of the node, if it exists.
   * This subsection contains the parameters of the node, which are
   * used to configure the node.
   * @returns The NodeParametersSubsection of the node, if it exists. Otherwise, undefined.
   */
  public static getParametersSubsection():
    | NodeParametersSubsection
    | undefined {
    return undefined;
  }

  /**
   * Changes the position of the node.
   * This will trigger a reposition event on the node.
   * @param position The new position of the node.
   */
  public reposition(position: Position) {
    this.position = position;
    this.onReposition();
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
