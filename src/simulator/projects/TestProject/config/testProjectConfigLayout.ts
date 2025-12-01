import { Layout } from "@/simulator/configurations/layout/Layout";
import { ModelSection } from "@/simulator/configurations/layout/ModelSection";
import { ModelType } from "@/simulator/utils/modelsUtils";

export const testProjectConfigLayout = new Layout([
  new ModelSection(ModelType.Mobility),
  new ModelSection(ModelType.MessageTransmission),
]);
