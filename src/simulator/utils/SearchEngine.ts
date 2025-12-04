import { simulator } from "../Simulator";
import { ConcreteModel, Model } from "../models/Model";
import { ConcreteNode, Node } from "../models/Node";
import { ConcretePacket, Packet } from "../models/Packet";
import { Project } from "../models/Project";
import { ModelType, ModelTypeToModel } from "./modelsUtils";

export class SearchEngine {
  /**
   * Returns a list of prefixed models names.
   * If modelType is provided, it will return a list of names of all models of that type,
   * prefixed with the project name.
   * Otherwise, it will return a list of names of all models found in the simulator environment,
   * prefixed with the project name.
   *
   * @param modelType The type of models to be returned. If not provided, all models are returned.
   * @returns A list of names of all models found in the simulator environment, prefixed with the project name. I.e. `projectName:modelName`.
   */
  public static getPrefixedModelsNames(modelType?: ModelType): string[] {
    if (modelType)
      return simulator.projects
        .values()
        .flatMap((p) =>
          p.models
            .entries()
            .filter(([, m]) => m.type === modelType)
            .map(([k]) => `${p.name}:${k}`),
        )
        .toArray();
    else
      return simulator.projects
        .values()
        .flatMap((p) => p.models.keys().map((k) => `${p.name}:${k}`))
        .toArray();
  }

  /**
   * Returns a list of names of all nodes found in the simulator environment, prefixed with the project name. I.e. `projectName:nodeName`.
   * @returns A list of names of all nodes found in the simulator environment, prefixed with the project name.
   */
  public static getPrefixedNodesNames(): string[] {
    return simulator.projects
      .values()
      .flatMap((p) => p.nodes.keys().map((k) => `${p.name}:${k}`))
      .toArray();
  }

  /**
   * Returns a list of names of all packets found in the simulator environment, prefixed with the project name. I.E. `projectName:packetName`.
   * @returns A list of names of all packets found in the simulator environment, prefixed with the project name.
   */
  public static getPrefixedPacketsNames(): string[] {
    return simulator.projects
      .values()
      .flatMap((p) => p.packets.keys().map((k) => `${p.name}:${k}`))
      .toArray();
  }

  /**
   * Returns a map of all packets found in the simulator environment, prefixed with the project name.
   * The map contains the name of the packet as key and the packet object as value.
   * The name of the packet is prefixed with the project name, for example "projectName:packetName".
   * @returns A map of all packets found in the simulator environment, prefixed with the project name.
   */
  public static getPrefixedMapOfPackets() {
    return new Map(
      simulator.projects
        .values()
        .flatMap((p) =>
          p.packets.entries().map(([k, v]) => [`${p.name}:${k}`, v]),
        )
        .toArray() as [`${string}:${string}`, typeof Packet][],
    );
  }

  /**
   * Returns a map of models found in the simulator environment, prefixed with the project name.
   * If modelType is provided, it will return a map of names of all models of that type,
   * prefixed with the project name.
   * Otherwise, it will return a map of names of all models found in the simulator environment,
   * prefixed with the project name. I.e. `projectName:modelName`.
   *
   * @param modelType The type of models to be returned. If not provided, all models are returned.
   * @returns A map of names of all models found in the simulator environment, prefixed with the project name.
   */
  public static getPrefixedMapOfModels(modelType?: ModelType) {
    if (modelType) {
      return new Map(
        simulator.projects
          .values()
          .flatMap((p) =>
            p.models
              .entries()
              .filter(([, m]) => m.type === modelType)
              .map(([k, v]) => [`${p.name}:${k}`, v]),
          )
          .toArray() as [`${string}:${string}`, typeof Model][],
      );
    } else {
      return new Map(
        simulator.projects
          .values()
          .flatMap((p) =>
            p.models.entries().map(([k, v]) => [`${p.name}:${k}`, v]),
          )
          .toArray() as [`${string}:${string}`, typeof Model][],
      );
    }
  }

  /**
   * Returns a map of nodes found in the simulator environment, prefixed with the project name.
   * The map contains the name of the node as key and the node object as value.
   * The name of the node is prefixed with the project name, for example "projectName:nodeName".
   * @returns A map of nodes found in the simulator environment, prefixed with the project name.
   */
  public static getPrefixedMapOfNodes() {
    return new Map(
      simulator.projects
        .values()
        .flatMap((p) =>
          p.nodes.entries().map(([k, v]) => [`${p.name}:${k}`, v]),
        )
        .toArray() as [`${string}:${string}`, typeof Node][],
    );
  }

  /**
   * Returns the project with the given name.
   * @throws {Error} If the project was not found.
   * @param {string} name The name of the project to be returned.
   * @returns {Project} The project with the given name.
   */
  public static getProjectByName(name: string): Project {
    const project = simulator.projects.get(name);
    if (!project) throw new Error('Project "' + name + '" not found.');
    return project;
  }

  /**
   * Finds a project by its name.
   * @param {string} name The name of the project to be searched.
   * @returns {Project | undefined} The project with the given name, or undefined if it was not found.
   */
  public static findProjectByName(name: string): Project | undefined {
    return simulator.projects.get(name);
  }

  /**
   * @returns
   * The generic model class to be instantiated, or undefined if the model was not found.
   */
  public static findGenericModel<MT extends ModelType>(
    modelIdentifier: string,
    modelType: MT,
  ): ConcreteModel<ModelTypeToModel[MT]> | undefined {
    return this.getPrefixedMapOfModels(modelType).get(
      modelIdentifier as `${string}:${string}`,
    ) as ConcreteModel<ModelTypeToModel[MT]> | undefined;
  }

  /**
   * Finds a generic model implementation by its identifier.
   *
   * @param {string} modelIdentifier The identifier of the model to be searched.
   * @param {ModelType} modelType The type of the model to be searched.
   * @throws {Error} If the generic model implementation was not found.
   * @returns The generic model class to be instantiated.
   */
  public static getGenericModel<MT extends ModelType>(
    modelIdentifier: string,
    modelType: MT,
  ): ConcreteModel<ModelTypeToModel[MT]> {
    const foundModel = this.findGenericModel(modelIdentifier, modelType);
    if (!foundModel)
      throw new Error("Model '" + modelIdentifier + "' not found.");
    return foundModel as unknown as ConcreteModel<ModelTypeToModel[MT]>;
  }

  /**
   * Finds a node implementation by its identifier
   * @returns
   * The Node class to be instantiated, or undefined if the node was not found.
   * @param nodeIdentifier The name of the node to be searched, in the format of project_name:node_name.
   */
  public static findNodeByIdentifier(
    nodeIdentifier: string,
  ): ConcreteNode | undefined {
    return this.getPrefixedMapOfNodes().get(
      nodeIdentifier as `${string}:${string}`,
    ) as unknown as ConcreteNode;
  }

  /**
   * Finds a node implementation by its identifier.
   *
   * @param {`${string}:${string}`} nodeIdentifier The name of the node to be searched, in the format of project_name:node_name.
   * @returns The Node class to be instantiated.
   * @throws {Error} If the node implementation was not found.
   */
  public static getNodeByIdentifier(nodeIdentifier: string): ConcreteNode {
    const foundNode = this.findNodeByIdentifier(
      nodeIdentifier as `${string}:${string}`,
    );
    if (!foundNode) throw new Error("Node '" + nodeIdentifier + "' not found.");
    return foundNode as unknown as ConcreteNode;
  }

  /**
   * Finds a packet implementation by its identifier.
   *
   * @param {`${string}:${string}`} packetIdentifier The name of the packet to be searched, in the format of project_name:packet_name.
   * @returns The packet class to be instantiated, or undefined if the packet was not found.
   */
  public static findPacketByIdentifier(
    packetIdentifier: string,
  ): ConcretePacket | undefined {
    return this.getPrefixedMapOfPackets().get(
      packetIdentifier as `${string}:${string}`,
    ) as unknown as ConcretePacket;
  }

  /**
   * Finds a packet implementation by its identifier.
   *
   * @param {`${string}:${string}`} packetIdentifier The name of the packet to be searched, in the format of project_name:packet_name.
   * @returns The packet class to be instantiated.
   * @throws {Error} If the packet implementation was not found.
   */
  public static getPacketByIdentifier(
    packetIdentifier: string,
  ): ConcretePacket {
    const foundPacket = this.findPacketByIdentifier(
      packetIdentifier as `${string}:${string}`,
    );
    if (!foundPacket)
      throw new Error("Packet '" + packetIdentifier + "' not found.");
    return foundPacket as unknown as ConcretePacket;
  }
}
