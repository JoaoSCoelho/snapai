import { Project } from "@/simulator/models/Project";
import { useConfigContext } from "../contexts/ConfigContext";
import { ProjectConfig } from "@/simulator/configurations/Project/ProjectConfig";
import z from "zod";
import { DefaultForm } from "./DefaultForm";

type ProjectConfigFormSchema = z.infer<ProjectConfig["validatorSchema"]>;

type ProjectConfigFormProps = {
  project: Project;
};

export default function ProjectConfigForm({ project }: ProjectConfigFormProps) {
  const { saveProjectConfig } = useConfigContext();

  if (!project.projectConfig)
    throw new Error('This component requires a project with a "projectConfig"');

  const handleFormSubmit = async (data: ProjectConfigFormSchema) => {
    await saveProjectConfig(project, data);
  };

  return (
    <DefaultForm<ProjectConfigFormSchema>
      defaultValues={project.projectConfig.toJSON()}
      id="project-config-form"
      layout={project.projectConfig.layout}
      validatorSchema={project.projectConfig.validatorSchema}
      handleFormSubmit={handleFormSubmit}
      errorSubmitMessage="Error saving project config"
      formErrorMessage="Error validating project config form"
      nextButtonHref="/dashboard/controls"
      onResetMessage="Project config. reseted"
      successSubmitMessage="Project config. saved"
    />
  );
}
