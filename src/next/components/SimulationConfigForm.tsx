import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useForm, useWatch } from "react-hook-form";
import { useErrorModal } from "../contexts/ErrorModalContext";
import { Project } from "@/simulator/models/Project";
import { SimulationConfigSchema } from "@/simulator/configurations/Simulation/simulationConfigSchema";
import { ErrorSystem } from "../utils/ErrorSystem";
import Section from "./Section";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import FormErrorModalContent from "./FormErrorModalContent";
import { useConfigContext } from "../contexts/ConfigContext";
import { ModelSection } from "@/simulator/configurations/layout/ModelSection";
import { Layout } from "@/simulator/configurations/layout/Layout";
import z from "zod";

type SimulationConfigFormSchema = SimulationConfigSchema;

type SimulationConfigFormProps = {
  project: Project;
};

export default function SimulationConfigForm({
  project,
}: SimulationConfigFormProps) {
  const [simulationConfigLayout, setSimulationConfigLayout] = useState<Layout>(
    project.simulationConfig.layout,
  );
  const modelsSections = useMemo(
    () =>
      simulationConfigLayout.sections.filter((s) => s instanceof ModelSection),
    [simulationConfigLayout],
  );

  const { showModal } = useErrorModal();
  const { saveSimulationConfig } = useConfigContext();

  const [validatorSchema, setValidatorSchema] = useState(
    project.simulationConfig.validatorSchema,
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    setError,
    formState: { errors: formErrors },
  } = useForm<SimulationConfigFormSchema>({
    defaultValues: project.simulationConfig.toJSON(),
    resolver: zodResolver<
      SimulationConfigFormSchema,
      any,
      SimulationConfigFormSchema
    >(validatorSchema as any),
  });

  /**
   * Called when the user changes the model name of a ModelSection in the config form.
   * This function updates the parameters subsection of the ModelSection and
   *  the values of the corresponding corresponding parameters in the config form.
   * @param {string} name - The name of the ModelSection.
   * @param {keyof SimulationConfigFormSchema} _fullName - The full name of the ModelSection in the config form.
   * @param {string} model - The name of the model.
   */
  const onModelNameChange = (
    name: string,
    _fullName: keyof SimulationConfigFormSchema,
    model: string,
  ) => {
    const section = project.simulationConfig.layout.sections.find(
      (s) => s instanceof ModelSection && s.getModelNameFieldName() === name,
    ) as ModelSection | undefined;

    if (!section) throw new Error(`Model ${name} not found in config form`);

    const parametersSubsection = section.getParametersSubsection(model);
    const parametersPrefix =
      section.getModelParametersPrefix() as keyof SimulationConfigFormSchema;

    section.setParametersSubsection(model, parametersSubsection);

    if (parametersSubsection) {
      // const parsed = parametersSubsection
      //   .getSchema()
      //   .safeParse(getValues(parametersPrefix));
      // if (parsed.error) {
      //   parsed.error.issues.forEach((issue) => {
      //     setError(
      //       `${parametersPrefix}.${issue.path.join(".")}` as keyof SimulationConfigFormSchema,
      //       {
      //         message: issue.message,
      //       },
      //     );
      //   });
      //   return;
      // }
      // setValue(parametersPrefix, parsed.data);

      setValidatorSchema(
        z.object({
          ...project.simulationConfig.validatorSchema.shape,
          [parametersPrefix]: parametersSubsection?.getSchema(),
        }),
      );
    }

    setSimulationConfigLayout({ ...project.simulationConfig.layout });
  };

  const handleFormSubmit = async (data: SimulationConfigFormSchema) => {
    // modelsSections.forEach((section) => {
    //   const parametersPrefix =
    //     section.getModelParametersPrefix() as keyof SimulationConfigFormSchema;
    //   const parametersSubsection = section.getCurrentParametersSubsection();

    //   if (parametersSubsection) {
    //     const parsed = parametersSubsection
    //       .getSchema()
    //       .safeParse(data[parametersPrefix]);

    //     if (parsed.error) {
    //       parsed.error.issues.forEach((issue) => {
    //         setError(
    //           `${parametersPrefix}.${issue.path.join(".")}` as keyof SimulationConfigFormSchema,
    //           {
    //             message: issue.message,
    //           },
    //         );
    //       });

    //       return;
    //     }

    //     //@ts-ignore
    //     data[parametersPrefix] = parsed.data;
    //   }
    // });

    await saveSimulationConfig(project, data);

    toast.success("Simulation config. saved");

    redirect("/dashboard/configuration/project");
  };

  const onResetButtonClick = () => {
    reset();
    toast.success("Simulation config. reseted");
  };

  useEffect(() => {
    if (formErrors && Object.keys(formErrors).length > 0) {
      ErrorSystem.emitError(formErrors, "Error validating config form");
      showModal(
        <FormErrorModalContent formErrors={formErrors} />,
        "Error validating config form",
      );
    }
  }, [formErrors]);

  useEffect(() => {
    modelsSections.forEach((section) => {
      const nameFieldName =
        section.getModelNameFieldName() as keyof SimulationConfigFormSchema;
      const selectedModel = getValues(nameFieldName) as string;

      if (selectedModel) {
        onModelNameChange(
          nameFieldName,
          section.subsections[0].nestedIn
            ? ((section.subsections[0].nestedIn +
                "." +
                nameFieldName) as keyof SimulationConfigFormSchema)
            : nameFieldName,
          selectedModel,
        );
      }
    });
  }, []);

  return (
    <form
      className={clsx("flex", "flex-col", "gap-8", "relative")}
      onSubmit={handleSubmit(handleFormSubmit)}
      id="config-form"
    >
      {simulationConfigLayout.sections.map((section, sectionIndex) => {
        return (
          <Section
            control={control}
            register={register}
            section={section}
            key={section.id + "_" + sectionIndex}
            onModelNameChange={
              onModelNameChange as (name: string, value: string) => void
            }
          />
        );
      })}

      <div className="button-bar-spacer h-18"></div>
      <div className="fixed flex gap-4 bottom-0 rounded-t-lg bg-white p-4 shadow-2xl shadow-gray-700 left-1/2 -translate-x-1/2 z-10">
        <Button
          type="button"
          variant="contained"
          size="large"
          color="warning"
          className="flex items-center gap-2"
          onClick={onResetButtonClick}
        >
          <RefreshIcon /> Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          size="large"
          className="flex items-center gap-2"
        >
          <SaveIcon /> Save
        </Button>
      </div>
    </form>
  );
}
