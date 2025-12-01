"use client";
import React, { createContext, useState, useContext } from "react";

export type GraphVisualizationContentProps = {
  shouldShowArrows: boolean;
  setShouldShowArrows: (shouldShowArrows: boolean) => void;
  shouldShowIds: boolean;
  setShouldShowIds: (shouldShowIds: boolean) => void;
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

  return (
    <GraphVisualizationContext.Provider
      value={{
        shouldShowArrows,
        setShouldShowArrows,
        shouldShowIds,
        setShouldShowIds,
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
