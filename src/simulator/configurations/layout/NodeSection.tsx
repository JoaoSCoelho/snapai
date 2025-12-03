import z from "zod";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import { Simulator } from "@/simulator/Simulator";
import { Global } from "@/simulator/Global";
import { NodeSelectField } from "./fields/NodeSelectField";
import { ParameterizedSection } from "./ParameterizedSection";
import { ClassableParametersSubsectionController } from "@/simulator/modules/ClassableParametersSubsectionController";
import { ParameterizedModule } from "@/simulator/modules/ParameterizedModule";
import { FieldPartialInfoSchema } from "./fields/Field";

export type NodeSectionSelectOptions = {
  name?: string;
  label?: string;
  info?: FieldPartialInfoSchema;
};

export class NodeSection extends ParameterizedSection {
  public constructor(
    public readonly disabled: boolean = false,
    selectOptions: NodeSectionSelectOptions = {},
    public readonly id = ++Global.lastId,
  ) {
    const select = NodeSelectField.create({
      name: selectOptions.name ?? "node",
      label: selectOptions.label ?? "Node",
      occupedColumns: 12,
      required: true,
      schema: z.string().refine(
        (value) => {
          return Simulator.inited
            ? SearchEngine.getPrefixedNodesNames().includes(value)
            : true;
        },
        {
          error: "Should be a pre-created node",
        },
      ),
      info: selectOptions.info ?? {
        title: "The name of the node implementation to be used",
        helpText: (
          <>
            The name of the node implementation to be used. <br />
            Use the following format: "<b>projectName:nodeName</b>" to use a
            node from a specific project or "<b>default:nodeName</b>" to use a
            default node.
          </>
        ),
      },
    });
    super(
      select,
      new ClassableParametersSubsectionController(
        () =>
          SearchEngine.getPrefixedMapOfNodes() as unknown as Map<
            string,
            typeof ParameterizedModule
          >,
      ),
      disabled,
      id,
    );
  }
}
