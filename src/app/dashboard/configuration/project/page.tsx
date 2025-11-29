"use client";
import ProjectConfigForm from "@/next/components/ProjectConfigForm";
import { useConfigContext } from "@/next/contexts/ConfigContext";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import Link from "next/link";

export default function DashboardProjectConfiguration() {
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
                SearchEngine.getProjectByName(selectedProject) &&
                !SearchEngine.getProjectByName(selectedProject)
                  .projectConfig ? (
                  <>
                    The project{" "}
                    <span className="text-blue-600">{selectedProject}</span>{" "}
                    don't have specific configuration.
                    <br />
                    <br />
                    <span className="text-4xl">
                      You can go to the
                      <Link href="/dashboard/controls">
                        {" "}
                        <span className="text-blue-600 underline hover:no-underline">
                          Controls
                        </span>
                      </Link>
                    </span>
                  </>
                ) : (
                  <>
                    Configuring project{" "}
                    <span className="text-blue-600">{selectedProject}</span>
                  </>
                )
              ) : (
                <>
                  Go back to{" "}
                  <Link href="/dashboard/configuration/simulation">
                    <span className="text-blue-600 underline hover:no-underline">
                      Simulation Configuration
                    </span>
                  </Link>{" "}
                  and select a project first!
                </>
              )}
            </h1>
            <div className="full-form-container grid-cols-12 grid gap-4 w-full">
              <div className="form-container col-start-1 col-end-13">
                {selectedProject &&
                  SearchEngine.getProjectByName(selectedProject) &&
                  SearchEngine.getProjectByName(selectedProject)
                    .projectConfig && (
                    <ProjectConfigForm
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
