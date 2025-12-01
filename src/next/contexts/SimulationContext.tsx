"use client";
import { Simulation } from "@/simulator/models/Simulation";
import React, { createContext, useState, useContext } from "react";

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
  const [simulation, setSimulation] = useState<Simulation | null>(null);

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
