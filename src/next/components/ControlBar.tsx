import { useEffect, useState } from "react";
import ControlButton from "./ControlButton";
import { useConfigContext } from "../contexts/ConfigContext";
import { Simulator } from "@/simulator/Simulator";
import { useSimulationContext } from "../contexts/SimulationContext";
import { Simulation } from "@/simulator/models/Simulation";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
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

export type ControlBarProps = {};

const preRunFormSchema = z.object({
  rounds: z.number().int().min(1),
  refreshRate: z.number().int().min(0).optional(),
  frameRate: z.number().int().min(0).optional(),
});

export type PreRunFormSchema = z.infer<typeof preRunFormSchema>;

export const defaultPreRunFormValues: PreRunFormSchema = {
  rounds: 1,
  refreshRate: 0,
  frameRate: 30,
};

export default function ControlBar({}: ControlBarProps) {
  const { selectedProject } = useConfigContext();
  const { openDialog: openAddNodesDialog } = useAddNodesContext();
  const {
    shouldShowArrows,
    setShouldShowArrows,
    shouldShowIds,
    setShouldShowIds,
    debouncedInterfaceUpdater,
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreRunFormSchema>({
    defaultValues: defaultPreRunFormValues,
    resolver: zodResolver(preRunFormSchema),
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
    // TODO: implement it
  };
  const onDownloadGraphButtonClick = () => {
    // TODO: implement it
  };
  const onPlay = (data: Required<PreRunFormSchema>) => {
    // TODO: implement it
    if (!simulation)
      return ErrorSystem.emitError(
        new Error("Simulation not initialized"),
        "Simulation not initialized",
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
          undefined,
          undefined,
          undefined,
          () => {
            debouncedInterfaceUpdater(simulation);
          },
        ),
      );
    }
  };

  const handlePreRunFormSubmit = (data: Required<PreRunFormSchema>) => {
    if (onPlay) onPlay(data);
  };

  const handlePreRunFormSubmitBuilder = (oneRound: boolean) => {
    return (data: PreRunFormSchema) => {
      if (oneRound) data.rounds = 1;
      if (!data.refreshRate) data.refreshRate = 0;
      if (!data.frameRate) data.frameRate = 0;
      return handlePreRunFormSubmit(data as Required<PreRunFormSchema>);
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
          onClick={handleSubmit(handlePreRunFormSubmitBuilder(true))}
          iconImage={{
            alt: "Play icon with a number 1",
            src: "/assets/run1.svg",
          }}
          helpText="Run the simulation for one round."
        />
        <ControlButton
          onClick={handleSubmit(handlePreRunFormSubmitBuilder(false))}
          icon={<PlayCircleRoundedIcon style={{ color: "#27ae60" }} />}
          helpText="Run the simulation for the specified number of rounds."
        />
        <ControlButton
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
        iconImage={{
          src: `/assets/arrow-${shouldShowArrows ? "closed" : "open"}-eye.svg`,
          alt: "Arrow with an eye icon",
        }}
        helpText={`${shouldShowArrows ? "Hide" : "Show"} the network graph arrows.`}
        onClick={() => setShouldShowArrows(!shouldShowArrows)}
      />
      <ControlButton
        iconImage={{
          src: `/assets/${shouldShowIds ? "not-" : ""}id.svg`,
          alt: "ID icon",
        }}
        helpText={`${shouldShowIds ? "Hide" : "Show"} the network nodes IDs.`}
        onClick={() => setShouldShowIds(!shouldShowIds)}
      />
      <ControlButton
        icon={
          <FileDownloadRoundedIcon className="text-gray-400" fontSize="small" />
        }
        helpText="Download the network graph as an image."
        onClick={onDownloadGraphButtonClick}
      />
    </div>
  );
}
