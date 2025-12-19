import { ParametersSubsection } from "../configurations/layout/ParametersSubsection";
import { ParameterizedModule } from "../modules/ParameterizedModule";
import { ModelType } from "../utils/modelsUtils";
import { Simulation } from "./Simulation";

export type ConcreteModel<
  T extends Model,
  S extends Simulation | undefined = Simulation,
> = new (parameters: Record<string, any>, simulation: S) => T;

export abstract class Model extends ParameterizedModule {
  public static readonly type: ModelType;

  /** Should be set before use class */
  protected simulation!: Simulation;
  public abstract name: string;

  public constructor(
    public readonly parameters: Record<string, any>,
    simulation?: Simulation,
  ) {
    super();

    if (simulation) this.simulation = simulation;
  }

  /**
   * Sets the simulation of the model.
   *
   * @throws {Error} If the simulation is already set.
   */
  public setSimulation(simulation: Simulation): void {
    if (this.simulation) throw new Error("Simulation already set");
    this.simulation = simulation;
  }

  /**
   * **Child classes should implements this static method to get the parameters subsection layout.**
   *
   * Returns the ModelParametersSubsection of the model, if it exists.
   * This subsection contains the parameters of the model, which are
   * used to configure the model.
   * @returns The ModelParametersSubsection of the model, if it exists. Otherwise, undefined.
   */
  public static getParametersSubsection(): ParametersSubsection | undefined {
    return undefined;
  }
}
