import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";

import { Project } from "@/simulator/models/Project";
import { SimulationConfigSchema } from "@/simulator/configurations/Simulation/simulationConfigSchema";

import { useConfigContext } from "../contexts/ConfigContext";
import { ModelSection } from "@/simulator/configurations/layout/ModelSection";
import { Layout } from "@/simulator/configurations/layout/Layout";

import { DefaultForm } from "./DefaultForm";

type SimulationConfigFormSchema = SimulationConfigSchema;

type SimulationConfigFormProps = {
  project: Project;
};

export default function SimulationConfigForm({
  project,
}: SimulationConfigFormProps) {
  // Contexts
  const { saveSimulationConfig } = useConfigContext();

  // States

  // Refs

  // Hooks externos

  // Memos / Callbacks

  // Effects

  // Ifs

  // Functions

  const handleFormSubmit = async (data: SimulationConfigFormSchema) => {
    await saveSimulationConfig(project, data);
  };

  return (
    <DefaultForm<SimulationConfigFormSchema>
      defaultValues={
        project.simulationConfig.toJSON() as SimulationConfigFormSchema
      }
      id="config-form"
      layout={project.simulationConfig.layout}
      validatorSchema={project.simulationConfig.validatorSchema}
      handleFormSubmit={handleFormSubmit}
      errorSubmitMessage="Error saving simulation config"
      formErrorMessage="Error validating config form"
      nextButtonHref="/dashboard/configuration/project"
      onResetMessage="Simulation config. reseted"
      successSubmitMessage="Simulation config. saved"
    />
  );
}
