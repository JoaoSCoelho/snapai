import { SimulationConfig } from "@/simulator/configurations/Simulation/SimulationConfig";
import { Project } from "@/simulator/models/Project";
import simulationJsonConfig from "./config/simulationConfig.json";
import { SimulationConfigSchema } from "@/simulator/configurations/Simulation/simulationConfigSchema";
import { TestProjectConfigSchema } from "./config/testProjectConfigSchema";
import testProjectJsonConfig from "./config/testProjectConfig.json";
import { TestProjectConfig } from "./config/TestProjectConfig";

export class TestProject extends Project {
  protected constructor() {
    super(
      "TestProject",
      new SimulationConfig(
        "./src/simulator/projects/TestProject/config/simulationConfig.json",
        simulationJsonConfig as unknown as SimulationConfigSchema,
      ),
      new TestProjectConfig(
        "./src/simulator/projects/TestProject/config/testProjectConfig.json",
        testProjectJsonConfig as unknown as TestProjectConfigSchema,
      ),
    );
  }

  public static create(): TestProject {
    return new TestProject();
  }
}
