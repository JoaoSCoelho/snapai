import { Section } from "./Section";
import {
  capitalizeFirstLetter,
  underscoreToCamelCase,
} from "@/simulator/utils/stringUtils";
import { Subsection } from "./Subsection";
import { Line } from "./Line";
import { ModelSelectField } from "./fields/ModelSelectField";
import z from "zod";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import { Simulator } from "@/simulator/Simulator";
import { ModelParametersSubsection } from "./ModelParametersSubsection";
import { Global } from "@/simulator/Global";
import { ModelType } from "@/simulator/utils/modelsUtils";

export class ModelSection extends Section {
  public constructor(
    public readonly modelType: ModelType,
    public readonly id = ++Global.lastId,
  ) {
    const subsection = new Subsection([
      new Line([
        ModelSelectField.create({
          name: `${underscoreToCamelCase(modelType)}Model`,
          label: `${capitalizeFirstLetter(modelType).replace(/[_]/g, " ")} Model`,
          occupedColumns: 12,
          modelType: modelType,
          required: true,
          schema: z.string().refine(
            (value) => {
              return Simulator.inited
                ? SearchEngine.getPrefixedModelsNames(modelType).includes(value)
                : true;
            },
            {
              error: `Should be a pre-created ${modelType.replace(/[_]/g, " ")} model`,
            },
          ),
          info: {
            title: `The name of the ${modelType.replace(/[_]/g, " ")} model to be used`,
            helpText: (
              <>
                The name of the {modelType.replace(/[_]/g, " ")} model to be
                used. <br />
                Use the following format: "<b>projectName:modelName</b>" to use
                a model from a specific project or "<b>modelName</b>" to use a
                default model.
              </>
            ),
          },
        }),
      ]),
    ]);
    super([subsection], undefined, id);
  }

  /**
   * Returns the name of the field that contains the name of the model of type 'modelType'.
   * This field is used to select the model to be used in the simulation.
   * @returns The name of the field that contains the name of the model of type 'modelType'.
   */
  public getModelNameFieldName(): string {
    return `${underscoreToCamelCase(this.modelType)}Model`;
  }

  /**
   * Returns the prefix of the parameters subsection for a given model identifier.
   * The prefix is the name of the field that contains the name of the model of type 'modelType',
   * concatenated with "Parameters".
   * @returns The prefix of the parameters subsection for a given model identifier.
   */
  public getModelParametersPrefix(): string {
    return this.getModelNameFieldName() + "Parameters";
  }

  /**
   * Returns the parameters subsection for a given model identifier.
   * If the model identifier is not found, it will throw an error.
   * If the model identifier is found, but the model does not have a parameters subsection,
   * it will return undefined.
   * @param modelIdentifier The model identifier to get the parameters subsection for.
   * @returns The parameters subsection for the given model identifier, or undefined if the model does not have a parameters subsection.
   * @throws Error if the model identifier is not found.
   */
  public getParametersSubsection(
    modelIdentifier: string,
  ): ModelParametersSubsection | undefined {
    const modelClass = SearchEngine.findGenericModel(
      modelIdentifier,
      this.modelType,
    );

    if (!modelClass) throw new Error(`Model ${modelIdentifier} not found`);

    const parametersSubsection = modelClass.getParametersSubsection();

    return (
      parametersSubsection &&
      new ModelParametersSubsection(
        parametersSubsection.lines,
        parametersSubsection.title,
        parametersSubsection.nestedIn
          ? this.getModelParametersPrefix() +
            "." +
            parametersSubsection.nestedIn
          : this.getModelParametersPrefix(),
      )
    );
  }

  /**
   * Returns the current parameters subsection for the current model.
   * If the current model does not have a parameters subsection, it will return undefined.
   * @returns The current parameters subsection for the current model, or undefined if the current model does not have a parameters subsection.
   */
  public getCurrentParametersSubsection():
    | ModelParametersSubsection
    | undefined {
    return this.subsections[1] as ModelParametersSubsection;
  }

  /**
   * Sets the parameters subsection for a given model identifier.
   * If parametersSubsection is given, it will be set as the parameters subsection for the given model identifier.
   * If parametersSubsection is not given, it will try to find the parameters subsection for the given model identifier using getParametersSubsection.
   * If the parameters subsection is found, it will be set as the parameters subsection for the given model identifier.
   * If the parameters subsection is not found, it will delete the parameters subsection for the given model identifier if it exists.
   * @param modelIdentifier The model identifier to set the parameters subsection for.
   * @param parametersSubsection The parameters subsection to set for the given model identifier.
   * @returns True if the parameters subsection was successfully set, false otherwise.
   */
  public setParametersSubsection(
    modelIdentifier: string,
    parametersSubsection?: ModelParametersSubsection,
  ): boolean {
    if (parametersSubsection) {
      this.subsections[1] = parametersSubsection;
      return true;
    } else {
      const parametersSubsection =
        this.getParametersSubsection(modelIdentifier);

      if (!parametersSubsection) {
        delete this.subsections[1];
        return false;
      }
      this.subsections[1] = parametersSubsection;
      return true;
    }
  }
}
