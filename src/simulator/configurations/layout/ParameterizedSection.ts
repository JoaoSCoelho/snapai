import { Section } from "./Section";
import { Subsection } from "./Subsection";
import { Line } from "./Line";
import z from "zod";
import { Global } from "@/simulator/Global";
import { FieldPartialInfoSchema } from "./fields/Field";
import { ParameterizedSelectField } from "./fields/ParameterizedSelectField";
import { SelectFieldOption } from "./fields/SelectField";
import { ParametersSubsectionController } from "@/simulator/modules/ParametersSubsectionController";
import { ParametersSubsection } from "./ParametersSubsection";

export type ParameterizedSectionSelectOptions = {
  name: string;
  label: string;
  /** If null, all values are accepted */
  acceptedValues: string[] | null;
  info: FieldPartialInfoSchema;
  options: SelectFieldOption[] | (() => SelectFieldOption[]);
};

export class ParameterizedSection extends Section {
  public readonly select: ParameterizedSelectField;

  public constructor(
    select: ParameterizedSectionSelectOptions | ParameterizedSelectField,
    public readonly parametersSubsectionController: ParametersSubsectionController,
    public readonly disabled: boolean = false,
    public readonly id = ++Global.lastId,
  ) {
    const generatedSelect =
      select instanceof ParameterizedSelectField
        ? select
        : ParameterizedSelectField.create({
            name: select.name,
            label: select.label,
            occupedColumns: 12,
            required: true,
            schema: z.string().refine((value) => {
              return select.acceptedValues
                ? select.acceptedValues.includes(value)
                : true;
            }),
            info: select.info,
            options: select.options,
          });

    const subsection = new Subsection([new Line([generatedSelect])]);
    super([subsection], undefined, disabled, id);
    this.select = generatedSelect;
  }

  /**
   * Returns the name of the select field.
   * This field is used to select the thing.
   */
  public getSelectFieldName(): string {
    return this.select.name;
  }

  /**
   * Returns the prefix of the parameters subsection.
   * The prefix is the name of the select field
   * concatenated with "Parameters".
   */
  public getParametersPrefix(): string {
    return this.getSelectFieldName() + "Parameters";
  }

  /**
   * Returns the parameters subsection for a given identifier.
   * If the identifier is not found, it will throw an error.
   * If the identifier is found, but the thing does not have
   * a parameters subsection, it will return undefined.
   * @param identifier The identifier to get the parameters subsection for.
   * @returns The parameters subsection for the given identifier, or undefined if the thing does not have a parameters subsection.
   * @throws Error if the identifier is not found.
   */
  public getParametersSubsection(
    identifier: string,
  ): ParametersSubsection | undefined {
    const parametersSubsection =
      this.parametersSubsectionController.getParametersSubsection(identifier);

    return (
      parametersSubsection &&
      parametersSubsection.createPartialCopy({
        id: parametersSubsection.id,
        nestedIn: parametersSubsection.nestedIn
          ? this.getParametersPrefix() + "." + parametersSubsection.nestedIn
          : this.getParametersPrefix(),
      })
    );
  }

  /**
   * @returns The current parameters subsection for the current section,
   * or undefined if the current section does not have a parameters subsection.
   */
  public getCurrentParametersSubsection(): ParametersSubsection | undefined {
    return this.subsections[1] as ParametersSubsection;
  }

  /**
   * Sets the parameters subsection for a given identifier.
   * If parametersSubsection is given, it will be set as the parameters subsection for the given identifier.
   * If parametersSubsection is not given, it will try to find the parameters subsection for the given identifier using getParametersSubsection.
   * If the parameters subsection is found, it will be set as the parameters subsection for the given identifier.
   * If the parameters subsection is not found, it will delete the parameters subsection for the given identifier if it exists.
   * @param identifier The identifier to set the parameters subsection for.
   * @param parametersSubsection The parameters subsection to set for the given identifier.
   * @returns True if the parameters subsection was successfully set, false otherwise.
   */
  public setParametersSubsection(
    identifier: string,
    parametersSubsection?: ParametersSubsection,
  ): boolean {
    if (parametersSubsection) {
      this.subsections[1] = parametersSubsection;
      return true;
    } else {
      const parametersSubsection = this.getParametersSubsection(identifier);

      if (!parametersSubsection) {
        delete this.subsections[1];
        return false;
      }
      this.subsections[1] = parametersSubsection;
      return true;
    }
  }
}
