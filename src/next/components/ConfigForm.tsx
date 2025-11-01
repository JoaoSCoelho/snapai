import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { z } from "zod";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { v6 as uuidv6 } from "uuid";
import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  simulationConfigSchema,
  SimulationConfigSchema,
} from "@/simulator/configurations/Simulation/SimulationConfigSchema";
import { useForm } from "react-hook-form";
import { SimulationConfigLayout } from "@/simulator/configurations/Simulation/SimulationConfigLayout";
import { Layout } from "@/simulator/configurations/layout/Layout";
import { useErrorModal } from "../contexts/ErrorModalContext";
import { Section } from "@/simulator/configurations/layout/Section";

const ReactJson = dynamic(() => import("@microlink/react-json-view"), {
  ssr: false,
});

export type SuperSection = {
  title: string;
  prefix: string;
  layout: Layout | null;
  nestedPaths?: string[];
};

type ConfigFormProps = {
  projectName: string;
};
export default function ConfigForm({ projectName }: ConfigFormProps) {
  const [simulationConfigLayout, setSimulationConfigLayout] = useState<Layout>(
    SimulationConfigLayout,
  );
  const [projectConfigLayout, setProjectConfigLayout] =
    useState<Layout | null>();
  const [configFormSchema, setConfigFormSchema] = useState<
    z.ZodType<SimulationConfigSchema>
  >(simulationConfigSchema);
  const [modelNameFields, setModelNameFields] = useState<string[]>([]);
  const [modelNameFieldsPathsAndSections, setModelNameFieldsPathsAndSections] =
    useState<Record<string, Section>>({});
  const [fetchKey, setFetchKey] = useState(uuidv6());
  const { showModal } = useErrorModal();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
    watch,
  } = useForm<SimulationConfigSchema>({
    resolver: configFormSchema
      ? zodResolver(
          configFormSchema as unknown as Parameters<
            typeof zodResolver<
              SimulationConfigSchema,
              any,
              SimulationConfigSchema
            >
          >[0],
        )
      : undefined,
  });

  const {
    data: configFormLayout,
    error: configFormLayoutError,
    isLoading: isLoadingConfigFormLayout,
    mutate,
  } = useSWR(`config_form_layout_${projectName}`, () =>
    fetchConfigFormLayout(projectName),
  );
  const {
    data: config,
    error: configError,
    isLoading: isLoadingConfig,
  } = useSWR(`config_${projectName}_${fetchKey}`, () =>
    fetchConfigForm(projectName),
  );

  const superSections: SuperSection[] = useMemo(
    () => [
      {
        id: "global-simulation-config",
        title: "Global Simulation Config",
        prefix: "global_simulation",
        styleClasses: {
          superSection: [],
          superSectionTitle: [],
          section: [],
          sectionTitle: [],
          subSection: [],
          line: [],
        },
        layout: simulationConfigLayout,
      },
      ...(projectConfigLayout
        ? [
            {
              id: "project-config",
              title: "Project Config",
              prefix: "project",
              styleClasses: {
                superSection: [],
                superSectionTitle: [],
                section: [],
                sectionTitle: [],
                subSection: [],
                line: [],
              },
              layout: projectConfigLayout,
              nestedPaths: ["project_config"],
            },
          ]
        : []),
    ],
    [simulationConfigLayout, projectConfigLayout],
  );

  const updateModelSections = useCallback(
    async (inputName: string | undefined) => {
      if (!inputName || !modelNameFields.includes(inputName) || !config) return;

      const modelName: string = watch(inputName);
      const section = modelNameFieldsPathsAndSections[inputName];
      const modelSubsectionLayout = await fetchModelSubsectionLayout(
        modelName,
        section.model_type!,
      );

      if (inputName.startsWith("project_config")) {
        setProjectConfigLayout((projectConfigLayout) => ({
          sections: [
            ...(projectConfigLayout?.sections.map((section_) => {
              return {
                ...section_,
                subsections: section_.subsections.map((subsection) =>
                  getCorrectSubsection(subsection, section_),
                ),
              };
            }) ?? []),
          ],
        }));
      } else {
        setSimulationConfigLayout((simulationConfigLayout) =>
          simulationConfigLayout
            ? {
                sections: [
                  ...(simulationConfigLayout.sections.map((section_) => {
                    return {
                      ...section_,
                      subsections: section_.subsections.map((subsection) =>
                        getCorrectSubsection(subsection, section_),
                      ),
                    };
                  }) ?? []),
                ],
              }
            : undefined,
        );
      }

      function getCorrectSubsection(
        subsection: Subsection,
        section_: SectionType,
      ): Subsection {
        if (!subsection.model_parameters) return subsection;

        const isTheTarget =
          inputName!
            .split(".")
            .slice(0, -1)
            .join(".")
            .endsWith(
              section.subsections[0].lines[0].fields[0].nested_paths.join("."),
            ) &&
          section_.model_type === section.model_type &&
          subsection.model_parameters;

        if (!isTheTarget) return subsection;
        return modelSubsectionLayout;
      }
    },
    [config, watch, modelNameFieldsPathsAndSections, modelNameFields],
  );

  useEffect(() => {
    if (config && configFormLayout) {
      reset({
        ...watch(),
        ...config,
        project_config: { ...watch().project_config, ...config.project_config },
      });

      modelNameFields.forEach((inputName) => {
        updateModelSections(inputName);
      });
    }
  }, [config]);

  // set defaults values when config form layout is loaded
  useEffect(() => {
    if (configFormLayout) {
      const layouts = [
        configFormLayout.simulation_config_layout,
        ...(configFormLayout.project_config_layout
          ? [
              {
                ...configFormLayout.project_config_layout,
                nestedPaths: ["project_config"],
              },
            ]
          : []),
      ];

      reset(FormLayoutHelper.getLayoutValues(layouts));

      setSimulationConfigLayout(configFormLayout.simulation_config_layout);
      setProjectConfigLayout(configFormLayout.project_config_layout);

      const modelNameFieldsPathsAndSections =
        FormLayoutHelper.getModelNameFieldsPathsAndSections(layouts);
      setModelNameFields(Object.keys(modelNameFieldsPathsAndSections));
      setModelNameFieldsPathsAndSections(modelNameFieldsPathsAndSections);
      setFetchKey(uuidv6());
    }
  }, [configFormLayout]);

  // set config form schema everyTime superSections change (superSections defines the structure of the form)
  useEffect(() => {
    const layouts = superSections
      .map((superSection) =>
        superSection.layout
          ? { ...superSection.layout, nestedPaths: superSection.nestedPaths! }
          : undefined,
      )
      .filter((x) => x) as LayoutWithNestedPaths[];

    setConfigFormSchema(
      FormLayoutHelper.buildSchema<z.ZodObject<ConfigFormSchema>>(layouts),
    );

    reset({
      ...config,
      ...watch(),
      project_config: { ...config?.project_config, ...watch().project_config },
    });
  }, [superSections]);

  useEffect(() => {
    if (configFormLayoutError) {
      console.error(configFormLayoutError);
      toastError("Error loading config form layout");
    }
  }, [configFormLayoutError]);

  useEffect(() => {
    if (formErrors && Object.keys(formErrors).length > 0) {
      console.error(formErrors);
      toastError("Error validating config form");
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

  useEffect(() => {
    if (configError) {
      console.error(configError);
      toastError("Error loading config data");
    }
  }, [configError]);

  const handleConfigSubmit = (data: ConfigFormSchema) => {
    updateConfig(projectName, data)
      .then(() => {
        toast.success(
          <>
            Config of project <b>{projectName}</b> updated
          </>,
        );
      })
      .catch((error) => {
        console.error(error);
        toastError("Error updating config");
        return;
      });
  };

  const onResetButtonClick = () => {
    mutate(undefined, {
      revalidate: true,
    });
  };

  if (configFormLayoutError) return;

  if (isLoadingConfigFormLayout || isLoadingConfig) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl">
        Loading form layout...
      </div>
    );
  }

  return (
    <form
      className={clsx("flex", "flex-col", "gap-8", "relative")}
      onSubmit={handleSubmit(handleConfigSubmit)}
      id="config-form"
    >
      {superSections.map((superSection) => {
        return (
          <div
            key={superSection.id}
            id={superSection.id}
            className={clsx(
              superSection.id,
              "w-full",
              "p-4",
              "rounded-md",
              "shadow-lg",
              "bg-stone-50",
              ...superSection.styleClasses.superSection,
            )}
          >
            <h2
              className={clsx(
                "text-3xl",
                "mb-2",
                ...superSection.styleClasses.superSectionTitle,
              )}
            >
              {superSection.title}
            </h2>

            {superSection.layout?.sections.map((section, sectionIndex) => {
              return (
                <Section
                  control={control}
                  isLoadingConfig={isLoadingConfig}
                  register={register}
                  section={section}
                  nestedPaths={superSection.nestedPaths}
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
