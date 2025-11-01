"use client";
import { useConfigContext } from "@/next/contexts/ConfigContext";

import useSWR from "swr";
import { useEffect } from "react";
import { Api } from "@/api/Api";
import ProjectSelect from "@/next/components/ProjectSelect";
import { ErrorSystem } from "@/next/utils/ErrorSystem";

export default function DashboardConfiguration() {
  const {
    data: projectsNames,
    error: projectsNamesError,
    isLoading: isLoadingProjectsNames,
  } = useSWR("projects_names", Api.getProjectsNames);
  const { selectedProject } = useConfigContext();

  let title = selectedProject ? (
    <>
      Configuring project{" "}
      <span className="text-blue-600">{selectedProject}</span>
    </>
  ) : (
    <>
      Initialize with <span className="text-blue-600">SnapAI</span> by selecting
      a project
    </>
  );

  if (projectsNamesError) {
    title = <span className="text-red-600">Error loading projects!</span>;
  }

  useEffect(() => {
    if (projectsNamesError)
      ErrorSystem.emitError(projectsNamesError, "Error loading projects");
  }, [projectsNamesError]);

  return (
    <div className="w-full">
      <div style={{ height: "40dvh" }} className="y-spacer"></div>
      <main className="mx-auto max-w-5xl flex flex-col items-center justify-center px-4 ">
        <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">
          {title}
        </h1>
        <div className="full-form-container grid-cols-12 grid gap-4 w-full">
          <ProjectSelect
            projectsNames={projectsNames}
            isLoadingProjectsNames={isLoadingProjectsNames}
          />
          <div className="form-container col-start-1 col-end-13">
            {/*selectedProject && <ConfigForm project_name={selectedProject} />*/}
          </div>
        </div>
      </main>
    </div>
  );
}
