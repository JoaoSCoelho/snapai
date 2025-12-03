"use client";
import { ProjectConfig } from "@/simulator/configurations/Project/ProjectConfig";
import { SimulationConfigSchema } from "@/simulator/configurations/Simulation/simulationConfigSchema";
import { Project } from "@/simulator/models/Project";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import { ConfigContext as PrismaConfigContext } from "@prisma/client";
import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import z from "zod";
import { _set } from "zod/v4/core";

type ProjectConfigSchema = z.infer<ProjectConfig["validatorSchema"]>;

export type ConfigContextProps = {
  selectedProject: string | null;
  setSelectedProject: (value: string | null) => void;
  saveSimulationConfig: (
    project: Project,
    data: SimulationConfigSchema,
  ) => Promise<void>;
  saveProjectConfig: (
    project: Project,
    data: ProjectConfigSchema,
  ) => Promise<void>;
  loading: boolean;
};

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

type ConfigProviderProps = {
  children: React.ReactNode;
};

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [selectedProject, _setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<PrismaConfigContext | null>("/api/config-context")
      .then((response) => {
        if (
          !response.data ||
          !SearchEngine.findProjectByName(response.data.selectedProject)
        )
          return;

        _setSelectedProject(response.data.selectedProject);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSimulationConfig = async (
    project: Project,
    data: SimulationConfigSchema,
  ) => {
    project.simulationConfig.setData(data);
    await axios.post("/api/write-json", {
      path: project.simulationConfig.configJsonFilePath,
      data: data,
    });
  };

  const saveProjectConfig = async (
    project: Project,
    data: ProjectConfigSchema,
  ) => {
    if (project.projectConfig) {
      project.projectConfig.setData(data);
      await axios.post("/api/write-json", {
        path: project.projectConfig.configJsonFilePath,
        data: data,
      });
    }
  };

  const setSelectedProject = (value: string | null) => {
    _setSelectedProject(value);
    if (value) axios.post("/api/config-context", { selectedProject: value });
  };

  return (
    <ConfigContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        saveSimulationConfig,
        saveProjectConfig,
        loading,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = (): ConfigContextProps => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfigContext must be used within a ConfigProvider");
  }
  return context;
};
