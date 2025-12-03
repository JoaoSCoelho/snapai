import { HTMLAttributes } from "react";
import { Control, UseFormRegister } from "react-hook-form";
import TextField from "./TextField";
import NumberField from "./NumberField";
import CheckboxField from "./CheckboxField";
import NumberPairField from "./NumberPairField";
import ModelSelectField from "./ModelSelectField";
import PercentageField from "./PercentageField";
import SelectField from "./SelectField";
import MultiSelectField from "./MultiSelectField";
import NodeSelectField from "./NodeSelectField";
import ColorField from "./ColorField";
import { Field } from "@/simulator/configurations/layout/fields/Field";
import { TextField as TextFieldCls } from "@/simulator/configurations/layout/fields/TextField";
import { NumberField as NumberFieldCls } from "@/simulator/configurations/layout/fields/NumberField";
import { NumberPairField as NumberPairFieldCls } from "@/simulator/configurations/layout/fields/NumberPairField";
import { CheckboxField as CheckboxFieldCls } from "@/simulator/configurations/layout/fields/CheckboxField";
import { ColorField as ColorFieldCls } from "@/simulator/configurations/layout/fields/ColorField";
import { AngleField as AngleFieldCls } from "@/simulator/configurations/layout/fields/AngleField";
import { AnglePairField as AnglePairFieldCls } from "@/simulator/configurations/layout/fields/AnglePairField";
import { ModelSelectField as ModelSelectFieldCls } from "@/simulator/configurations/layout/fields/ModelSelectField";
import { MultiSelectField as MultiSelectFieldCls } from "@/simulator/configurations/layout/fields/MultiSelectField";
import { PercentageField as PercentageFieldCls } from "@/simulator/configurations/layout/fields/PercentageField";
import { SelectField as SelectFieldCls } from "@/simulator/configurations/layout/fields/SelectField";
import { NodeSelectField as NodeSelectFieldCls } from "@/simulator/configurations/layout/fields/NodeSelectField";
import AngleField from "./AngleField";
import AnglePairField from "./AnglePairField";
import { Section } from "@/simulator/configurations/layout/Section";

export type FormFieldProps = {
  field: Field;
  containerAttr?: HTMLAttributes<HTMLDivElement>;
  register: UseFormRegister<any>;
  control: Control<any>;
  disabled?: boolean;
  section: Section;
  nestedIn?: string;
  onModelNameChange?: (name: string, fullName: string, value: string) => void;
  onNodeNameChange?: (name: string, fullName: string, value: string) => void;
};

export default function FormField({
  field,
  disabled,
  onModelNameChange,
  ...fieldAttrs
}: FormFieldProps) {
  /**
   * The order in this switch statement is important.
   * The first matching case will be used.
   * So... classes that extends other classes should be listed first.
   */

  if (field instanceof ColorFieldCls) {
    return (
      <ColorField
        field={field as ColorFieldCls}
        inputAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof TextFieldCls) {
    return (
      <TextField
        field={field as TextFieldCls}
        inputAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof AngleFieldCls) {
    return (
      <AngleField
        field={field as AngleFieldCls}
        inputAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof PercentageFieldCls) {
    return (
      <PercentageField
        field={field as PercentageFieldCls}
        inputAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof NumberFieldCls) {
    return (
      <NumberField
        field={field as NumberFieldCls}
        inputAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof CheckboxFieldCls) {
    return (
      <CheckboxField
        field={field as CheckboxFieldCls}
        checkboxAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof AnglePairFieldCls) {
    return (
      <AnglePairField
        field={field as AnglePairFieldCls}
        inputAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof NumberPairFieldCls) {
    return (
      <NumberPairField
        field={field as NumberPairFieldCls}
        inputAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof ModelSelectFieldCls) {
    return (
      <ModelSelectField
        field={field as ModelSelectFieldCls}
        selectAttr={{ disabled: disabled || field.disabled }}
        onModelNameChange={onModelNameChange}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof MultiSelectFieldCls) {
    return (
      <MultiSelectField
        field={field as MultiSelectFieldCls}
        selectAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof NodeSelectFieldCls) {
    return (
      <NodeSelectField
        field={field as NodeSelectFieldCls}
        selectAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  } else if (field instanceof SelectFieldCls) {
    return (
      <SelectField
        field={field as SelectFieldCls}
        selectAttr={{ disabled: disabled || field.disabled }}
        {...fieldAttrs}
      />
    );
  }
}
