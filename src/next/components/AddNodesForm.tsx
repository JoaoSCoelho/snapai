import {
  addNodes,
  fetchModelsNames,
  fetchModelSubsectionLayout,
  fetchNodesNames,
  fetchNodeSubsectionLayout,
  Layout,
  Subsection,
} from "@/lib/fetchers";
import clsx from "clsx";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useQueryState } from "nuqs";
import { z } from "zod";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import { ModelType } from "@/simulator/utils/modelsUtils";

export type AddNodesFormProps = {
  onSubmit?: (data: AddNodesFormSchema) => void;
};

export type AddNodesFormSchema = {
  numberOfNodes: number;
  node: string;
  nodeParameters: Record<string, unknown>;
  mobilityModel: string;
  mobilityModelParameters: Record<string, unknown>;
  connectivityModel: string;
  connectivityModelParameters: Record<string, unknown>;
  interferenceModel: string;
  interferenceModelParameters: Record<string, unknown>;
  reliabilityModel: string;
  reliabilityModelParameters: Record<string, unknown>;
  distributionModel: string;
  distributionModelParameters: Record<string, unknown>;
};

export default function AddNodesForm({ onSubmit }: AddNodesFormProps) {
  const nodesNames = SearchEngine.getPrefixedNodesNames();
  const mobilityModelsNames = SearchEngine.getPrefixedModelsNames(ModelType.Mobility);
  const connectivityModelsNames = SearchEngine.getPrefixedModelsNames(ModelType.Connectivity);
  const interferenceModelsNames = SearchEngine.getPrefixedModelsNames(ModelType.Interference);
  const reliabilityModelsNames = SearchEngine.getPrefixedModelsNames(ModelType.Reliability);
  const distributionModelsNames = SearchEngine.getPrefixedModelsNames(ModelType.Distribution);
  

  const 

  const [queryForm, setQueryForm] = useQueryState<Record<string, any>>(
    "add_nodes_form",
    {
      parse: JSON.parse,
      serialize: JSON.stringify,
    },
  );

  const [addNodesFormSchema, setAddNodesFormSchema] =
    useState<z.ZodObject<AddNodesFormSchema>>();
  const addNodesForm = useForm<AddNodesFormSchema>({
    resolver:
      addNodesFormSchema &&
      zodResolver(
        addNodesFormSchema as unknown as Parameters<
          typeof zodResolver<AddNodesFormSchema, any, AddNodesFormSchema>
        >[0],
      ),
  });
  const {
    handleSubmit,
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors: formErrors },
  } = addNodesForm;

  const {
    data: { layout: nodeParametersSubsection, defaultParameters } = {
      layout: undefined,
      defaultParameters: undefined,
    },
    error: nodeParametersSubsectionError,
    isLoading: nodeParametersSubsectionLoading,
  } = useSWR(
    watch("node") && `node_parameters_subsection_${watch("node")}`,
    () => fetchNodeSubsectionLayout(watch("node")),
  );
  const {
    data: mobilityModelParametersSubsection,
    error: mobilityModelParametersSubsectionError,
    isLoading: mobilityModelParametersSubsectionLoading,
  } = useSWR(
    watch("mobility_model") &&
      `mobility_model_parameters_subsection_${watch("mobility_model")}`,
    () => fetchModelSubsectionLayout(watch("mobility_model"), "mobility"),
  );
  const {
    data: connectivityModelParametersSubsection,
    error: connectivityModelParametersSubsectionError,
    isLoading: connectivityModelParametersSubsectionLoading,
  } = useSWR(
    watch("connectivity_model") &&
      `connectivity_model_parameters_subsection_${watch("connectivity_model")}`,
    () =>
      fetchModelSubsectionLayout(watch("connectivity_model"), "connectivity"),
  );
  const {
    data: distributionModelParametersSubsection,
    error: distributionModelParametersSubsectionError,
    isLoading: distributionModelParametersSubsectionLoading,
  } = useSWR(
    watch("distribution_model") &&
      `distribution_model_parameters_subsection_${watch("distribution_model")}`,
    () =>
      fetchModelSubsectionLayout(watch("distribution_model"), "distribution"),
  );
  const {
    data: reliabilityModelParametersSubsection,
    error: reliabilityModelParametersSubsectionError,
    isLoading: reliabilityModelParametersSubsectionLoading,
  } = useSWR(
    watch("reliability_model") &&
      `reliability_model_parameters_subsection_${watch("reliability_model")}`,
    () =>
      fetchModelSubsectionLayout(watch("reliability_model")!, "reliability"),
  );
  const {
    data: interferenceModelParametersSubsection,
    error: interferenceModelParametersSubsectionError,
    isLoading: interferenceModelParametersSubsectionLoading,
  } = useSWR(
    watch("interference_model") &&
      `interference_model_parameters_subsection_${watch("interference_model")}`,
    () =>
      fetchModelSubsectionLayout(watch("interference_model"), "interference"),
  );

  const [formLayout, setFormLayout] = useState<Layout>();

  const onFormSubmit = (data: AddNodesFormSchema) => {
    console.log(data);
    addNodes({
      ...data,
      connectivity_model_parameters: { ...data.connectivity_model_parameters },
      mobility_model_parameters: { ...data.mobility_model_parameters },
      node_parameters: { ...data.node_parameters },
      distribution_model_parameters: { ...data.distribution_model_parameters },
      reliability_model_parameters: { ...data.reliability_model_parameters },
      interference_model_parameters: { ...data.interference_model_parameters },
    }).then(() => {
      toast.success("Nodes added");
    });
    onSubmit?.(data);
  };

  useEffect(() => {
    (window as Window & typeof globalThis & { electron: any }).electron?.on(
      "get_add_nodes_form_response",
      (data: AddNodesFormSchema) => {
        reset(data);
      },
    );
    (window as Window & typeof globalThis & { electron: any }).electron?.send(
      "get_add_nodes_form",
    );
    const interval = setInterval(() => {
      (window as Window & typeof globalThis & { electron: any }).electron?.send(
        "add_nodes_form_updated",
        getValues(),
      );
    }, 200);
    return () => clearInterval(interval);
  }, [getValues]);

  useEffect(() => {
    if (!formLayout) return;
    setAddNodesFormSchema(
      FormLayoutHelper.buildSchema<z.ZodObject<AddNodesFormSchema>>([
        formLayout,
      ]),
    );
  }, [formLayout]);

  useEffect(() => {
    if (
      !nodesNames ||
      !mobilityModelsNames ||
      !connectivityModelsNames ||
      !interferenceModelsNames ||
      !reliabilityModelsNames ||
      !distributionModelsNames
    )
      return;
    setFormLayout({
      sections: [
        {
          id: "node-configuration",
          title: "Node Configuration",
          subsections: [
            {
              id: "node-configuration-main",
              title: null,
              model_parameters: false,
              lines: [
                {
                  fields: [
                    {
                      id: "number-of-nodes",
                      informative: {
                        title: "The number of nodes to be added in this batch.",
                        help_text:
                          "The number of nodes to be added in this batch.",
                        as_html: false,
                      },
                      is_float: false,
                      label: "Number of Nodes",
                      max_value: null,
                      min_value: 1,
                      name: "number_of_nodes",
                      nested_paths: [],
                      occuped_columns: 3,
                      required: true,
                      type: "number",
                      value: queryForm?.number_of_nodes ?? 1,
                      is_angle: false,
                    } as NumberField,
                    {
                      id: "node-name",
                      informative: {
                        title:
                          "Use only the name if is a default implementation or project_name:node_implementation if is a custom implementation",
                        help_text:
                          "Use only the name if is a default implementation or project_name:node_implementation if is a custom implementation",
                        as_html: false,
                      },
                      label: "Node",
                      name: "node",
                      type: "node_select",
                      occuped_columns: 9,
                      nested_paths: [],
                      required: true,
                      options: nodesNames.map((name) => ({
                        value: name,
                        label: name,
                      })),
                      value: queryForm?.node,
                    } as NodeSelectField,
                  ],
                },
              ],
            },
            ...(defaultParameters
              ? [
                  {
                    id: "node-default-parameters",
                    title: null,
                    model_parameters: false,
                    lines: [
                      {
                        fields: [
                          {
                            id: "node-color",
                            informative: {
                              title:
                                "The color of the node as HEX (e.g #FFB582)",
                              help_text:
                                "The color of the node as HEX (e.g #FFB582)",
                              as_html: false,
                            },
                            label: "Node Color",
                            max_value: null,
                            min_value: null,
                            name: "node_color",
                            nested_paths: [],
                            occuped_columns: 6,
                            required: true,
                            type: "color",
                            value: queryForm?.node_color,
                          } as ColorField,
                          {
                            id: "node-size",
                            informative: {
                              title: "The size of the node",
                              help_text: "The size of the node",
                              as_html: false,
                            },
                            label: "Node Size",
                            is_float: false,
                            max_value: null,
                            min_value: 0,
                            name: "node_size",
                            nested_paths: [],
                            occuped_columns: 6,
                            required: true,
                            type: "number",
                            value: queryForm?.node_size ?? 1,
                            is_angle: false,
                          } as NumberField,
                        ],
                      },
                    ],
                  } as Subsection,
                  nodeParametersSubsection,
                ]
              : nodeParametersSubsection
                ? [nodeParametersSubsection]
                : []),
          ],
        },
        {
          id: "distribution-configuration",
          title: "Distribution Configuration",
          subsections: [
            {
              id: "distribution-configuration-main",
              title: null,
              model_parameters: true,
              lines: [
                {
                  fields: [
                    {
                      id: "distribution-model",
                      label: "Distribution Model",
                      name: "distribution_model",
                      type: "model_select",
                      model_type: "distribution",
                      occuped_columns: 12,
                      nested_paths: [],
                      required: true,
                      options: distributionModelsNames.map((model) => ({
                        value: model,
                        label: model,
                      })),
                      value: queryForm?.distribution_model,
                      informative: {
                        title: "The name of the distribution model.",
                        as_html: true,
                        help_text:
                          'The name of the distribution model.<br/>Use the following format: "project_name:model_name" to import from the project\'s distribution models.<br/>Use the following format: "model_name" to import from the default distribution models.',
                      },
                    } as ModelSelectField,
                  ],
                },
              ],
            },
            ...(distributionModelParametersSubsection
              ? [distributionModelParametersSubsection]
              : []),
          ],
        },
        {
          id: "mobility-configuration",
          title: "Mobility Configuration",
          subsections: [
            {
              id: "mobility-configuration-main",
              title: null,
              model_parameters: true,
              lines: [
                {
                  fields: [
                    {
                      id: "mobility-model",
                      label: "Mobility Model",
                      name: "mobility_model",
                      type: "model_select",
                      model_type: "mobility",
                      occuped_columns: 12,
                      nested_paths: [],
                      required: true,
                      options: mobilityModelsNames.map((model) => ({
                        value: model,
                        label: model,
                      })),
                      value: queryForm?.mobility_model,
                      informative: {
                        title: "The name of the mobility model.",
                        help_text:
                          'The name of the mobility model.<br/>Use the following format: "project_name:model_name" to import from the project\'s mobility models.<br/>Use the following format: "model_name" to import from the default mobility models.',
                        as_html: true,
                      },
                    } as ModelSelectField,
                  ],
                },
              ],
            },
            ...(mobilityModelParametersSubsection
              ? [mobilityModelParametersSubsection]
              : []),
          ],
        },
        {
          id: "connectivity-configuration",
          title: "Connectivity Configuration",
          subsections: [
            {
              id: "connectivity-configuration-main",
              title: null,
              model_parameters: true,
              lines: [
                {
                  fields: [
                    {
                      id: "connectivity-model",
                      label: "Connectivity Model",
                      name: "connectivity_model",
                      type: "model_select",
                      model_type: "connectivity",
                      occuped_columns: 12,
                      nested_paths: [],
                      required: true,
                      options: connectivityModelsNames.map((model) => ({
                        value: model,
                        label: model,
                      })),
                      value: queryForm?.connectivity_model,
                      informative: {
                        title: "The name of the connectivity model.",
                        help_text:
                          'The name of the connectivity model.<br/>Use the following format: "project_name:model_name" to import from the project\'s connectivity models.<br/>Use the following format: "model_name" to import from the default connectivity models.',
                        as_html: true,
                      },
                    } as ModelSelectField,
                  ],
                },
              ],
            },
            ...(connectivityModelParametersSubsection
              ? [connectivityModelParametersSubsection]
              : []),
          ],
        },
        {
          id: "interference-configuration",
          title: "Interference Configuration",
          subsections: [
            {
              id: "interference-configuration-main",
              title: null,
              model_parameters: true,
              lines: [
                {
                  fields: [
                    {
                      id: "interference-model",
                      label: "Interference Model",
                      name: "interference_model",
                      type: "model_select",
                      model_type: "interference",
                      occuped_columns: 12,
                      nested_paths: [],
                      required: true,
                      options: interferenceModelsNames.map((model) => ({
                        value: model,
                        label: model,
                      })),
                      value: queryForm?.interference_model,
                      informative: {
                        title: "The name of the interference model.",
                        help_text:
                          'The name of the interference model.<br/>Use the following format: "project_name:model_name" to import from the project\'s interference models.<br/>Use the following format: "model_name" to import from the default interference models.',
                        as_html: true,
                      },
                    } as ModelSelectField,
                  ],
                },
              ],
            },
            ...(interferenceModelParametersSubsection
              ? [interferenceModelParametersSubsection]
              : []),
          ],
        },
        {
          id: "reliability-configuration",
          title: "Reliability Configuration",
          subsections: [
            {
              id: "reliability-configuration-main",
              title: null,
              model_parameters: true,
              lines: [
                {
                  fields: [
                    {
                      id: "reliability-model",
                      label: "Reliability Model",
                      name: "reliability_model",
                      type: "model_select",
                      model_type: "reliability",
                      occuped_columns: 12,
                      nested_paths: [],
                      required: true,
                      options: reliabilityModelsNames.map((model) => ({
                        value: model,
                        label: model,
                      })),
                      value: queryForm?.reliability_model,
                      informative: {
                        title: "The name of the reliability model.",
                        as_html: true,
                        help_text:
                          'The name of the reliability model.<br/>Use the following format: "project_name:model_name" to import from the project\'s reliability models.<br/>Use the following format: "model_name" to import from the default reliability models.',
                      },
                    } as ModelSelectField,
                  ],
                },
              ],
            },
            ...(reliabilityModelParametersSubsection
              ? [reliabilityModelParametersSubsection]
              : []),
          ],
        },
      ],
    });
  }, [
    nodesNames,
    mobilityModelsNames,
    connectivityModelsNames,
    interferenceModelsNames,
    reliabilityModelsNames,
    distributionModelsNames,
    nodeParametersSubsection,
    mobilityModelParametersSubsection,
    connectivityModelParametersSubsection,
    interferenceModelParametersSubsection,
    reliabilityModelParametersSubsection,
    distributionModelParametersSubsection,
  ]);

  useEffect(() => {
    if (defaultParameters === false) {
      setValue("node_color", null);
      setValue("node_size", null);
    }
  }, [defaultParameters]);

  useEffect(() => {
    if (nodeParametersSubsectionError) {
      console.error(nodeParametersSubsectionError);
      toastError("Error loading node parameters subsection");
    }
  }, [nodeParametersSubsectionError]);

  useEffect(() => {
    if (
      mobilityModelParametersSubsectionError ||
      connectivityModelParametersSubsectionError ||
      interferenceModelParametersSubsectionError ||
      reliabilityModelParametersSubsectionError ||
      distributionModelParametersSubsectionError
    ) {
      console.error(
        mobilityModelParametersSubsectionError ||
          connectivityModelParametersSubsectionError ||
          interferenceModelParametersSubsectionError ||
          reliabilityModelParametersSubsectionError ||
          distributionModelParametersSubsectionError,
      );
      toastError("Error loading models parameters subsection");
    }
  }, [
    mobilityModelParametersSubsectionError,
    connectivityModelParametersSubsectionError,
    interferenceModelParametersSubsectionError,
    reliabilityModelParametersSubsectionError,
    distributionModelParametersSubsectionError,
  ]);

  useEffect(() => {
    if (formErrors && Object.keys(formErrors).length > 0) {
      console.error(formErrors);
      toastError("Error validating form");
    }
  }, [formErrors]);

  useEffect(() => {
    if (nodesNamesError) {
      console.error(nodesNamesError);
      toastError("Error loading nodes names");
    }
  }, [nodesNamesError]);

  useEffect(() => {
    if (
      mobilityModelsNamesError ||
      connectivityModelsNamesError ||
      interferenceModelsNamesError ||
      reliabilityModelsNamesError ||
      distributionModelsNamesError
    ) {
      console.error(
        mobilityModelsNamesError ||
          connectivityModelsNamesError ||
          interferenceModelsNamesError ||
          reliabilityModelsNamesError ||
          distributionModelsNamesError,
      );
      toastError("Error loading models names");
    }
  }, [
    mobilityModelsNamesError,
    connectivityModelsNamesError,
    interferenceModelsNamesError,
    reliabilityModelsNamesError,
    distributionModelsNamesError,
  ]);

  if (
    nodesNamesLoading ||
    nodeParametersSubsectionLoading ||
    mobilityModelsNamesLoading ||
    connectivityModelsNamesLoading ||
    interferenceModelsNamesLoading ||
    reliabilityModelsNamesLoading ||
    distributionModelsNamesLoading ||
    mobilityModelParametersSubsectionLoading ||
    connectivityModelParametersSubsectionLoading ||
    interferenceModelParametersSubsectionLoading ||
    reliabilityModelParametersSubsectionLoading ||
    distributionModelParametersSubsectionLoading
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl">
        Loading form...
      </div>
    );
  }

  if (
    !nodesNames ||
    !mobilityModelsNames ||
    !connectivityModelsNames ||
    !interferenceModelsNames ||
    !reliabilityModelsNames ||
    !distributionModelsNames
  )
    return;

  return (
    <form
      className={clsx("flex", "flex-col", "gap-2", "relative")}
      onSubmit={handleSubmit(onFormSubmit)}
    >
      {formLayout?.sections.map((section, index) => (
        <Section
          control={control}
          register={register}
          section={section}
          key={section.id + index}
        />
      ))}

      <Button
        style={{
          padding: "1rem 2rem",
          marginBottom: "1rem",
          font: "inherit",
          fontFamily: "'Geist Mono', sans-serif",
        }}
        variant="contained"
        size="large"
        type="submit"
      >
        Add Nodes
      </Button>
    </form>
  );
}
