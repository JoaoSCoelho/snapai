import { ProjectConfig } from "@/simulator/configurations/Project/ProjectConfig";

import z from "zod";
import { testProjectConfigLayout } from "./testProjectConfigLayout";
import {
  TestProjectConfigSchema,
  testProjectConfigSchema,
} from "./testProjectConfigSchema";

export class TestProjectConfig extends ProjectConfig {
  public constructor(
    public readonly configJsonFilePath: string,
    public readonly data: z.infer<typeof testProjectConfigSchema>,
  ) {
    super(
      configJsonFilePath,
      data,
      testProjectConfigLayout,
      testProjectConfigSchema,
    );
  }

  protected innerToJSON(): TestProjectConfigSchema {
    return {
      mobilityModel: this.data.mobilityModel,
      mobilityModelParameters: this.data.mobilityModelParameters,
      messageTransmissionModel: this.data.messageTransmissionModel,
      messageTransmissionModelParameters:
        this.data.messageTransmissionModelParameters,
    };
  }
}
