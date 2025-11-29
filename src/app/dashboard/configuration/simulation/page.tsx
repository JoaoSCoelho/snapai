"use client";
import { useConfigContext } from "@/next/contexts/ConfigContext";
import ProjectSelect from "@/next/components/ProjectSelect";
import { simulator } from "@/simulator";
import SimulationConfigForm from "@/next/components/SimulationConfigForm";
import { SearchEngine } from "@/simulator/utils/SearchEngine";

export default function DashboardSimulationConfiguration() {
  const projectsNames = simulator.projects.keys().toArray();
  const { selectedProject, loading } = useConfigContext();

  return (
    <div className="w-full">
      <div style={{ height: "40dvh" }} className="y-spacer"></div>
      <main className="mx-auto max-w-5xl flex flex-col items-center justify-center px-4 ">
        {loading ? (
          <h1>Loading last configuration...</h1>
        ) : (
          <>
            <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">
              {selectedProject ? (
                <>
                  Configuring simulation for project{" "}
                  <span className="text-blue-600">{selectedProject}</span>
                </>
              ) : (
                <>
                  Initialize with <span className="text-blue-600">SnapAI</span>{" "}
                  by selecting a project
                </>
              )}
            </h1>
            <div className="full-form-container grid-cols-12 grid gap-4 w-full">
              <ProjectSelect projectsNames={projectsNames} />
              <div className="form-container col-start-1 col-end-13">
                {selectedProject && (
                  <SimulationConfigForm
                    key={selectedProject}
                    project={SearchEngine.getProjectByName(selectedProject)}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
