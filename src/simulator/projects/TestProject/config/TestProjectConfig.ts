import { ProjectConfig } from "@/simulator/configurations/Project/ProjectConfig";
import { testProjectConfigLayout } from "./testProjectConfigLayout";
import {
  TestProjectConfigSchema,
  testProjectConfigSchema,
} from "./testProjectConfigSchema";

export const testProjectDefaultConfig: TestProjectConfigSchema = {
  mobilityModel: "",
  mobilityModelParameters: {},
  messageTransmissionModel: "",
  messageTransmissionModelParameters: {},
};

export class TestProjectConfig extends ProjectConfig<
  typeof testProjectConfigSchema,
  TestProjectConfigSchema
> {
  public constructor(
    configJsonFilePath: string,
    data: TestProjectConfigSchema,
  ) {
    super(
      configJsonFilePath,
      data,
      testProjectConfigLayout,
      testProjectConfigSchema,
      testProjectDefaultConfig,
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
