import { Layout } from "@/simulator/configurations/layout/Layout";
import { ModelSection } from "@/simulator/configurations/layout/ModelSection";

export const testProjectConfigLayout = new Layout([
  new ModelSection("mobility"),
  new ModelSection("message_transmission"),
]);
