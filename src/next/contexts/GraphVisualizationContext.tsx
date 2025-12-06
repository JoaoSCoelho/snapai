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
  useEffect,
} from "react";
import { Sigma } from "sigma";
import { CameraState } from "sigma/types";

export type GraphVisualizationContentProps = {
  shouldShowArrows: boolean;
  setShouldShowArrows: (shouldShowArrows: boolean) => void;
  shouldShowIds: boolean;
  setShouldShowIds: (shouldShowIds: boolean) => void;
  cameraState: CameraState | null;
  setCameraState: React.Dispatch<React.SetStateAction<CameraState | null>>;
  infoBarRef: RefObject<HTMLParagraphElement[][]>;
  interfaceUpdater: (simulation: Simulation) => void;
  debouncedInterfaceUpdater: (simulation: Simulation) => void;
  // sigmaRef: React.RefObject<Sigma<NodeAttributes, EdgeAttributes> | null>;
  sigmaRef: RefObject<Sigma<NodeAttributes, EdgeAttributes> | null>;
  onUpdateSigma: () => void;
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
  const [cameraState, setCameraState] = useState<CameraState | null>(null);
  const [sigmaChanged, setSigmaChanged] = useState<boolean>(false);

  const nameArray = [
    "time",
    "totalMessagesSent",
    "messagesSentOnRound",
    "nodes",
    "edges",
    "remainingEvents",
  ];
  const infoBarRef = useRef<HTMLParagraphElement[][]>([]);
  const sigmaRef = useRef<Sigma<NodeAttributes, EdgeAttributes> | null>(null);
  const lastInterfaceUpdate = useRef(0);
  const interfaceUpdaterTimeout = useRef<NodeJS.Timeout | null>(null);
  infoBarRef.current = [];

  /**
   * Updates the Graph Visualization Context with the current state of the simulation.
   * It is called whenever the simulation state changes, and it updates the interface elements accordingly.
   * The function takes a Simulation object as a parameter, and it updates the interface elements that correspond to each property of the simulation.
   * The function does not return any value, it only updates the interface elements.
   * @param {Simulation} simulation The current state of the simulation.
   */
  const interfaceUpdater = (simulation: Simulation) => {
    const obj = infoBarRef.current
      .flatMap((el) => el)
      .reduce(
        (acc, el, i) => {
          acc[nameArray[i]] = el;
          return acc;
        },
        {} as { [key: string]: HTMLParagraphElement },
      );

    obj.time.textContent = simulation.currentTime.toString();
    obj.totalMessagesSent.textContent = simulation.statistics
      .getSentMessages()
      .toString();
    obj.messagesSentOnRound.textContent = simulation.isAsyncMode
      ? "----"
      : (simulation as SynchronousSimulation).statistics
          .getLastRoundSentMessages()
          .toString();
    obj.nodes.textContent = simulation.nodeSize().toString();
    obj.edges.textContent = simulation.edgeSize().toString();
    obj.remainingEvents.textContent = simulation.isAsyncMode
      ? (simulation as AsynchronousSimulation).eventQueue.size().toString()
      : "----";
  };

  /**
   * A debounced version of the interfaceUpdater function.
   * It updates the interface only if more than 18 milliseconds (about 60 fps) have passed since the last update.
   * This is useful for avoiding excessive updates when the simulation is running rapidly.
   */
  const debouncedInterfaceUpdater = (simulation: Simulation) => {
    interfaceUpdaterTimeout.current &&
      clearTimeout(interfaceUpdaterTimeout.current);
    if (Date.now() - lastInterfaceUpdate.current > 18) {
      interfaceUpdater(simulation);
      lastInterfaceUpdate.current = Date.now();
    }
    interfaceUpdaterTimeout.current = setTimeout(() => {
      interfaceUpdater(simulation);
    }, 18);
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
  (): GraphVisualizationContentProps => {
    const context = useContext(GraphVisualizationContext);
    if (!context) {
      throw new Error(
        "useGraphVisualizationContext must be used within a GraphVisualizationProvider",
      );
    }
    return context;
  };
