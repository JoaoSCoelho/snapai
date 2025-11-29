import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useForm, useWatch } from "react-hook-form";
import { useErrorModal } from "../contexts/ErrorModalContext";
import { Project } from "@/simulator/models/Project";
import { ErrorSystem } from "../utils/ErrorSystem";
import Section from "./Section";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import FormErrorModalContent from "./FormErrorModalContent";
import { useConfigContext } from "../contexts/ConfigContext";
import { ModelSection } from "@/simulator/configurations/layout/ModelSection";
import { Layout } from "@/simulator/configurations/layout/Layout";
import { ProjectConfig } from "@/simulator/configurations/Project/ProjectConfig";
import z from "zod";

type ProjectConfigFormSchema = z.infer<ProjectConfig["validatorSchema"]>;

type ProjectConfigFormProps = {
  project: Project;
};

export default function ProjectConfigForm({ project }: ProjectConfigFormProps) {
  if (!project.projectConfig) {
    return null;
  }

  const [projectConfigLayout, setProjectConfigLayout] = useState<Layout>(
    project.projectConfig?.layout,
  );

  const modelsSections = useMemo(
    () => projectConfigLayout.sections.filter((s) => s instanceof ModelSection),
    [projectConfigLayout],
  );

  const { showModal } = useErrorModal();
  const { saveProjectConfig } = useConfigContext();

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    setError,
    formState: { errors: formErrors },
  } = useForm<ProjectConfigFormSchema>({
    defaultValues: project.projectConfig.toJSON(),
    resolver: zodResolver<
      ProjectConfigFormSchema,
      any,
      ProjectConfigFormSchema
    >(project.projectConfig.validatorSchema),
  });

  const onModelNameChange = (
    name: string,
    _fullName: keyof ProjectConfigFormSchema,
    model: string,
  ) => {
    const section = project.projectConfig!.layout.sections.find(
      (s) => s instanceof ModelSection && s.getModelNameFieldName() === name,
    ) as ModelSection | undefined;

    if (!section)
      throw new Error(`Model ${name} not found in project config form`);

    const parametersSubsection = section.getParametersSubsection(model);
    const parametersPrefix = section.getModelParametersPrefix();

    section.setParametersSubsection(model, parametersSubsection);

    if (parametersSubsection) {
      const parsed = parametersSubsection
        .getSchema()
        .safeParse(getValues(parametersPrefix));

      if (parsed.error) {
        parsed.error.issues.forEach((issue) => {
          setError(`${parametersPrefix}.${issue.path.join(".")}`, {
            message: issue.message,
          });
        });

        return;
      }

      setValue(parametersPrefix, parsed.data);
    }

    setProjectConfigLayout({ ...project.projectConfig!.layout });
  };

  const handleFormSubmit = async (data: ProjectConfigFormSchema) => {
    modelsSections.forEach((section) => {
      const parametersPrefix = section.getModelParametersPrefix();
      const parametersSubsection = section.getCurrentParametersSubsection();

      if (parametersSubsection) {
        const parsed = parametersSubsection
          .getSchema()
          .safeParse(data[parametersPrefix]);

        if (parsed.error) {
          parsed.error.issues.forEach((issue) => {
            setError(`${parametersPrefix}.${issue.path.join(".")}`, {
              message: issue.message,
            });
          });

          return;
        }

        //@ts-ignore
        data[parametersPrefix] = parsed.data;
      }
    });

    await saveProjectConfig(project, data);

    toast.success("Project config. saved");

    redirect("/dashboard/controls");
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
        section.getModelNameFieldName() as keyof ProjectConfigFormSchema;
      const selectedModel = getValues(nameFieldName) as string;

      if (selectedModel) {
        onModelNameChange(
          nameFieldName,
          section.subsections[0].nestedIn
            ? ((section.subsections[0].nestedIn +
                "." +
                nameFieldName) as keyof ProjectConfigFormSchema)
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
      {projectConfigLayout.sections.map((section, sectionIndex) => {
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

      <div className="button-bar-spacer h-16"></div>
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
