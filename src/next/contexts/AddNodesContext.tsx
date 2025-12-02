"use client";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { _set } from "zod/v4/core";
import { AddNodesFormSchema } from "../components/AddNodesForm";
import { Simulation } from "@/simulator/models/Simulation";

export type AddNodesContextProps = {
  defaultData: AddNodesFormSchema | null;
  addNodes: (simulation: Simulation, data: AddNodesFormSchema) => Promise<void>;
  loading: boolean;
};

const AddNodesContext = createContext<AddNodesContextProps | undefined>(
  undefined,
);

type AddNodesProviderProps = {
  children: React.ReactNode;
};

export const AddNodesProvider = ({ children }: AddNodesProviderProps) => {
  const [defaultData, setDefaultData] = useState<AddNodesFormSchema | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const addNodes = async (simulation: Simulation, data: AddNodesFormSchema) => {
    setDefaultData(data);
    if (data)
      axios.post("/api/add-nodes-context", {
        ...data,
        addedToSimulation: simulation.id.toString(),
      });
    // TODO: really add nodes
  };

  useEffect(() => {
    axios.get("/api/add-nodes-context").then((response) => {
      if (SearchEngine.findProjectByName(response.data.selectedProject))
        setDefaultData({
          numberOfNodes: response.data.numberOfNodes,
          node: response.data.node,
          nodeParameters: response.data.nodeParameters,
          mobilityModel: response.data.mobilityModel,
          mobilityModelParameters: response.data.mobilityModelParameters,
          connectivityModel: response.data.connectivityModel,
          connectivityModelParameters:
            response.data.connectivityModelParameters,
          interferenceModel: response.data.interferenceModel,
          interferenceModelParameters:
            response.data.interferenceModelParameters,
          reliabilityModel: response.data.reliabilityModel,
          reliabilityModelParameters: response.data.reliabilityModelParameters,
          distributionModel: response.data.distributionModel,
          distributionModelParameters:
            response.data.distributionModelParameters,
        });
      setLoading(false);
    });
  }, []);

  return (
    <AddNodesContext.Provider
      value={{
        defaultData,
        addNodes,
        loading,
      }}
    >
      {children}
    </AddNodesContext.Provider>
  );
};

export const useAddNodesContext = (): AddNodesContextProps => {
  const context = useContext(AddNodesContext);
  if (!context) {
    throw new Error(
      "useAddNodesContext must be used within a AddNodesProvider",
    );
  }
  return context;
};
