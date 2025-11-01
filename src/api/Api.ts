import { ModelType } from "@/simulator/utils/types";
import { ApiTransaction } from "./ApiTransaction";
import { ApiCache } from "./ApiCache";
import { Model } from "@/simulator/models/Model";

export class Api {
  public static instance: Api;

  public readonly cache: ApiCache = new ApiCache();
  private constructor() {
    this.populateDefaultCache();
  }

  /**
   * Gets the singleton instance of the Api.
   * If the instance has not been initialized, it will create a new instance.
   * @returns The singleton instance of the Api.
   */
  public static getInstance(): Api {
    if (!Api.instance) Api.instance = new Api();
    return Api.instance;
  }

  /**
   * Populate the cache with the default values.
   * This method is called when the singleton instance of the Api is created.
   * It populates the cache with the results of getProjectsNames.
   */
  private async populateDefaultCache() {
    const projectsNames = await Api.getProjectsNames();
    this.cache.setProjectsNames(projectsNames);

    const modelsNames = await Api.getModelsNames();
    this.cache.setModelsNames("all", modelsNames);
  }

  /**
   * Returns exactly the content of the file
   * @param path Caminho do arquivo
   * @returns Conteúdo
   */
  static async getFile(path: string): Promise<string> {
    return await new ApiTransaction("readFile", path).exec();
  }

  /**
   * Returns a list with the names of all directories in the projects directory
   *
   * *Update cache*
   * @returns List of directories
   */
  static async getProjectsNames(): Promise<string[]> {
    const result: string[] = await new ApiTransaction(
      "getProjectsNames",
    ).exec();

    Api.getInstance().cache.setProjectsNames(result);

    return result;
  }

  /**
   * Returns a list of names of all models implemented in the simulator environment.
   * If modelType is provided, it returns a list of names of all models of that type.
   * Otherwise, it returns a list of names of all models found in the simulator environment.
   *
   * *Update cache*
   * @param modelType Type of the models to be returned. If not provided, all models are returned.
   * @returns A list of names of all models found in the simulator environment.
   */
  static async getModelsNames(modelType?: ModelType): Promise<string[]> {
    return await new ApiTransaction("getModelsNames", modelType).exec();
  }

  static async findGenericModel(
    modelIdentifier: string,
    modelType: ModelType,
  ): Promise<typeof Model> {
    return await new ApiTransaction("findGenericModel", [
      modelIdentifier,
      modelType,
    ]).exec();
  }
}
