"use client";
import { useEffect, useState } from "react";
import ControlButton from "./ControlButton";
import { useConfigContext } from "../contexts/ConfigContext";
import { Simulator } from "@/simulator/Simulator";
import { useSimulationContext } from "../contexts/SimulationContext";
import { Simulation } from "@/simulator/models/Simulation";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import { Divider } from "@mui/material";
import ControlInput from "./ControlInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { set } from "zod";
import { useGraphVisualizationContext } from "../contexts/GraphVisualizationContext";
import { ErrorSystem } from "../utils/ErrorSystem";
import { toast } from "sonner";
import { useAddNodesContext } from "../contexts/AddNodesContext";
import { SynchronousSimulation } from "@/simulator/models/SynchronousSimulation";
import { SynchronousThread } from "@/simulator/models/SynchronousThread";
import { exportSigmaToSVG } from "../utils/graphAsSvg";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import PolylineIcon from "@mui/icons-material/Polyline";
import { useLoadingContext } from "../contexts/LoadingContext";
import Graph from "graphology";
import { PiFileSvg } from "react-icons/pi";
import { useRuntimeContext } from "../contexts/RuntimeContext";
import clsx from "clsx";
import { MdLinearScale } from "react-icons/md";

export type ControlBarProps = {};

const runtimeFormSchema = z.object({
  rounds: z.number().int().min(1),
  refreshRate: z.number().int().min(0).optional(),
  frameRate: z.number().int().min(0).optional(),
});

export type RuntimeFormSchema = z.infer<typeof runtimeFormSchema>;

export default function ControlBar({}: ControlBarProps) {
  const {
    isLoading: runtimeIsLoading,
    defaultData: runtimeDefaultData,
    updateDefaultData: updateRuntimeDefaultData,
  } = useRuntimeContext();
  const { showLoading, hideLoading } = useLoadingContext();
  const { selectedProject } = useConfigContext();
  const { openDialog: openAddNodesDialog } = useAddNodesContext();
  const {
    shouldShowArrows,
    setShouldShowArrows,
    shouldShowIds,
    setShouldShowIds,
    debouncedInterfaceUpdater,
    sigmaRef,
    isRunning,
    setShouldShowEdges,
    shouldShowEdges,
  } = useGraphVisualizationContext();
  const { setSimulation, simulation } = useSimulationContext();

  const [initializeButtonLoading, setInitializeButtonLoading] = useState(false);
  const [initializeButtonDisabled, setInitializeButtonDisabled] =
    useState(false);
  const [initializeButtonState, setInitializeButtonState] = useState<
    "success" | "error" | "idle"
  >("idle");
  const [initializeButtonBg, setInitializeButtonBg] = useState<
    string | undefined
  >(undefined);
  const [reevaluateButtonLoading, setReevaluateButtonLoading] = useState(false);
  const [reevaluateButtonDisabled, setReevaluateButtonDisabled] =
    useState(false);
  const [reevaluateButtonState, setReevaluateButtonState] = useState<
    "success" | "error" | "idle"
  >("idle");
  const [reevaluateButtonBg, setReevaluateButtonBg] = useState<
    string | undefined
  >(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RuntimeFormSchema>({
    defaultValues: runtimeDefaultData,
    resolver: zodResolver(runtimeFormSchema),
  });

  useEffect(() => {
    setInitializeButtonBg(
      initializeButtonState === "success"
        ? "#fedd2172"
        : initializeButtonState === "error"
          ? "#ff4d4d72"
          : undefined,
    );
  }, [initializeButtonState]);

  useEffect(() => {
    setReevaluateButtonBg(
      reevaluateButtonState === "success"
        ? "#fedd2172"
        : reevaluateButtonState === "error"
          ? "#ff4d4d72"
          : undefined,
    );
  }, [reevaluateButtonState]);

  useEffect(() => {
    console.log(isRunning);
  }, [isRunning]);

  if (!selectedProject) return;

  const onInitializeButtonClick = async () => {
    setInitializeButtonLoading(true);

    new Promise<Simulation>((resolve, reject) => {
      try {
        const result = Simulator.getInstance().initSimulation(selectedProject);

        resolve(result);
      } catch (e) {
        reject(e);
      }
    }).then(
      (simulation) => {
        setInitializeButtonState("success");
        setSimulation(simulation);
        toast.success("Simulation initialized");
      },
      (e) => {
        setInitializeButtonState("error");
        ErrorSystem.emitError("Failed to initialize simulation", e);
      },
    );

    setTimeout(() => {
      setInitializeButtonState("idle");
      setInitializeButtonLoading(false);
    }, 1000);
  };

  const resetCam = () => {
    if (!sigmaRef.current) return toast.warning("Simulation not initialized");

    sigmaRef.current.getCamera().animatedReset({
      duration: 300,
    });
  };

  const toPng = () => {
    if (!sigmaRef.current) return toast.warning("Simulation not initialized");
    import("@sigma/export-image").then(({ downloadAsPNG }) => {
      downloadAsPNG(sigmaRef.current as any, {
        fileName: "graph", // nome do arquivo sem extensão
        backgroundColor: "#fff", // cor de fundo (ou transparente)
        width: null, // usa largura do container
        height: null, // usa altura do container
        layers: null, // exporta todos os layers
        cameraState: null, // estado atual da câmera
      });
    });
  };

  const toSvg = async () => {
    if (!sigmaRef.current) return;

    await exportSigmaToSVG(sigmaRef.current.getGraph(), (perc) => {
      showLoading(`${perc * 100}%`);
    });

    hideLoading();
  };

  const onAddNodesButtonClick = () => {
    openAddNodesDialog();
  };
  const onPauseButtonClick = () => {
    // TODO: implement it
    if (!simulation)
      return ErrorSystem.emitError(
        new Error("Simulation not initialized"),
        "Simulation not initialized",
      );
    simulation.stop();
  };
  const onResetCamButtonClick = () => {
    resetCam();
  };
  const onScreenshotGraphButtonClick = () => {
    toPng();
  };
  const onGraphToSvgButtonClick = () => {
    toSvg();
  };
  const onPlay = (data: Required<RuntimeFormSchema>) => {
    if (!simulation)
      return ErrorSystem.emitError(
        new Error("Simulation not initialized"),
        "Simulation not initialized",
      );

    if (!sigmaRef.current)
      return ErrorSystem.emitError(
        new Error("Sigma not initialized"),
        "Sigma not initialized",
      );
    if (simulation.isAsyncMode) {
      // TODO: implement it
    } else {
      simulation.run(
        new SynchronousThread(
          simulation as SynchronousSimulation,
          data.rounds,
          data.refreshRate,
          data.frameRate,
          sigmaRef.current as any,
          undefined,
          undefined,
          undefined,
          () => {
            debouncedInterfaceUpdater(simulation);
          },
        ),
      );
    }
    updateRuntimeDefaultData({
      rounds: data.rounds,
      refreshRate: data.refreshRate ?? undefined,
      frameRate: data.frameRate ?? undefined,
    });
  };

  const onReevaluateConnectionsButtonClick = async () => {
    setReevaluateButtonLoading(true);

    if (!simulation || !sigmaRef.current) {
      setReevaluateButtonDisabled(true);
      setReevaluateButtonState("error");
      toast.warning("Simulation not initialized");
      setTimeout(() => {
        setReevaluateButtonDisabled(false);
        setReevaluateButtonLoading(false);
        setReevaluateButtonState("idle");
      }, 1000);
      return;
    }

    sigmaRef.current.setGraph(new Graph());
    await simulation
      .reevaluateConnections(async (prog) => {
        showLoading(`${prog * 100}%`);
        debouncedInterfaceUpdater(simulation);
      })
      .then(
        () => {
          toast.success("Connections reevaluated");
          debouncedInterfaceUpdater(simulation);
          setReevaluateButtonState("success");
        },
        (e) => {
          ErrorSystem.emitError(e, "Failed to reevaluate connections");
          setReevaluateButtonState("error");
        },
      );
    sigmaRef.current.setGraph(simulation.graph);

    hideLoading();
    setTimeout(() => {
      setReevaluateButtonState("idle");
      setReevaluateButtonLoading(false);
    }, 1000);
  };

  const handleRuntimeFormSubmit = (data: Required<RuntimeFormSchema>) => {
    if (onPlay) onPlay(data);
  };

  const handleRuntimeFormSubmitBuilder = (oneRound: boolean) => {
    return (data: RuntimeFormSchema) => {
      if (oneRound) data.rounds = 1;
      if (!data.refreshRate) data.refreshRate = 0;
      if (!data.frameRate) data.frameRate = 0;
      return handleRuntimeFormSubmit(data as Required<RuntimeFormSchema>);
    };
  };

  return (
    <div className="control-bar gap-1 flex">
      <ControlButton
        disabled={initializeButtonDisabled || initializeButtonLoading}
        label="Initialize"
        iconImage={{
          src: "/assets/reload.svg",
          alt: "Gear with a reloading wheel icon",
        }}
        style={{ backgroundColor: initializeButtonBg }}
        helpText={
          initializeButtonDisabled
            ? "Select a project first!"
            : "Reset all variables and prepare the simulator for a new simulation."
        }
        onClick={onInitializeButtonClick}
      />
      <ControlButton
        label="Add Nodes"
        icon={<AddCircleRoundedIcon style={{ color: "#2867CE" }} />}
        helpText="Open form to add nodes to the network."
        onClick={onAddNodesButtonClick}
      />
      <ControlButton
        label="Reevaluate Connections"
        iconImage={{
          alt: "Network icon",
          src: "/assets/reevaluate-connections.svg",
        }}
        onClick={onReevaluateConnectionsButtonClick}
        helpText="Reevaluate the connections between the nodes in the network."
      />
      <Divider orientation="vertical" flexItem />
      <div className="playpause-bar flex gap-1">
        <ControlInput
          title="Number of Rounds"
          placeholder="Rounds"
          helpText="The number of rounds that the simulation should run for. The simulation will stop after this number of rounds or when the stop button is pressed."
          register={register("rounds", {
            setValueAs: (value) => (value ? Number(value) : undefined),
          })}
          error={errors.rounds?.message}
          type="number"
          min={1}
        />
        <ControlInput
          title="Refresh Rate (Rounds per second)"
          placeholder="Refresh rate"
          helpText="The number of rounds that the simulation should run for each second. For no limit, set to 0 or leave blank."
          register={register("refreshRate", {
            setValueAs: (value) => (value ? Number(value) : undefined),
          })}
          error={errors.refreshRate?.message}
          type="number"
          min={0}
        />
        <ControlInput
          title="Frame Rate (Frames per second)"
          placeholder="Frame rate"
          helpText=<>
            <p>
              The number of frames that the simulator should render for each
              second. For no limit, set to 0 or leave blank.
            </p>
            <p>
              {" "}
              <b>
                Note that more frames per second will result in a slower
                simulation.
              </b>
            </p>
          </>
          register={register("frameRate", {
            setValueAs: (value) => (value ? Number(value) : undefined),
          })}
          error={errors.frameRate?.message}
          type="number"
          min={0}
        />
        <ControlButton
          onClick={handleSubmit(handleRuntimeFormSubmitBuilder(true))}
          disabled={isRunning}
          className={"disabled:cursor-not-allowed disabled:opacity-50"}
          iconImage={{
            alt: "Play icon with a number 1",
            src: "/assets/run1.svg",
          }}
          helpText="Run the simulation for one round."
        />
        <ControlButton
          disabled={isRunning}
          className={"disabled:cursor-not-allowed disabled:opacity-50"}
          onClick={handleSubmit(handleRuntimeFormSubmitBuilder(false))}
          icon={<PlayCircleRoundedIcon style={{ color: "#27ae60" }} />}
          helpText="Run the simulation for the specified number of rounds."
        />
        <ControlButton
          disabled={!isRunning}
          className={"disabled:cursor-not-allowed disabled:opacity-50"}
          icon={<StopCircleRoundedIcon style={{ color: "#E74C3C" }} />}
          helpText="Stop the simulation."
          onClick={onPauseButtonClick}
        />
      </div>
      <Divider orientation="vertical" flexItem />
      <ControlButton
        icon={<FitScreenIcon className="text-gray-400" fontSize="small" />}
        helpText="Reset camera to fit the screen. (Autoscale)"
        onClick={onResetCamButtonClick}
      />
      <ControlButton
        disabled={isRunning}
        className={"disabled:cursor-not-allowed disabled:opacity-50"}
        icon={<MdLinearScale className="text-gray-400" />}
        helpText={
          isRunning
            ? "Only usable when the simulation is paused."
            : `${shouldShowEdges ? "Hide" : "Show"} the network graph edges.`
        }
        onClick={() => setShouldShowEdges(!shouldShowEdges)}
      />
      <ControlButton
        disabled={isRunning}
        className={"disabled:cursor-not-allowed disabled:opacity-50"}
        iconImage={{
          src: `/assets/arrow-${shouldShowArrows ? "closed" : "open"}-eye.svg`,
          alt: "Arrow with an eye icon",
        }}
        helpText={
          isRunning
            ? "Only usable when the simulation is paused."
            : `${shouldShowArrows ? "Hide" : "Show"} the network graph arrows.`
        }
        onClick={() => setShouldShowArrows(!shouldShowArrows)}
      />
      <ControlButton
        disabled={isRunning}
        className={"disabled:cursor-not-allowed disabled:opacity-50"}
        iconImage={{
          src: `/assets/${shouldShowIds ? "not-" : ""}id.svg`,
          alt: "ID icon",
        }}
        helpText={
          isRunning
            ? "Only usable when the simulation is paused."
            : `${shouldShowIds ? "Hide" : "Show"} the network nodes IDs.`
        }
        onClick={() => setShouldShowIds(!shouldShowIds)}
      />
      <ControlButton
        icon={
          <ScreenshotMonitorIcon className="text-gray-400" fontSize="small" />
        }
        helpText="Download the current visualization as a PNG image."
        onClick={onScreenshotGraphButtonClick}
      />
      <ControlButton
        icon={<PiFileSvg className="text-gray-400" />}
        helpText="Download the current graph drawned as a SVG file."
        onClick={onGraphToSvgButtonClick}
      />
    </div>
  );
}
