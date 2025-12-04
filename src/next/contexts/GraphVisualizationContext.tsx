"use client";
import React, { createContext, useState, useContext } from "react";

export type SimulationInfo = {
  time: number | null;
  nodes: number;
  edges: number;
  remainingEvents: number | null;
  numberOfMessagesOverAll: number;
  numberOfMessagesInThisRound: number | null;
};

export type GraphVisualizationContentProps = {
  shouldShowArrows: boolean;
  setShouldShowArrows: (shouldShowArrows: boolean) => void;
  shouldShowIds: boolean;
  setShouldShowIds: (shouldShowIds: boolean) => void;
  simulationInfo: SimulationInfo;
  setSimulationInfo: (simulationInfo: SimulationInfo) => void;
};

const GraphVisualizationContext = createContext<
  GraphVisualizationContentProps | undefined
>(undefined);

type GraphVisualizationProviderProps = {
  children: React.ReactNode;
};

export const GraphVisualizationProvider = ({
  children,
}: GraphVisualizationProviderProps) => {
  const [shouldShowArrows, setShouldShowArrows] = useState<boolean>(false);
  const [shouldShowIds, setShouldShowIds] = useState<boolean>(false);
  const [simulationInfo, setSimulationInfo] = useState<SimulationInfo>({
    nodes: 0,
    edges: 0,
    remainingEvents: null,
    time: null,
    numberOfMessagesInThisRound: null,
    numberOfMessagesOverAll: 0,
  });

  return (
    <GraphVisualizationContext.Provider
      value={{
        shouldShowArrows,
        setShouldShowArrows,
        shouldShowIds,
        setShouldShowIds,
        simulationInfo,
        setSimulationInfo,
      }}
    >
      {children}
    </GraphVisualizationContext.Provider>
  );
};

export const useGraphVisualizationContext =
  (): GraphVisualizationContentProps => {
    const context = useContext(GraphVisualizationContext);
    if (!context) {
      throw new Error(
        "useGraphVisualizationContext must be used within a GraphVisualizationProvider",
      );
    }
    return context;
  };
