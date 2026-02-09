import { z } from "zod";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import { ModelType } from "@/simulator/utils/modelsUtils";
import { Simulator } from "@/simulator/Simulator";
import { useAddNodesContext } from "../contexts/AddNodesContext";
import { useSimulationContext } from "../contexts/SimulationContext";
import { Layout } from "@/simulator/configurations/layout/Layout";
import { Section } from "@/simulator/configurations/layout/Section";
import { Subsection } from "@/simulator/configurations/layout/Subsection";
import { Line } from "@/simulator/configurations/layout/Line";
import { NumberField } from "@/simulator/configurations/layout/fields/NumberField";
import { NodeSection } from "@/simulator/configurations/layout/NodeSection";
import { ModelSection } from "@/simulator/configurations/layout/ModelSection";
import { DefaultForm } from "./DefaultForm";
import { UseFormReturn } from "react-hook-form";
import { ParameterizedSection } from "@/simulator/configurations/layout/ParameterizedSection";
import { ClassableParametersSubsectionController } from "@/simulator/modules/ClassableParametersSubsectionController";
import { ParameterizedModule } from "@/simulator/modules/ParameterizedModule";
import { ColorField } from "@/simulator/configurations/layout/fields/ColorField";
import { CheckboxField } from "@/simulator/configurations/layout/fields/CheckboxField";
import { TextField } from "@/simulator/configurations/layout/fields/TextField";

export type AddNodesFormProps = {
  onSubmit?: (data: AddNodesFormSchema) => void;
};

export const addNodesFormSchema = z.object({
  numberOfNodes: z.number(),
  color: z.string().startsWith("#").length(7),
  size: z.number().min(0),
  draggable: z.boolean(),
  mobilityEnabled: z.boolean(),
  connectivityEnabled: z.boolean(),
  forceLabel: z.boolean(),
  forceHighlight: z.boolean(),
  label: z.string().optional(),
  borderColor: z.string().startsWith("#").length(7).optional(),
  borderSize: z.number().min(0).optional(),
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
  usedPacket: z.string().refine((value) => {
    return Simulator.inited
      ? SearchEngine.getPrefixedPacketsNames().includes(value)
      : true;
  }),
  usedPacketParameters: z.record(z.string(), z.any()),
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
            occupedColumns: 3,
            schema: z.number().min(1),
            min: 1,
            info: { title: "Number of nodes to add in the simulation" },
          }),
          ColorField.create({
            name: "color",
            label: "Color",
            required: true,
            occupedColumns: 3,
            schema: z.string().length(7).startsWith("#"),
            info: { title: "Color of the nodes in the simulation" },
          }),
          NumberField.create({
            name: "size",
            label: "Size",
            required: true,
            isFloat: false,
            min: 0,
            occupedColumns: 3,
            schema: z.number().min(0),
            info: { title: "Size of the nodes in the simulation" },
          }),
          CheckboxField.create({
            name: "draggable",
            label: "Draggable",
            schema: z.boolean(),
            info: {
              title:
                "If enabled, you can click and drag the nodes with the mouse",
            },
            occupedColumns: 3,
          }),
        ]),
        new Line([
          CheckboxField.create({
            name: "mobilityEnabled",
            label: "Mobility",
            schema: z.boolean(),
            info: {
              title:
                "If enabled, the nodes can move in the simulation, otherwise they will be static in the initial position.",
            },
            occupedColumns: 3,
          }),
          CheckboxField.create({
            name: "connectivityEnabled",
            label: "Connectivity",
            schema: z.boolean(),
            info: {
              title:
                "If enabled, the nodes can connect with other nodes. OBS: Other nodes can also connect with this nodes anyway.",
            },
            occupedColumns: 3,
          }),
          CheckboxField.create({
            name: "forceLabel",
            label: "Force label",
            schema: z.boolean(),
            info: {
              title:
                "If enabled, the label of the nodes will be forced to be visible.",
            },
            occupedColumns: 3,
          }),
          CheckboxField.create({
            name: "forceHighlight",
            label: "Force highlight",
            schema: z.boolean(),
            info: {
              title:
                "If enabled, the nodes will be highlighted in the simulation.",
            },
            occupedColumns: 3,
          }),
        ]),
        new Line([
          TextField.create({
            name: "label",
            label: "Label",
            required: false,
            schema: z.string().optional(),
            info: {
              title:
                "Label of the nodes in the simulation. If empty, the ID will be used",
            },
            occupedColumns: 6,
          }),
          ColorField.create({
            name: "borderColor",
            label: "Border Color",
            occupedColumns: 3,
            required: false,
            schema: z.string().length(7).startsWith("#").optional(),
            info: {
              title: "Color of the border of the nodes in the simulation",
            },
          }),
          NumberField.create({
            name: "borderSize",
            label: "Border Size",
            required: false,
            isFloat: true,
            occupedColumns: 3,
            min: 0,
            schema: z.number().min(0).optional(),
            info: {
              title: "Size of the border of the nodes in the simulation",
            },
          }),
        ]),
      ]),
    ],
  }),
  new NodeSection(),
  new ParameterizedSection(
    {
      name: "usedPacket",
      label: "Used Packet",
      acceptedValues: SearchEngine.getPrefixedPacketsNames(),
      info: { title: "Packet to be used by the nodes" },
      options: () =>
        SearchEngine.getPrefixedPacketsNames().map((name) => ({
          value: name,
          label: name,
        })),
    },
    new ClassableParametersSubsectionController(
      () =>
        SearchEngine.getPrefixedMapOfPackets() as unknown as Map<
          string,
          typeof ParameterizedModule
        >,
    ),
  ),
  new ModelSection(ModelType.Mobility),
  new ModelSection(ModelType.Connectivity),
  new ModelSection(ModelType.Interference),
  new ModelSection(ModelType.Reliability),
  new ModelSection(ModelType.Distribution),
]);

export type AddNodesFormSchema = z.infer<typeof addNodesFormSchema>;

export default function AddNodesForm({ onSubmit }: AddNodesFormProps) {
  // Contexts
  const { defaultData, loading, addNodes, setForm } = useAddNodesContext();
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
  async function onFormSubmit(data: AddNodesFormSchema) {
    if (!simulation) return;
    await addNodes(simulation, data);
    onSubmit?.(data);
  }

  function onLoad(form: UseFormReturn<AddNodesFormSchema>) {
    setForm(form);
  }

  return (
    <DefaultForm<AddNodesFormSchema>
      id="add-nodes-form"
      buttonBarSpacer={false}
      layout={addNodesFormLayout}
      validatorSchema={addNodesFormSchema}
      defaultValues={defaultData ?? ({} as AddNodesFormSchema)}
      handleFormSubmit={onFormSubmit}
      onLoad={onLoad}
      errorSubmitMessage="Error when adding nodes"
      formErrorMessage="Error validating add nodes form"
      onResetMessage="Add nodes form reseted"
      successSubmitMessage="Nodes successfully added"
    />
  );
}
