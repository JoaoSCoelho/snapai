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
import { info } from "console";

export type GraphVisualizationContextProps = {
  shouldShowArrows: boolean;
  setShouldShowArrows: (shouldShowArrows: boolean) => void;
  shouldShowIds: boolean;
  setShouldShowIds: (shouldShowIds: boolean) => void;
  shouldShowEdges: boolean;
  setShouldShowEdges: (shouldShowEdges: boolean) => void;
  cameraState: CameraState | null;
  setCameraState: React.Dispatch<React.SetStateAction<CameraState | null>>;
  infoBarRef: RefObject<
    Record<SimulationInfoCardType, SimulationInfoChipRef | null>
  >;
  interfaceUpdater: (simulation: Simulation) => void;
  debouncedInterfaceUpdater: (simulation: Simulation) => void;
  sigmaRef: RefObject<Sigma<NodeAttributes, EdgeAttributes> | null>;
  onUpdateSigma: () => void;
  isRunning: boolean;
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
  const [shouldShowIds, setShouldShowIds] = useState<boolean>(true);
  const [shouldShowEdges, setShouldShowEdges] = useState<boolean>(true);
  const [cameraState, setCameraState] = useState<CameraState | null>(null);
  const [sigmaChanged, setSigmaChanged] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const interalIsRunning = useRef<boolean>(false);

  const nameArray = [
    "time",
    "totalMessagesSent",
    "totalReceivedMessages",
    "framingRate",
    "nodes",
    "edges",
    "remainingEvents",
    "refreshingRate",
  ];
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
  const interfaceUpdater = (simulation: Simulation) => {
    const obj = infoBarRef.current;
    obj.time?.text?.textContent &&
      (obj.time.text.textContent = simulation.currentTime.toString());

    obj.totalMessagesSent?.text?.textContent &&
      (obj.totalMessagesSent.text.textContent = simulation.statistics
        .getSentMessages()
        .toString());

    obj.totalMessagesSent?.hoverBox?.textContent &&
      (obj.totalMessagesSent.hoverBox.innerHTML = `<p>Total sent bytes: ${simulation.statistics.getSentBytes()}</p><p>Total sent message bytes: ${simulation.statistics.getSentMessageBytes()}</p>`);

    obj.totalReceivedMessages?.text?.textContent &&
      (obj.totalReceivedMessages.text.textContent = simulation.statistics
        .getReceivedMessages()
        .toString());

    obj.framingRate?.text?.textContent &&
      (obj.framingRate.text.textContent =
        simulation.currentThread?.framingRate.toFixed(0) ?? "----");

    obj.refreshingRate?.text?.textContent &&
      (obj.refreshingRate.text.textContent =
        simulation.currentThread?.refreshingRate.toFixed(0) ?? "----");

    obj.nodes?.text?.textContent &&
      (obj.nodes.text.textContent = simulation.nodeSize().toString());

    obj.edges?.text?.textContent &&
      (obj.edges.text.textContent = simulation.edgeSize().toString());

    obj.remainingEvents?.text?.textContent &&
      (obj.remainingEvents.text.textContent = simulation.isAsyncMode
        ? (simulation as AsynchronousSimulation).eventQueue.size().toString()
        : "----");

    obj.messagesSentOnRound?.text?.textContent &&
      (obj.messagesSentOnRound.text.textContent = simulation.isAsyncMode
        ? "----"
        : (simulation as SynchronousSimulation).statistics
            .getLastRoundSentMessages()
            .toString());

    if (!interalIsRunning.current && simulation.isRunnig) {
      setIsRunning(true);
      interalIsRunning.current = true;
    }
    if (interalIsRunning.current && !simulation.isRunnig) {
      setIsRunning(false);
      interalIsRunning.current = false;
    }
  };

  /**
   * A debounced version of the interfaceUpdater function.
   * It updates the interface only if more than 18 milliseconds (about 60 fps) have passed since the last update.
   * This is useful for avoiding excessive updates when the simulation is running rapidly.
   */
  const debouncedInterfaceUpdater = (simulation: Simulation) => {
    interfaceUpdaterTimeout.current &&
      clearTimeout(interfaceUpdaterTimeout.current);
    if (Date.now() - lastInterfaceUpdate.current > 60) {
      interfaceUpdater(simulation);
      lastInterfaceUpdate.current = Date.now();
    }
    interfaceUpdaterTimeout.current = setTimeout(() => {
      interfaceUpdater(simulation);
    }, 60);
  };

  const onUpdateSigma = () => {
    setSigmaChanged(!sigmaChanged);
  };

  return (
    <GraphVisualizationContext.Provider
      value={{
        shouldShowArrows,
        setShouldShowArrows,
        shouldShowIds,
        setShouldShowIds,
        shouldShowEdges,
        setShouldShowEdges,
        isRunning,
        cameraState,
        setCameraState,
        infoBarRef,
        interfaceUpdater,
        debouncedInterfaceUpdater,
        sigmaRef,
        onUpdateSigma,
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
