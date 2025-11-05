import { ModelType } from "@/simulator/utils/types";
import { Section } from "./Section";
import {
  capitalizeFirstLetter,
  underscoreToCamelCase,
} from "@/simulator/utils/stringUtils";
import { Subsection } from "./Subsection";
import { Line } from "./Line";
import { ModelSelectField } from "./fields/ModelSelectField";
import z from "zod";
import { ModelParametersSubsection } from "./ModelParametersSubsection";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import { Simulator } from "@/simulator";

export class ModelSection extends Section {
  public constructor(
    public readonly modelType: ModelType,
    nestedIn?: string[],
  ) {
    const title = `${capitalizeFirstLetter(modelType).replace(/[_]/g, " ")} model Parameters`;
    const subsections = [
      new Subsection([
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
                  ? SearchEngine.getPrefixedModelsNames(modelType).includes(
                      value,
                    )
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
                  Use the following format: "<b>projectName:modelName</b>" to
                  use a model from a specific project or "<b>modelName</b>" to
                  use a default model.
                </>
              ),
            },
          }),
        ]),
      ]),
    ];
    super(title, nestedIn, subsections);
  }

  /**
   * Returns the full name of the model name field, which is the name of the field
   * that contains the name of the model to be used, prefixed with the name of
   * the section and subsections that contain it.
   * @returns The full name of the model name field, prefixed with the name of the
   * section and subsections that contain it.
   */
  public getModelNameFieldFullName(): string {
    return [...this.nestedIn, this.subsections[0].lines[0].fields[0].name].join(
      ".",
    );
  }

  /**
   * Returns the full name of the ModelParametersSubsection, which is the name of the subsection
   * that contains the parameters of the model, prefixed with the name of the section and subsections
   * that contain it.
   * @returns The full name of the ModelParametersSubsection, prefixed with the name of the
   * section and subsections that contain it.
   */
  public getParametersSubsectionFullName(): string {
    return [
      ...this.nestedIn,
      this.subsections[0].lines[0].fields[0].name + "Parameters",
    ].join(".");
  }

  /**
   * Returns the name of the subsection that contains the ModelParametersSubsection of the model.
   * The ModelParametersSubsection is nested in a subsection with this name.
   * @returns The name of the subsection that contains the ModelParametersSubsection of the model.
   */
  public getParametersSubsectionNestedIn(): string {
    return `${underscoreToCamelCase(this.modelType)}ModelParameters`;
  }

  /**
   * Returns the ModelParametersSubsection of the model identified by modelIdentifier.
   * If the model is not found, an error is thrown.
   * If the model does not have a ModelParametersSubsection, undefined is returned.
   * The ModelParametersSubsection is nested in a subsection with the name
   * "${underscoreToCamelCase(this.modelType)}ModelParameters".
   * @param modelIdentifier The identifier of the model to be searched.
   * @returns The ModelParametersSubsection of the model, if it exists. Otherwise, undefined.
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

    parametersSubsection && // @ts-ignore
      (parametersSubsection.nestedIn = [
        this.getParametersSubsectionNestedIn(),
      ]);

    return parametersSubsection;
  }

  /**
   * Sets the ModelParametersSubsection of the model identified by modelIdentifier.
   * If parametersSubsection is undefined, it will delete the ModelParametersSubsection of the model.
   * If the model does not have a ModelParametersSubsection, it will return false.
   * @param modelIdentifier The identifier of the model to be searched.
   * @param parametersSubsection The ModelParametersSubsection to be set.
   * @returns True if the ModelParametersSubsection was set, false if it was deleted.
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
