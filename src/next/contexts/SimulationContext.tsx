"use client";
import { Simulation } from "@/simulator/models/Simulation";
import React, { createContext, useState, useContext } from "react";
import { useGraphVisualizationContext } from "./GraphVisualizationContext";

export type SimulationContextProps = {
  simulation: Simulation | null;
  setSimulation: (value: Simulation | null) => void;
};

const SimulationContext = createContext<SimulationContextProps | undefined>(
  undefined,
);

type SimulationProviderProps = {
  children: React.ReactNode;
};

export const SimulationProvider = ({ children }: SimulationProviderProps) => {
  // Contexts
  const { interfaceUpdater } = useGraphVisualizationContext();

  const [simulation, _setSimulation] = useState<Simulation | null>(null);

  const setSimulation = (simulation: Simulation | null) => {
    _setSimulation(simulation);
    if (simulation) {
      interfaceUpdater(simulation);
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        simulation,
        setSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulationContext = (): SimulationContextProps => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error(
      "useSimulationContext must be used within a SimulationProvider",
    );
  }
  return context;
};
