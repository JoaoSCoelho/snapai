import { Layout } from "@/simulator/configurations/layout/Layout";
import { ModelSection } from "@/simulator/configurations/layout/ModelSection";
import { NodeSection } from "@/simulator/configurations/layout/NodeSection";
import { BaseSyntheticEvent, useEffect, useMemo, useState } from "react";
import { useErrorModal } from "../contexts/ErrorModalContext";
import z from "zod";
import { DefaultValues, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ErrorSystem } from "../utils/ErrorSystem";
import FormErrorModalContent from "./FormErrorModalContent";
import clsx from "clsx";
import Section from "./Section";
import { EndFormButtonBar } from "./EndFormButtonBar";

export type DefaultFormProps<FormSchema extends Record<string, any>> = {
  id: string;
  layout: Layout;
  validatorSchema: z.ZodObject;
  defaultValues: FormSchema;
  /** Executed when the user changes the model name of a ModelSection and after all default routine */
  afterModelNameChange?: (
    name: string,
    fullName: keyof FormSchema,
    value: string,
    form: UseFormReturn<FormSchema>,
  ) => void;
  /** Executed when the user changes the node name of a NodeSection and after all default routine */
  afterNodeNameChange?: (
    name: string,
    fullName: keyof FormSchema,
    value: string,
    form: UseFormReturn<FormSchema>,
  ) => void;
  handleFormSubmit: (
    data: FormSchema,
    form: UseFormReturn<FormSchema>,
  ) => Promise<void>;
  /** If given this message will be displayed in a toast.success() call */
  successSubmitMessage?: string;
  /** If given this message will be displayed in a emitError() call of ErrorSystem and the error will not be thrown */
  errorSubmitMessage?: string;
  /** If given this function will be called when the form has been reseted */
  onReset?: (
    prevData: FormSchema,
    resetedData: FormSchema,
    form: UseFormReturn<FormSchema>,
  ) => void;
  /** If given this function will be called when the reset button is clicked and will replace the default reset function */
  onResetButtonClick?: (form: UseFormReturn<FormSchema>) => void;
  /** If given this message will be displayed in a toast.success() call after the reset */
  onResetMessage?: string;
  /** If given this message will be displayed in the error modal when formErrors is not empty (by default "Form errors") */
  formErrorMessage?: string;
  /** @see EndFormButtonBarProps#nextButtonHref */
  nextButtonHref?: string;
  /** Give this funcion don't replace submit handler */
  onSubmitButtonClick?: (
    data: Partial<FormSchema>,
    event: BaseSyntheticEvent<object, any, any> | undefined,
    form: UseFormReturn<FormSchema>,
  ) => void;
  onLoad?: (form: UseFormReturn<FormSchema>) => void;
};

export function DefaultForm<FormSchema extends Record<string, any>>({
  layout: givenLayout,
  validatorSchema: givenValidatorSchema,
  defaultValues,
  afterModelNameChange,
  afterNodeNameChange,
  handleFormSubmit: givenHandleFormSubmit,
  successSubmitMessage,
  errorSubmitMessage,
  onReset,
  onResetButtonClick: givenOnResetButtonClick,
  onResetMessage,
  formErrorMessage = "Form errors",
  id,
  nextButtonHref,
  onSubmitButtonClick,
  onLoad,
}: DefaultFormProps<FormSchema>) {
  // Contexts
  const { showModal } = useErrorModal();

  // States
  const [layout, setLayout] = useState(givenLayout);
  const [validatorSchema, setValidatorSchema] = useState(givenValidatorSchema);

  // Refs

  // Hooks externos
  const form = useForm<FormSchema>({
    defaultValues: defaultValues as DefaultValues<FormSchema>,
    resolver: zodResolver<FormSchema, any, FormSchema>(validatorSchema as any),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors: formErrors },
  } = form;

  // Memos / Callbacks
  /** A list of all models sections in the layout */
  const modelsSections = useMemo(
    () => layout.sections.filter((s) => s instanceof ModelSection),
    [layout],
  );

  /** A list of all nodes sections in the layout */
  const nodesSections = useMemo(
    () => layout.sections.filter((s) => s instanceof NodeSection),
    [layout],
  );

  // Effects

  /** Effect to show the form errors */
  useEffect(() => {
    if (formErrors && Object.keys(formErrors).length > 0) {
      ErrorSystem.emitError(formErrors, formErrorMessage);
      showModal(
        <FormErrorModalContent formErrors={formErrors} />,
        formErrorMessage,
      );
    }
  }, [formErrors]);

  /** Effect to run change model/node routines when the form is loaded */
  useEffect(() => {
    onLoad?.(form);

    // Models
    modelsSections.forEach((section) => {
      const nameFieldName = section.getModelNameFieldName() as keyof FormSchema;
      const selectedModel = getValues(nameFieldName as any) as string;

      if (selectedModel) {
        onModelNameChange(
          nameFieldName as string,

          section.subsections[0].nestedIn
            ? ((section.subsections[0].nestedIn +
                "." +
                (nameFieldName as string)) as keyof FormSchema)
            : nameFieldName,

          selectedModel,
        );
      }
    });

    // Nodes
    nodesSections.forEach((section) => {
      const nameFieldName = section.getNodeNameFieldName() as keyof FormSchema;
      const selectedNode = getValues(nameFieldName as any) as string;

      if (selectedNode) {
        onNodeNameChange(
          nameFieldName as string,

          section.subsections[0].nestedIn
            ? ((section.subsections[0].nestedIn +
                "." +
                (nameFieldName as string)) as keyof FormSchema)
            : nameFieldName,

          selectedNode,
        );
      }
    });
  }, []);

  // Ifs

  // Functions

  /**
   * Called when the user changes the model name of a ModelSection in the form.
   * This function updates the parameters subsection of the ModelSection and
   * the values of the corresponding parameters in the form.
   * @param {string} name - The name of the ModelSection.
   * @param {keyof FormSchema} fullName - The full name of the ModelSection in the form.
   * @param {string} model - The name of the selected model.
   */
  const onModelNameChange = (
    name: string,
    fullName: keyof FormSchema,
    model: string,
  ) => {
    const section = layout.sections.find(
      (s) => s instanceof ModelSection && s.getModelNameFieldName() === name,
    ) as ModelSection | undefined;

    if (!section) throw new Error(`Model ${name} not found in form`);

    const parametersSubsection = section.getParametersSubsection(model);
    const parametersPrefix =
      section.getModelParametersPrefix() as keyof FormSchema;

    section.setParametersSubsection(model, parametersSubsection);

    if (parametersSubsection) {
      // Change validator schema of the form
      setValidatorSchema(
        z.object({
          ...validatorSchema.shape,
          [parametersPrefix]: parametersSubsection?.getSchema(),
        }),
      );

      // Set empty obj to replace undefined in parameters field in the form
      const parametersSubsectionCurrentValue = getValues(
        parametersPrefix as any,
      );

      if (parametersSubsectionCurrentValue === undefined) {
        setValue(parametersPrefix as any, {} as any);
      }
    } else {
      // Change validator schema of the form
      setValidatorSchema(
        z.object({ ...validatorSchema.shape, [parametersPrefix]: z.any() }),
      );
      setValue(parametersPrefix as any, {} as any);
    }

    setLayout(layout.copy());

    afterModelNameChange?.(name, fullName, model, form);
  };

  /**
   * Called when the user changes the node name of a NodeSection in the form.
   * This function updates the parameters subsection of the NodeSection and
   * the values of the corresponding parameters in the form.
   * @param {string} name - The name of the NodeSection.
   * @param {keyof FormSchema} fullName - The full name of the NodeSection in the form.
   * @param {string} node - The name of the selected node.
   */
  const onNodeNameChange = (
    name: string,
    fullName: keyof FormSchema,
    node: string,
  ) => {
    const section = layout.sections.find(
      (s) => s instanceof NodeSection && s.getNodeNameFieldName() === name,
    ) as NodeSection | undefined;

    if (!section) throw new Error(`Node ${name} not found in form`);

    const parametersSubsection = section.getParametersSubsection(node);
    const parametersPrefix =
      section.getNodeParametersPrefix() as keyof FormSchema;

    section.setParametersSubsection(node, parametersSubsection);

    if (parametersSubsection) {
      // Change validator schema of the form
      setValidatorSchema(
        z.object({
          ...validatorSchema.shape,
          [parametersPrefix]: parametersSubsection?.getSchema(),
        }),
      );

      // Set empty obj to replace undefined in parameters field in the form
      const parametersSubsectionCurrentValue = getValues(
        parametersPrefix as any,
      );

      if (parametersSubsectionCurrentValue === undefined) {
        setValue(parametersPrefix as any, {} as any);
      }
    } else {
      // Change validator schema of the form
      setValidatorSchema(
        z.object({ ...validatorSchema.shape, [parametersPrefix]: z.any() }),
      );
      setValue(parametersPrefix as any, {} as any);
    }

    setLayout(layout.copy());

    afterNodeNameChange?.(name, fullName, node, form);
  };

  /**
   * Submits the form and handles the result of the givenHandleFormSubmit callback.
   * If the callback resolves, it displays a success toast with the given successSubmitMessage.
   * If the callback rejects, it displays an error toast with the given errorSubmitMessage.
   * If no errorSubmitMessage is given, it re-throws the error.
   * @param {FormSchema} data - The data of the form.
   * @returns {Promise<void>} - A promise that resolves when the form is submitted and the callback is handled.
   */
  const handleFormSubmit = async (data: FormSchema) => {
    await givenHandleFormSubmit(data, form).then(
      () => {
        if (successSubmitMessage) toast.success(successSubmitMessage);
      },
      (error) => {
        if (errorSubmitMessage)
          ErrorSystem.emitError(error, errorSubmitMessage);
        else throw error;
      },
    );
  };

  /**
   * Called when the reset button is clicked.
   * If givenOnResetButtonClick is given,
   * it calls the given function with the form as argument.
   * If not, it resets the form, calls the onReset callback with the previous data,
   * the new data and the form, and displays a success toast with the onResetMessage if given.
   */
  const onResetButtonClick = () => {
    if (givenOnResetButtonClick) givenOnResetButtonClick(form);
    else {
      const prevData = getValues();
      reset();
      onReset?.(prevData, getValues(), form);
      if (onResetMessage) toast.success(onResetMessage);
    }
  };

  return (
    <form
      className={clsx("flex", "flex-col", "gap-8", "relative")}
      onSubmit={handleSubmit(handleFormSubmit)}
      id={id}
    >
      {layout.sections.map((section, sectionIndex) => {
        return (
          <Section
            control={control}
            register={register}
            section={section}
            key={section.id + "_" + sectionIndex}
            onModelNameChange={onModelNameChange}
            onNodeNameChange={onNodeNameChange}
          />
        );
      })}

      <EndFormButtonBar
        nextButtonHref={nextButtonHref}
        onResetButtonClick={onResetButtonClick}
        onSubmitButtonClick={(event) =>
          onSubmitButtonClick?.(getValues(), event, form)
        }
      />
    </form>
  );
}
