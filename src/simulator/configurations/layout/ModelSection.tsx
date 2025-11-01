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
import { Api } from "@/api/Api";

export class ModelSection extends Section {
  public constructor(public readonly modelType: ModelType) {
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
                if (!Api.getInstance().cache.modelsNames.has(modelType))
                  throw new Error("Cache modelsNames not initialized");
                return Api.getInstance()
                  .cache.modelsNames.get(modelType)!
                  .has(value);
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
    super(title, subsections);
  }

  public async getParametersSubsection(
    modelIdentifier: string,
  ): Promise<ModelParametersSubsection | undefined> {
    const modelClass = await Api.findGenericModel(
      modelIdentifier,
      this.modelType,
    );

    return modelClass.getParametersSubsection();
  }
}
