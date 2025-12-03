import { z } from "zod";
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
import { DefaultForm } from "./DefaultForm";
import { UseFormReturn } from "react-hook-form";

export type AddNodesFormProps = {
  onSubmit?: (data: AddNodesFormSchema) => void;
};

// TODO: add option to select the used Packet;
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

export type AddNodesFormSchema = z.infer<typeof addNodesFormSchema>;

export default function AddNodesForm({ onSubmit }: AddNodesFormProps) {
  // Contexts
  const { defaultData, loading, addNodes, savePartialData, setForm } =
    useAddNodesContext();
  const { simulation } = useSimulationContext();

  // Ifs
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl">
        Loading form...
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl">
        Simulation not initialized
      </div>
    );
  }

  // Functions
  const onFormSubmit = async (data: AddNodesFormSchema) => {
    console.log(data);
    await addNodes(simulation, data)
      .then(() => {
        toast.success("Nodes added");
      })
      .catch((e) => {
        ErrorSystem.emitError(e, "Error adding nodes");
      });
    onSubmit?.(data);
  };

  const onLoad = (form: UseFormReturn<AddNodesFormSchema>) => {
    setForm(form);
  };

  const onSubmitButtonClick = () => {
    savePartialData();
  };

  return (
    <DefaultForm<AddNodesFormSchema>
      id="add-nodes-form"
      layout={addNodesFormLayout}
      validatorSchema={addNodesFormSchema}
      defaultValues={defaultData ?? ({} as AddNodesFormSchema)}
      handleFormSubmit={onFormSubmit}
      onSubmitButtonClick={onSubmitButtonClick}
      onLoad={onLoad}
      errorSubmitMessage="Error when adding nodes"
      formErrorMessage="Error validating add nodes form"
      onResetMessage="Add nodes form reseted"
      successSubmitMessage="Nodes successfully added"
    />
  );
}
