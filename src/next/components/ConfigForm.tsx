import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useForm } from "react-hook-form";
import { Layout } from "@/simulator/configurations/layout/Layout";
import { useErrorModal } from "../contexts/ErrorModalContext";
import { Section } from "@/simulator/configurations/layout/Section";
import { Project } from "@/simulator/models/Project";
import { SimulationConfigSchema } from "@/simulator/configurations/Simulation/simulationConfigSchema";
import { ErrorSystem } from "../utils/ErrorSystem";

const ReactJson = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

export type ConfigFormSchema = {
  simulationConfig: SimulationConfigSchema;
  projectConfig: Record<string, any>;
};

export type SuperSection = {
  title: string;
  prefix: string;
  layout: Layout | null;
  nestedIn?: string[];
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
    formState: { errors: formErrors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(
      z.object({
        simulationConfig: project.simulationConfig.validatorSchema,
        projectConfig: project.projectConfig?.validatorSchema,
      }),
    ),
  });

  const superSections: SuperSection[] = useMemo(
    () => [
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
    ],
    [simulationConfigLayout, projectConfigLayout],
  );

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

  const handleConfigSubmit = (data: ConfigFormSchema) => {
    // TODO
  };

  const onResetButtonClick = () => {
    // TODO
  };

  return (
    <form
      className={clsx("flex", "flex-col", "gap-8", "relative")}
      onSubmit={handleSubmit(handleConfigSubmit)}
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
                  isLoadingConfig={isLoadingConfig}
                  register={register}
                  section={section}
                  nestedIn={superSection.nestedIn}
                  superSection={superSection}
                  key={section.id + sectionIndex}
                  onModelNameChange={updateModelSections}
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
