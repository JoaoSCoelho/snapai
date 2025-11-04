import { Node } from "@/simulator/models/Node";
import { SimulatorConfig } from "@/simulator/configurations/Simulator/SimulatorConfig";
import { ModelType } from "@/simulator/utils/types";
import fs from "node:fs";
import { NodeNotFoundError } from "./errors/NodeNotFoundError";
import { ModelNotFoundError } from "./errors/ModelNotFoundError";
import { DistributionModel } from "@/simulator/models/DistributionModel";
import { ReliabilityModel } from "@/simulator/models/ReliabilityModel";
import { capitalizeFirstLetter } from "@/simulator/utils/stringUtils";
import { MobilityModel } from "@/simulator/models/MobilityModel";
import { InterferenceModel } from "@/simulator/models/InterferenceModel";
import { Model } from "@/simulator/models/Model";
import { ConnectivityModel } from "@/simulator/models/ConnectivityModel";
import { MessageTransmissionModel } from "@/simulator/models/MessageTransmissionModel";

/**
 * @deprecated
 */
export class ModulesSearchEngine {
  constructor(
    private readonly config: SimulatorConfig = SimulatorConfig.getInstance(),
  ) {}

  /**
   * @param modelType
   * @returns A list of names of all models implemented in defaults folder
   */
  public getDefaultModelsNames(modelType?: ModelType): string[] {
    if (modelType) {
      const defaultModels = fs
        .readdirSync(`${this.config.getDefaultsPath()}/${modelType}_models`)
        .map((fileName) => fileName.split(".")[0]);

      return defaultModels;
    } else {
      const defaultsModelsDirectories = fs
        .readdirSync(`${this.config.getDefaultsPath()}`, {
          withFileTypes: true,
        })
        .filter((d) => d.isDirectory())
        .filter((d) => d.name.endsWith("_models"))
        .map((d) => d.name);
      const defaultModels: string[] = [];
      for (const defaultsModelDirectory of defaultsModelsDirectories) {
        defaultModels.push(
          ...fs
            .readdirSync(
              `${this.config.getDefaultsPath()}/${defaultsModelDirectory}`,
            )
            .map((fileName) => fileName.split(".")[0]),
        );
      }

      return defaultModels;
    }
  }

  /**
   * @param modelType
   * @returns A list of names of all models found in simulator environment
   */
  public getModelsNames(modelType?: ModelType): string[] {
    // Get defaults models
    const defaultModels = this.getDefaultModelsNames(modelType);

    // Get projects models
    const projectsNames = fs
      .readdirSync(this.config.getProjectsPath(), { withFileTypes: true })
      .filter((pn) => pn.isDirectory())
      .map((fn) => fn.name);

    for (const projectName of projectsNames) {
      defaultModels.push(...this.getProjectModelsNames(projectName, modelType));
    }

    return defaultModels;
  }

  /**
   * @param projectName
   * @param modelType
   * @returns A list of names of all models implemented in a specific project
   */
  public getProjectModelsNames(
    projectName: string,
    modelType?: ModelType,
  ): string[] {
    const projectDirectories = fs
      .readdirSync(`${this.config.getProjectsPath()}/${projectName}`, {
        withFileTypes: true,
      })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    if (modelType) {
      if (projectDirectories.includes(`${modelType}_models`)) {
        const projectModels = fs
          .readdirSync(
            `${this.config.getProjectsPath()}/${projectName}/${modelType}_models`,
          )
          .map((fileName) => fileName.split(".")[0]);
        return projectModels;
      }
    } else {
      const modelsDirectories = projectDirectories.filter((d) =>
        d.endsWith("_models"),
      );

      const projectModels: string[] = [];

      for (const modelDirectory of modelsDirectories) {
        projectModels.push(
          ...fs
            .readdirSync(
              `${this.config.getProjectsPath()}/${projectName}/${modelDirectory}`,
            )
            .map((fileName) => fileName.split(".")[0]),
        );
      }

      return projectModels;
    }

    return [];
  }

  /**
   *
   * @returns A list of names of all nodes implemented in defaults folder
   */
  public getDefaultNodesNames(): string[] {
    const defaultNodes = fs
      .readdirSync(`${this.config.getDefaultsPath()}/nodes`)
      .map((fileName) => fileName.split(".")[0]);

    return defaultNodes;
  }

  /**
   * Gets all names of node implementations found in environment
   */
  public getNodesNames(): string[] {
    // Get defaults nodes
    const defaultNodes = this.getDefaultNodesNames();

    // Get by projects
    const projectsDirectories = fs
      .readdirSync(`${this.config.getProjectsPath()}`, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const projectDirectory of projectsDirectories) {
      defaultNodes.push(...this.getProjectNodesNames(projectDirectory));
    }

    return defaultNodes;
  }

  /**
   *
   * @param project
   * @returns A list with all names of node implementations in a specific project
   */
  public getProjectNodesNames(project: string): string[] {
    const projectDirectories = fs.readdirSync(
      `${this.config.getProjectsPath()}/${project}`,
    );

    if (projectDirectories.includes("nodes")) {
      const projectNodes = fs
        .readdirSync(`${this.config.getProjectsPath()}/${project}/nodes`, {
          withFileTypes: true,
        })
        .filter((f) => f.isFile())
        .map((f) => f.name.split(".")[0]);

      return projectNodes;
    }

    return [];
  }

  /**
   * Finds a node implementation by its identifier, if is only a name, it will search on defaults/nodes.
   * In case of identifier have an ":", it will consider it as {project}:{node} and search on projects/{project}/nodes.
   * @throws
   * NodeNotFoundError if the node implementation was not found.
   * @returns
   * The Node class to be instantiated.
   */
  public async findNodeImplementation(
    nodeIdentifier: string,
  ): Promise<typeof Node> {
    if (nodeIdentifier.includes(":")) {
      // Is a project node
      const [projectName, nodeName] = nodeIdentifier.split(":");

      const projectsDirectoryContent = fs.readdirSync(
        `${this.config.getProjectsPath()}`,
      );

      if (!projectsDirectoryContent.includes(projectName))
        throw new NodeNotFoundError(
          `Node ${nodeName} not found because the project ${projectName} was not found in projects folder.`,
        );

      const projectDirectoryContent = fs.readdirSync(
        `${this.config.getProjectsPath()}/${projectName}`,
      );

      if (!projectDirectoryContent.includes("nodes"))
        throw new NodeNotFoundError(
          `Node ${nodeName} not found in project ${projectName} because the project folder don't have a "nodes" folder.`,
        );

      const nodesDirectoryContent = fs.readdirSync(
        `${this.config.getProjectsPath()}/${projectName}/nodes`,
      );

      if (!nodesDirectoryContent.includes(`${nodeName}.ts`))
        throw new NodeNotFoundError(
          `Node ${nodeName} not found in project ${projectName} because a file ${nodeName}.ts was not found in "${projectName}/nodes" folder`,
        );

      const imported = await import(
        `${this.config.getProjectsPath()}/${projectName}/nodes/${nodeName}.ts`
      );
      return imported.default;
    } else {
      // Is a default node
      const nodesDirectoryContent = fs.readdirSync(
        `${this.config.getDefaultsPath()}/nodes`,
      );

      if (!nodesDirectoryContent.includes(`${nodeIdentifier}.ts`))
        throw new NodeNotFoundError(
          `Node ${nodeIdentifier} not found because a file "${nodeIdentifier}.ts" was not found in "defaults/nodes" folder`,
        );

      const imported = await import(
        `${this.config.getDefaultsPath()}/nodes/${nodeIdentifier}.ts`
      );

      return imported.default;
    }
  }

  // /**
  //  * Finds a distribution model implementation by its identifier, if is only a name, it will search on defaults/distribution_models.
  //  * In case of identifier have an ":", it will consider it as {project}:{distribution_model} and search on projects/{project}/distribution_models.
  //  * @throws
  //  * ModelNotFoundError if the distribution model implementation was not found.
  //  * @returns
  //  * The DistributionModel class to be instantiated.
  //  */
  // public async findDistributionModel(
  //   distributionModelIdentifier: string,
  // ): Promise<typeof DistributionModel> {
  //   return await this.findGenericModel(
  //     distributionModelIdentifier,
  //     "distribution",
  //   );
  // }

  // /**
  //  * Finds a reliability model implementation by its identifier, if is only a name, it will search on defaults/reliability_models.
  //  * In case of identifier have an ":", it will consider it as {project}:{reliability_model} and search on projects/{project}/reliability_models.
  //  * @throws
  //  * ModelNotFoundError if the reliability model implementation was not found.
  //  * @returns
  //  * The ReliabilityModel class to be instantiated.
  //  */
  // public async findReliabilityModel(
  //   reliabilityModelIdentifier: string,
  // ): Promise<typeof ReliabilityModel> {
  //   return await this.findGenericModel(
  //     reliabilityModelIdentifier,
  //     "reliability",
  //   );
  // }

  // /**
  //  * Finds a mobility model implementation by its identifier, if is only a name, it will search on defaults/mobility_models.
  //  * In case of identifier have an ":", it will consider it as {project}:{mobility_model} and search on projects/{project}/mobility_models.
  //  * @throws
  //  * ModelNotFoundError if the mobility model implementation was not found.
  //  * @returns
  //  * The MobilityModel class to be instantiated.
  //  */
  // public async findMobilityModel(
  //   mobilityModelIdentifier: string,
  // ): Promise<typeof MobilityModel> {
  //   return await this.findGenericModel(mobilityModelIdentifier, "mobility");
  // }

  // /**
  //  * Finds an interference model implementation by its identifier, if is only a name, it will search on defaults/interference_models.
  //  * In case of identifier have an ":", it will consider it as {project}:{interference_model} and search on projects/{project}/interference_models.
  //  * @throws
  //  * ModelNotFoundError if the interference model implementation was not found.
  //  * @returns
  //  * The InterferenceModel class to be instantiated.
  //  */
  // public async findInterferenceModel(
  //   interferenceModelIdentifier: string,
  // ): Promise<typeof InterferenceModel> {
  //   return await this.findGenericModel(
  //     interferenceModelIdentifier,
  //     "interference",
  //   );
  // }

  // /**
  //  * Finds a connectivity model implementation by its identifier, if is only a name, it will search on defaults/connectivity_models.
  //  * In case of identifier have an ":", it will consider it as {project}:{connectivity_model} and search on projects/{project}/connectivity_models.
  //  * @throws
  //  * ModelNotFoundError if the connectivity model implementation was not found.
  //  * @returns
  //  * The ConnectivityModel class to be instantiated.
  //  */
  // public async findConnectivityModel(
  //   connectivityModelIdentifier: string,
  // ): Promise<typeof ConnectivityModel> {
  //   return await this.findGenericModel(
  //     connectivityModelIdentifier,
  //     "connectivity",
  //   );
  // }

  // /**
  //  * Finds a message transmission model implementation by its identifier, if is only a name, it will search on defaults/message_transmission_models.
  //  * In case of identifier have an ":", it will consider it as {project}:{message_transmission_model} and search on projects/{project}/message_transmission_models.
  //  * @throws
  //  * ModelNotFoundError if the message transmission model implementation was not found.
  //  * @returns
  //  * The MessageTransmissionModel class to be instantiated.
  //  */
  // public async findMessageTransmissionModel(
  //   messageTransmissionModelIdentifier: string,
  // ): Promise<typeof MessageTransmissionModel> {
  //   return await this.findGenericModel(
  //     messageTransmissionModelIdentifier,
  //     "message_transmission",
  //   );
  // }

  /**
   * Finds a generic model implementation by its identifier, if is only a name, it will search on defaults/{modelType}_models.
   * In case of identifier have an ":", it will consider it as {project}:{model} and search on projects/{project}/{modelType}_models.
   * @throws
   * ModelNotFoundError if the generic model implementation was not found.
   * @returns
   * The generic model class to be instantiated.
   */
  /* eslint-disable-next-line max-len */
  public async findGenericModel(
    modelIdentifier: string,
    modelType: ModelType,
  ): Promise<typeof Model> {
    const capitalizedModelType = capitalizeFirstLetter(modelType).replace(
      /[_]/g,
      " ",
    );

    if (modelIdentifier.includes(":")) {
      // Is a project model

      const [projectName, modelName] = modelIdentifier.split(":");

      const projectsDirectoryContent = fs.readdirSync(
        `${this.config.getProjectsPath()}`,
      );

      if (!projectsDirectoryContent.includes(projectName))
        throw new ModelNotFoundError(
          `${capitalizedModelType} model ${modelName} not found because the project ${projectName} was not found in projects folder.`,
        );

      const projectDirectoryContent = fs.readdirSync(
        `${this.config.getProjectsPath()}/${projectName}`,
      );

      if (!projectDirectoryContent.includes(`${modelType}_models`))
        throw new ModelNotFoundError(
          `${capitalizedModelType} model ${modelName} not found because was not found a folder called "${modelType}_models" inside the project folder`,
        );

      const modelsDirectoryContent = fs.readdirSync(
        `${this.config.getProjectsPath()}/${projectName}/${modelType}_models`,
      );

      if (!modelsDirectoryContent.includes(`${modelName}.ts`))
        throw new ModelNotFoundError(
          `${capitalizedModelType} model ${modelName} not found because was not found a file called "${modelName}.ts" in "projects/${projectName}/${modelType}_models" folder`,
        );

      const imported = await import(
        `${this.config.getProjectsPath()}/${projectName}/${modelType}_models/${modelName}.ts`
      );

      return imported.default;
    } else {
      // the model is a default model
      const modelsDirectoryContent = fs.readdirSync(
        `${this.config.getDefaultsPath()}/${modelType}_models`,
      );

      if (!modelsDirectoryContent.includes(`${modelIdentifier}.ts`))
        throw new ModelNotFoundError(
          `${capitalizedModelType} model ${modelIdentifier} not found because a file called "${modelIdentifier}.ts" was not found in defaults/${modelType}_models folder`,
        );

      const imported = await import(
        `${this.config.getDefaultsPath()}/${modelType}_models/${modelIdentifier}.ts`
      );
      return imported.default;
    }
  }

  /**
   * Returns a list with all names of directories in the projects directory.
   * The projects directory is specified in the simulator configuration.
   * @returns A list of project names.
   */
  public getProjectsNames(): string[] {
    return fs
      .readdirSync(this.config.getProjectsPath(), { withFileTypes: true })
      .filter((pn) => pn.isDirectory())
      .map((pn) => pn.name);
  }
}
