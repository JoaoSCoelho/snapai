"use client";
import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { AddNodesFormSchema } from "../components/AddNodesForm";
import { Simulation } from "@/simulator/models/Simulation";
import { UseFormReturn } from "react-hook-form";
import { NodesFormContext } from "@prisma/client";
import { useGraphVisualizationContext } from "./GraphVisualizationContext";

export type AddNodesContextProps = {
  defaultData: AddNodesFormSchema | null;
  addNodes: (simulation: Simulation, data: AddNodesFormSchema) => Promise<void>;
  loading: boolean;
  dialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  form: UseFormReturn<AddNodesFormSchema> | null;
  setForm: (form: UseFormReturn<AddNodesFormSchema> | null) => void;
  savePartialData: () => void;
};

const AddNodesContext = createContext<AddNodesContextProps | undefined>(
  undefined,
);

type AddNodesProviderProps = {
  children: React.ReactNode;
};

export const AddNodesProvider = ({ children }: AddNodesProviderProps) => {
  // Contexts
  const { interfaceUpdater } = useGraphVisualizationContext();

  // States
  const [defaultData, setDefaultData] = useState<AddNodesFormSchema | null>(
    null,
  );
  const [form, setForm] = useState<UseFormReturn<AddNodesFormSchema> | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Effects
  useEffect(() => {
    axios
      .get<NodesFormContext | null>("/api/add-nodes-context")
      .then((response) => {
        if (!response.data) return;

        setDefaultData({
          numberOfNodes: response.data.numberOfNodes,
          color: response.data.color,
          size: response.data.size,
          connectivityEnabled: response.data.connectivityEnabled,
          forceHighlight: response.data.forceHighlight,
          forceLabel: response.data.forceLabel,
          mobilityEnabled: response.data.mobilityEnabled,
          label: response.data.label,
          borderColor: response.data.borderColor ?? undefined,
          borderSize: response.data.borderSize ?? undefined,
          draggable: response.data.draggable,
          node: response.data.node,
          nodeParameters: (response.data.nodeParameters ?? {}) as Record<
            string,
            any
          >,
          usedPacket: response.data.usedPacket,
          usedPacketParameters: (response.data.usedPacketParameters ??
            {}) as Record<string, any>,
          mobilityModel: response.data.mobilityModel,
          mobilityModelParameters: (response.data.mobilityModelParameters ??
            {}) as Record<string, any>,
          connectivityModel: response.data.connectivityModel,
          connectivityModelParameters: (response.data
            .connectivityModelParameters ?? {}) as Record<string, any>,
          interferenceModel: response.data.interferenceModel,
          interferenceModelParameters: (response.data
            .interferenceModelParameters ?? {}) as Record<string, any>,
          reliabilityModel: response.data.reliabilityModel,
          reliabilityModelParameters: (response.data
            .reliabilityModelParameters ?? {}) as Record<string, any>,
          distributionModel: response.data.distributionModel,
          distributionModelParameters: (response.data
            .distributionModelParameters ?? {}) as Record<string, any>,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Functions
  const addNodes = async (simulation: Simulation, data: AddNodesFormSchema) => {
    setDefaultData(data);
    simulation.addBatchOfNodes(data);
    interfaceUpdater(simulation);
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    savePartialData();
  };

  async function savePartialData() {
    if (!form) return;

    const values = form.getValues();

    setDefaultData(values);

    // Safe partial data on database
    await axios.post<any, any, Partial<NodesFormContext>>(
      "/api/add-nodes-context",
      values,
    );
  }

  return (
    <AddNodesContext.Provider
      value={{
        defaultData,
        dialogOpen,
        openDialog,
        closeDialog,
        addNodes,
        loading,
        form,
        setForm,
        savePartialData,
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
