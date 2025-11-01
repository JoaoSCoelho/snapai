"use client";
import React, { createContext, useState, useContext } from "react";

export type ConfigContextProps = {
  selectedProject: string | null;
  setSelectedProject: React.Dispatch<React.SetStateAction<string | null>>;
  dimensions: { x: [number, number]; y: [number, number] };
  setDimensions: React.Dispatch<
    React.SetStateAction<{ x: [number, number]; y: [number, number] }>
  >;
};

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

type ConfigProviderProps = {
  children: React.ReactNode;
};

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{
    x: [number, number];
    y: [number, number];
  }>({ x: [0, 0], y: [0, 0] });

  return (
    <ConfigContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        dimensions,
        setDimensions,
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
