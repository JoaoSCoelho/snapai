import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useForm, useWatch } from "react-hook-form";
import { Layout } from "@/simulator/configurations/layout/Layout";
import { useErrorModal } from "../contexts/ErrorModalContext";
import { Project } from "@/simulator/models/Project";
import { SimulationConfigSchema } from "@/simulator/configurations/Simulation/simulationConfigSchema";
import { ErrorSystem } from "../utils/ErrorSystem";
import Section from "./Section";
import axios from "axios";
import { toast } from "sonner";
import { ProjectConfig } from "@/simulator/configurations/Project/ProjectConfig";
import { ModelSection } from "@/simulator/configurations/layout/ModelSection";
import { Line } from "@/simulator/configurations/layout/Line";

const ReactJson = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

export type ConfigFormSchema = {
  simulationConfig: SimulationConfigSchema;
  projectConfig: Record<string, any> | undefined;
};

export type SuperSection = {
  title: string;
  prefix: string;
  layout: Layout | null;
  nestedIn: string[];
};

type ConfigFormProps = {
  project: Project;
};
export default function ConfigForm({ project }: ConfigFormProps) {
  const [simulationConfigLayout, setSimulationConfigLayout] = useState<Layout>(
    project.simulationConfig.layout,
  );
  const [projectConfigLayout, setProjectConfigLayout] = useState<Layout | null>(
    project.projectConfig?.layout ?? null,
  );

  const { showModal } = useErrorModal();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors: formErrors },
  } = useForm({
    defaultValues: {
      simulationConfig: project.simulationConfig.toJSON(),
      projectConfig: project.projectConfig?.toJSON(),
    },
    resolver: zodResolver(
      z.object({
        simulationConfig: project.simulationConfig.validatorSchema,
        projectConfig: project.projectConfig?.validatorSchema ?? z.undefined(),
      }),
    ),
  });

  const superSections: SuperSection[] = useMemo(() => {
    return [
      {
        title: "Global Simulation Config",
        prefix: "global_simulation",
        layout: simulationConfigLayout,
        nestedIn: ["simulationConfig"],
      },
      ...(projectConfigLayout
        ? [
            {
              title: "Project Config",
              prefix: "project",
              layout: projectConfigLayout,
              nestedIn: ["projectConfig"],
            },
          ]
        : []),
    ];
  }, [simulationConfigLayout, projectConfigLayout]);

  const modelsFieldsNames = useMemo(() => {
    return superSections.flatMap((superSection) => {
      return (
        superSection.layout?.sections
          .filter((s) => s instanceof ModelSection)
          .flatMap(
            (section) =>
              `${superSection.nestedIn.join(".")}.${section.getModelNameFieldFullName()}`,
          ) ?? []
      );
    });
  }, []) as `${keyof ConfigFormSchema}.${string}`[];

  const watchModels = useWatch({ control, name: modelsFieldsNames });

  useEffect(() => {
    project.simulationConfig.layout.sections.forEach((section) => {
      if (section instanceof ModelSection) {
        const fieldName = section.getModelNameFieldFullName();
        const model = getValues(`simulationConfig.${fieldName}`);

        if (typeof model !== "string")
          throw new Error(`Model ${fieldName} not found in config form`);

        const parametersSubsection = section.getParametersSubsection(model);

        section.setParametersSubsection(model, parametersSubsection);
        console.log(
          `simulationConfig.${section.getParametersSubsectionFullName()}`,
          getValues(
            `simulationConfig.${section.getParametersSubsectionFullName()}`,
          ),
        );
        parametersSubsection &&
          setValue(
            `simulationConfig.${section.getParametersSubsectionFullName()}`,
            parametersSubsection
              .getSchema()
              .parse(
                getValues(
                  `simulationConfig.${section.getParametersSubsectionFullName()}`,
                ),
              ),
          );
      }
    });

    setSimulationConfigLayout({ ...project.simulationConfig.layout });

    if (!project.projectConfig) return;

    project.projectConfig.layout.sections.forEach((section) => {
      if (section instanceof ModelSection) {
        const fieldName = section.getModelNameFieldFullName();
        const model = getValues(`projectConfig.${fieldName}`);

        if (typeof model !== "string")
          throw new Error(`Model ${fieldName} not found in config form`);

        const parametersSubsection = section.getParametersSubsection(model);

        section.setParametersSubsection(model, parametersSubsection);

        parametersSubsection &&
          setValue(
            `projectConfig.${section.getParametersSubsectionFullName()}`,
            parametersSubsection
              .getSchema()
              .partial()
              .safeParse(
                getValues(
                  `projectConfig.${section.getParametersSubsectionFullName()}`,
                ),
              ),
          );
      }
    });

    setProjectConfigLayout({ ...project.projectConfig.layout });
  }, [watchModels]);

  useEffect(() => {
    if (formErrors && Object.keys(formErrors).length > 0) {
      console.error(formErrors);
      ErrorSystem.emitError(formErrors, "Error validating config form");
      showModal(
        <ReactJson
          src={formErrors}
          name={"formErrors"}
          collapsed={false}
          enableClipboard={true}
          displayDataTypes={false}
          quotesOnKeys={false}
          theme="rjv-default"
        />,
        "Error validating config form",
      );
    }
  }, [formErrors]);

  const saveSimulationConfig = async (data: SimulationConfigSchema) => {
    project.simulationConfig.setData(data);
    await axios.post("/api/write-json", {
      path: project.simulationConfig.configJsonFilePath,
      data: data,
    });
  };

  const saveProjectConfig = async (
    projectConfig: ProjectConfig,
    data: Record<string, any>,
  ) => {
    if (!data.projectConfig) throw new Error("No project config data");
    projectConfig.setData(data.projectConfig);
    await axios.post("/api/write-json", {
      path: projectConfig.configJsonFilePath,
      data: data.projectConfig,
    });
  };

  const handleConfigSubmit = async (data: ConfigFormSchema) => {
    await saveSimulationConfig(data.simulationConfig);

    if (project.projectConfig)
      await saveProjectConfig(project.projectConfig, data);

    toast.success("Config saved");
  };

  const onResetButtonClick = () => {
    reset();
    toast.success("Config reseted");
  };

  return (
    <form
      className={clsx("flex", "flex-col", "gap-8", "relative")}
      onSubmit={handleSubmit(handleConfigSubmit as any)}
      id="config-form"
    >
      {superSections.map((superSection) => {
        return (
          <div
            key={superSection.prefix + superSection.title}
            id={superSection.prefix + superSection.title}
            className={clsx(
              "w-full",
              "p-4",
              "rounded-md",
              "shadow-lg",
              "bg-stone-50",
            )}
          >
            <h2 className={clsx("text-3xl", "mb-2")}>{superSection.title}</h2>

            {superSection.layout?.sections.map((section, sectionIndex) => {
              return (
                <Section
                  control={control}
                  register={register}
                  section={section}
                  nestedIn={superSection.nestedIn}
                  superSection={superSection}
                  key={section.title + sectionIndex}
                />
              );
            })}
          </div>
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
