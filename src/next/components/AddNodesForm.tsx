import clsx from "clsx";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { z } from "zod";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import { ModelType } from "@/simulator/utils/modelsUtils";
import { Simulator } from "@/simulator/Simulator";
import { useAddNodesContext } from "../contexts/AddNodesContext";
import { useSimulationContext } from "../contexts/SimulationContext";
import { ErrorSystem } from "../utils/ErrorSystem";
import { Layout } from "@/simulator/configurations/layout/Layout";
import { Section } from "@/simulator/configurations/layout/Section";
import { Subsection } from "@/simulator/configurations/layout/Subsection";
import { Line } from "@/simulator/configurations/layout/Line";
import { NumberField } from "@/simulator/configurations/layout/fields/NumberField";
import { NodeSection } from "@/simulator/configurations/layout/NodeSection";
import { ModelSection } from "@/simulator/configurations/layout/ModelSection";
import SectionComponent from "./Section";

export type AddNodesFormProps = {
  onSubmit?: (data: AddNodesFormSchema) => void;
};

export const addNodesFormSchema = z.object({
  numberOfNodes: z.number(),
  node: z.string().refine(
    (value) => {
      return Simulator.inited
        ? SearchEngine.getPrefixedNodesNames().includes(value)
        : true;
    },
    {
      error: (value) => ({
        message: "Invalid node:" + value.input,
      }),
    },
  ),
  nodeParameters: z.record(z.string(), z.any()),
  mobilityModel: z.string().refine(
    (value) => {
      return Simulator.inited
        ? SearchEngine.getPrefixedModelsNames(ModelType.Mobility).includes(
            value,
          )
        : true;
    },
    {
      error: (value) => ({
        message: "Invalid mobility model:" + value.input,
      }),
    },
  ),
  mobilityModelParameters: z.record(z.string(), z.any()),
  connectivityModel: z.string().refine(
    (value) => {
      return Simulator.inited
        ? SearchEngine.getPrefixedModelsNames(ModelType.Connectivity).includes(
            value,
          )
        : true;
    },
    {
      error: (value) => ({
        message: "Invalid connectivity model:" + value.input,
      }),
    },
  ),
  connectivityModelParameters: z.record(z.string(), z.any()),
  interferenceModel: z.string().refine(
    (value) => {
      return Simulator.inited
        ? SearchEngine.getPrefixedModelsNames(ModelType.Interference).includes(
            value,
          )
        : true;
    },
    {
      error: (value) => ({
        message: "Invalid interference model:" + value.input,
      }),
    },
  ),
  interferenceModelParameters: z.record(z.string(), z.any()),
  reliabilityModel: z.string().refine(
    (value) => {
      return Simulator.inited
        ? SearchEngine.getPrefixedModelsNames(ModelType.Reliability).includes(
            value,
          )
        : true;
    },
    {
      error: (value) => ({
        message: "Invalid reliability model:" + value.input,
      }),
    },
  ),
  reliabilityModelParameters: z.record(z.string(), z.any()),
  distributionModel: z.string().refine(
    (value) => {
      console.log(Simulator.inited);
      return Simulator.inited
        ? SearchEngine.getPrefixedModelsNames(ModelType.Distribution).includes(
            value,
          )
        : true;
    },
    {
      error: (value) => ({
        message: "Invalid distribution model:" + value.input,
      }),
    },
  ),
  distributionModelParameters: z.record(z.string(), z.any()),
});

export const addNodesFormLayout = new Layout([
  Section.create({
    title: "Add Nodes",
    subsections: [
      new Subsection([
        new Line([
          NumberField.create({
            name: "numberOfNodes",
            label: "Number of nodes",
            required: true,
            isFloat: false,
            occupedColumns: 12,
            schema: z.number().min(1),
            min: 1,
            info: { title: "Number of nodes to add in the simulation" },
          }),
        ]),
      ]),
    ],
  }),
  new NodeSection(),
  new ModelSection(ModelType.Mobility),
  new ModelSection(ModelType.Connectivity),
  new ModelSection(ModelType.Interference),
  new ModelSection(ModelType.Reliability),
  new ModelSection(ModelType.Distribution),
]);

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
  const mobilityModelsNames = SearchEngine.getPrefixedModelsNames(
    ModelType.Mobility,
  );
  const connectivityModelsNames = SearchEngine.getPrefixedModelsNames(
    ModelType.Connectivity,
  );
  const interferenceModelsNames = SearchEngine.getPrefixedModelsNames(
    ModelType.Interference,
  );
  const reliabilityModelsNames = SearchEngine.getPrefixedModelsNames(
    ModelType.Reliability,
  );
  const distributionModelsNames = SearchEngine.getPrefixedModelsNames(
    ModelType.Distribution,
  );

  const { defaultData, loading, addNodes } = useAddNodesContext();

  const { simulation } = useSimulationContext();

  if (!simulation) return;

  const [validatorSchema, setValidatorSchema] = useState(addNodesFormSchema);

  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    getValues,
    formState: { errors: formErrors },
  } = useForm<AddNodesFormSchema>({
    resolver: zodResolver(validatorSchema),
  });

  const [formLayout, setFormLayout] = useState<Layout>(addNodesFormLayout);

  const onFormSubmit = (data: AddNodesFormSchema) => {
    console.log(data);
    addNodes(simulation, data)
      .then(() => {
        toast.success("Nodes added");
      })
      .catch((e) => {
        ErrorSystem.emitError(e, "Error adding nodes");
      });
    onSubmit?.(data);
  };

  useEffect(() => {
    if (!formLayout) return;
    setValidatorSchema(
      FormLayoutHelper.buildSchema<z.ZodObject<AddNodesFormSchema>>([
        formLayout,
      ]),
    );
  }, [formLayout]);

  useEffect(() => {
    if (formErrors && Object.keys(formErrors).length > 0) {
      ErrorSystem.emitError(formErrors, "Error validating form");
    }
  }, [formErrors]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl">
        Loading form...
      </div>
    );
  }

  const onModelNameChange = (name: string, fullName: string, value: string) => {
    console.log(name, fullName, value);
    // TODO: complete it
  };

  const onNodeNameChange = (name: string, fullName: string, value: string) => {
    console.log(name, fullName, value);
    // TODO: complete it
  };

  return (
    <form
      className={clsx("flex", "flex-col", "gap-2", "relative")}
      onSubmit={handleSubmit(onFormSubmit)}
    >
      {formLayout?.sections.map((section, index) => (
        <SectionComponent
          control={control}
          register={register}
          section={section}
          onModelNameChange={onModelNameChange}
          onNodeNameChange={onNodeNameChange}
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
