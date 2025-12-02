import { Section } from "./Section";
import { Subsection } from "./Subsection";
import { Line } from "./Line";
import z from "zod";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import { Simulator } from "@/simulator/Simulator";
import { Global } from "@/simulator/Global";
import { NodeSelectField } from "./fields/NodeSelectField";
import { NodeParametersSubsection } from "./NodeParametersSubsection";

export class NodeSection extends Section {
  public constructor(public readonly id = ++Global.lastId) {
    const subsection = new Subsection([
      new Line([
        NodeSelectField.create({
          name: "node",
          label: "Node",
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
          info: {
            title: "The name of the node implementation to be used",
            helpText: (
              <>
                The name of the node implementation to be used. <br />
                Use the following format: "<b>projectName:nodeName</b>" to use a
                node from a specific project or "<b>default:nodeName</b>" to use
                a default node.
              </>
            ),
          },
        }),
      ]),
    ]);
    super([subsection], undefined, id);
  }

  /**
   * Returns the name of the field that contains the name of the selected node.
   * This field is used to select the node to be used in the simulation.
   */
  public getNodeNameFieldName(): string {
    return "node";
  }

  /**
   * Returns the prefix of the parameters subsection.
   * The prefix is the name of the field that contains the name of the node,
   * concatenated with "Parameters".
   */
  public getNodeParametersPrefix(): string {
    return this.getNodeNameFieldName() + "Parameters";
  }

  /**
   * Returns the parameters subsection for a given node identifier.
   * If the node identifier is not found, it will throw an error.
   * If the node identifier is found, but the node does not have
   * a parameters subsection, it will return undefined.
   * @param nodeIdentifier The node identifier to get the parameters subsection for.
   * @returns The parameters subsection for the given node identifier, or undefined if the node does not have a parameters subsection.
   * @throws Error if the node identifier is not found.
   */
  public getParametersSubsection(
    nodeIdentifier: string,
  ): NodeParametersSubsection | undefined {
    const nodeClass = SearchEngine.findNodeByIdentifier(
      nodeIdentifier as `${string}:${string}`,
    );

    if (!nodeClass) throw new Error(`Node ${nodeIdentifier} not found`);

    const parametersSubsection = nodeClass.getParametersSubsection();

    return (
      parametersSubsection && //@ts-ignore
      new NodeParametersSubsection(
        parametersSubsection.lines,
        parametersSubsection.title,
        parametersSubsection.nestedIn
          ? this.getNodeParametersPrefix() + "." + parametersSubsection.nestedIn
          : this.getNodeParametersPrefix(),
      )
    );
  }

  /**
   * @returns The current parameters subsection for the current node, or undefined if the current node does not have a parameters subsection.
   */
  public getCurrentParametersSubsection():
    | NodeParametersSubsection
    | undefined {
    return this.subsections[1] as NodeParametersSubsection;
  }

  /**
   * Sets the parameters subsection for a given node identifier.
   * If parametersSubsection is given, it will be set as the parameters subsection for the given node identifier.
   * If parametersSubsection is not given, it will try to find the parameters subsection for the given node identifier using getParametersSubsection.
   * If the parameters subsection is found, it will be set as the parameters subsection for the given node identifier.
   * If the parameters subsection is not found, it will delete the parameters subsection for the given node identifier if it exists.
   * @param nodeIdentifier The node identifier to set the parameters subsection for.
   * @param parametersSubsection The parameters subsection to set for the given node identifier.
   * @returns True if the parameters subsection was successfully set, false otherwise.
   */
  public setParametersSubsection(
    nodeIdentifier: string,
    parametersSubsection?: NodeParametersSubsection,
  ): boolean {
    if (parametersSubsection) {
      this.subsections[1] = parametersSubsection;
      return true;
    } else {
      const parametersSubsection = this.getParametersSubsection(nodeIdentifier);

      if (!parametersSubsection) {
        delete this.subsections[1];
        return false;
      }
      this.subsections[1] = parametersSubsection;
      return true;
    }
  }
}
