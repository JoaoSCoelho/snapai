"use client";
import { AsynchronousSimulation } from "@/simulator/models/AsynchronousSimulation";
import { Simulation } from "@/simulator/models/Simulation";
import { SynchronousSimulation } from "@/simulator/models/SynchronousSimulation";
import { EdgeAttributes, NodeAttributes } from "@/simulator/modules/Graph";
import React, {
  createContext,
  useState,
  useContext,
  RefObject,
  useRef,
} from "react";
import type { Sigma } from "sigma";
import { CameraState } from "sigma/types";
import { SimulationInfoCardType } from "../components/SimulationInfoBar";
import { SimulationInfoChipRef } from "../components/SimulationInfoChip";
import prettyBytes from "pretty-bytes";
import { renderToString } from "react-dom/server";
import { Divider } from "@mui/material";
import { SimulationInfoChipHelper } from "../utils/SimulationInfoChipHelper";

export type GraphVisualizationContextProps = {
  shouldShowArrows: boolean;
  setShouldShowArrows: (shouldShowArrows: boolean) => void;
  shouldShowLabels: boolean;
  setShouldShowLabels: (shouldShowLabels: boolean) => void;
  shouldShowEdges: boolean;
  setShouldShowEdges: (shouldShowEdges: boolean) => void;
  cameraState: CameraState | null;
  setCameraState: React.Dispatch<React.SetStateAction<CameraState | null>>;
  infoBarRef: RefObject<
    Record<SimulationInfoCardType, SimulationInfoChipRef | null>
  >;
  interfaceUpdater: (simulation: Simulation) => void;
  sigmaRef: RefObject<Sigma<NodeAttributes, EdgeAttributes> | null>;
  onUpdateSigma: () => void;
  isRunning: boolean;
  focusedNode: string | null;
  hoveredNode: string | null;
  setFocusedNode: React.Dispatch<React.SetStateAction<string | null>>;
  setHoveredNode: React.Dispatch<React.SetStateAction<string | null>>;
  nodeFocusEnabled: boolean;
  nodeDragEnabled: boolean;
  getNodeFocusEnabled: () => boolean;
  setNodeFocusEnabled: (value: boolean) => void;
  getNodeDragEnabled: () => boolean;
  setNodeDragEnabled: (value: boolean) => void;
  getCameraEnabled: () => boolean;
  setCameraEnabled: (value: boolean) => void;
  cameraEnabled: boolean;
};

const GraphVisualizationContext = createContext<
  GraphVisualizationContextProps | undefined
>(undefined);

type GraphVisualizationProviderProps = {
  children: React.ReactNode;
};

export const GraphVisualizationProvider = ({
  children,
}: GraphVisualizationProviderProps) => {
  const [shouldShowArrows, setShouldShowArrows] = useState<boolean>(true);
  const [shouldShowLabels, setShouldShowLabels] = useState<boolean>(true);
  const [shouldShowEdges, setShouldShowEdges] = useState<boolean>(true);
  const [cameraState, setCameraState] = useState<CameraState | null>(null);
  const [cameraStateEnabled, setCameraStateEnabled] = useState<boolean>(true);
  const [sigmaChanged, setSigmaChanged] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodeFocusEnabled = useRef<boolean>(false);
  const nodeDragEnabled = useRef<boolean>(false);
  const internalIsRunning = useRef<boolean>(false);
  const cameraEnabled = useRef<boolean>(true);
  const [stateNodeFocusEnabled, setStateNodeFocusEnabled] =
    useState<boolean>(false);
  const [stateNodeDragEnabled, setStateNodeDragEnabled] =
    useState<boolean>(false);

  const infoBarRef = useRef<
    Record<SimulationInfoCardType, SimulationInfoChipRef | null>
  >({
    [SimulationInfoCardType.Time]: null,
    [SimulationInfoCardType.TotalMessagesSent]: null,
    [SimulationInfoCardType.TotalReceivedMessages]: null,
    [SimulationInfoCardType.FramingRate]: null,
    [SimulationInfoCardType.Nodes]: null,
    [SimulationInfoCardType.Edges]: null,
    [SimulationInfoCardType.RemainingEvents]: null,
    [SimulationInfoCardType.RefreshingRate]: null,
    [SimulationInfoCardType.MessagesSentOnRound]: null,
    [SimulationInfoCardType.MessagesReceivedOnRound]: null,
  });
  const sigmaRef = useRef<Sigma<NodeAttributes, EdgeAttributes> | null>(null);
  const lastInterfaceUpdate = useRef(0);
  const interfaceUpdaterTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Updates the Graph Visualization Context with the current state of the simulation.
   * It is called whenever the simulation state changes, and it updates the interface elements accordingly.
   * The function takes a Simulation object as a parameter, and it updates the interface elements that correspond to each property of the simulation.
   * The function does not return any value, it only updates the interface elements.
   * @param {Simulation} simulation The current state of the simulation.
   */
  function interfaceUpdater(simulation: Simulation) {
    const obj = infoBarRef.current;

    if (obj.time) {
      SimulationInfoChipHelper.updateForTime(obj.time.update, simulation);
    }

    if (obj.totalMessagesSent) {
      SimulationInfoChipHelper.updateForTotalMessagesSent(
        obj.totalMessagesSent.update,
        simulation,
      );
    }

    if (obj.totalReceivedMessages) {
      SimulationInfoChipHelper.updateForTotalReceivedMessages(
        obj.totalReceivedMessages.update,
        simulation,
      );
    }

    if (obj.framingRate) {
      SimulationInfoChipHelper.updateForFramingRate(
        obj.framingRate.update,
        simulation,
      );
    }

    if (obj.refreshingRate) {
      SimulationInfoChipHelper.updateForRefreshingRate(
        obj.refreshingRate.update,
        simulation,
      );
    }

    if (obj.nodes) {
      SimulationInfoChipHelper.updateForNodes(obj.nodes.update, simulation);
    }

    if (obj.edges) {
      SimulationInfoChipHelper.updateForEdges(obj.edges.update, simulation);
    }

    if (obj.remainingEvents) {
      SimulationInfoChipHelper.updateForRemainingEvents(
        obj.remainingEvents.update,
        simulation,
      );
    }

    if (obj.messagesSentOnRound) {
      SimulationInfoChipHelper.updateForMessagesSentOnRound(
        obj.messagesSentOnRound.update,
        simulation,
      );
    }

    if (obj.messagesReceivedOnRound) {
      SimulationInfoChipHelper.updateForMessagesReceivedOnRound(
        obj.messagesReceivedOnRound.update,
        simulation,
      );
    }

    if (!internalIsRunning.current && simulation.isRunning) {
      setIsRunning(true);
      internalIsRunning.current = true;
    }
    if (internalIsRunning.current && !simulation.isRunning) {
      setIsRunning(false);
      internalIsRunning.current = false;
    }
  }

  /**
   * A debounced version of the interfaceUpdater function.
   * It updates the interface only if more than 18 milliseconds (about 60 fps) have passed since the last update.
   * This is useful for avoiding excessive updates when the simulation is running rapidly.
   */
  const debouncedInterfaceUpdater = (simulation: Simulation) => {
    interfaceUpdaterTimeout.current &&
      clearTimeout(interfaceUpdaterTimeout.current);
    if (Date.now() - lastInterfaceUpdate.current > 100) {
      interfaceUpdater(simulation);
      lastInterfaceUpdate.current = Date.now();
    }
    interfaceUpdaterTimeout.current = setTimeout(() => {
      interfaceUpdater(simulation);
    }, 100);
  };

  const onUpdateSigma = () => {
    setSigmaChanged(!sigmaChanged);
  };

  const setNodeFocusEnabled = (value: boolean) => {
    nodeFocusEnabled.current = value;
    setStateNodeFocusEnabled(value);
  };
  const setCameraEnabled = (value: boolean) => {
    cameraEnabled.current = value;
    setCameraStateEnabled(value);
  };
  const setNodeDragEnabled = (value: boolean) => {
    nodeDragEnabled.current = value;
    setStateNodeDragEnabled(value);
  };

  const getNodeFocusEnabled = () => {
    return nodeFocusEnabled.current;
  };
  const getNodeDragEnabled = () => {
    return nodeDragEnabled.current;
  };
  const getCameraEnabled = () => {
    return cameraEnabled.current;
  };

  return (
    <GraphVisualizationContext.Provider
      value={{
        shouldShowArrows,
        setShouldShowArrows,
        shouldShowLabels,
        setShouldShowLabels,
        shouldShowEdges,
        setShouldShowEdges,
        isRunning,
        cameraState,
        setCameraState,
        infoBarRef,
        interfaceUpdater: debouncedInterfaceUpdater,
        sigmaRef,
        onUpdateSigma,
        focusedNode,
        getNodeFocusEnabled,
        getNodeDragEnabled,
        setNodeDragEnabled,
        nodeFocusEnabled: stateNodeFocusEnabled,
        nodeDragEnabled: stateNodeDragEnabled,
        setNodeFocusEnabled,
        setFocusedNode,
        hoveredNode,
        setHoveredNode,
        cameraEnabled: cameraStateEnabled,
        getCameraEnabled,
        setCameraEnabled,
      }}
    >
      {children}
    </GraphVisualizationContext.Provider>
  );
};

export const useGraphVisualizationContext =
  (): GraphVisualizationContextProps => {
    const context = useContext(GraphVisualizationContext);
    if (!context) {
      throw new Error(
        "useGraphVisualizationContext must be used within a GraphVisualizationProvider",
      );
    }
    return context;
  };
