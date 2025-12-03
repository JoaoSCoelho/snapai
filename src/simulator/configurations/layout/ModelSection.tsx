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
import { Global } from "@/simulator/Global";
import { ModelType } from "@/simulator/utils/modelsUtils";
import { ParameterizedSection } from "./ParameterizedSection";
import { ClassableParametersSubsectionController } from "@/simulator/modules/ClassableParametersSubsectionController";
import { ParameterizedModule } from "@/simulator/modules/ParameterizedModule";
import { FieldPartialInfoSchema } from "./fields/Field";

export type ModelSectionSelectOptions = {
  name?: string;
  label?: string;
  info?: FieldPartialInfoSchema;
};

export class ModelSection extends ParameterizedSection {
  public constructor(
    public readonly modelType: ModelType,
    public readonly disabled: boolean = false,
    selectOptions: ModelSectionSelectOptions = {},
    public readonly id = ++Global.lastId,
  ) {
    const select = ModelSelectField.create(
      {
        name: selectOptions.name ?? `${underscoreToCamelCase(modelType)}Model`,
        label:
          selectOptions.label ??
          `${capitalizeFirstLetter(modelType).replace(/[_]/g, " ")} Model`,
        occupedColumns: 12,
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
        info: selectOptions.info ?? {
          title: `The name of the ${modelType.replace(/[_]/g, " ")} model to be used`,
          helpText: (
            <>
              The name of the {modelType.replace(/[_]/g, " ")} model to be used.{" "}
              <br />
              Use the following format: "<b>projectName:modelName</b>" to use a
              model from a specific project or "<b>default:modelName</b>" to use
              a default model.
            </>
          ),
        },
      },
      { modelType },
    );

    super(
      select,
      new ClassableParametersSubsectionController(
        () =>
          SearchEngine.getPrefixedMapOfModels(modelType) as unknown as Map<
            string,
            typeof ParameterizedModule
          >,
      ),
      disabled,
      id,
    );
  }
}
