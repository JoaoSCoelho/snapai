import { Divider } from "@mui/material";
import { useGraphVisualizationContext } from "../contexts/GraphVisualizationContext";
import {
  SimulationInfoBar,
  SimulationInfoBarRef,
  SimulationInfoCardType,
} from "./SimulationInfoBar";
import { useSimulationContext } from "../contexts/SimulationContext";
import { AsynchronousSimulation } from "@/simulator/models/AsynchronousSimulation";
import { SynchronousSimulation } from "@/simulator/models/SynchronousSimulation";

export type SimulationSideInfoBarProps = {};

export function SimulationSideInfoBar({}: SimulationSideInfoBarProps) {
  const { infoBarRef } = useGraphVisualizationContext();
  const { simulation } = useSimulationContext();

  const refFunc = (el: SimulationInfoBarRef | null) => {
    if (el) {
      for (const key in el) {
        if (el[key as SimulationInfoCardType] === null) continue;
        infoBarRef.current[key as SimulationInfoCardType] =
          el[key as SimulationInfoCardType];
      }
    }
  };

  return (
    <div className="flex w-full flex-col h-full gap-2">
      <SimulationInfoBar
        ref={refFunc}
        cards={[
          {
            type: SimulationInfoCardType.Time,
            value: simulation?.currentTime ?? null,
          },
          {
            type: SimulationInfoCardType.TotalMessagesSent,
            value: simulation?.statistics.getSentMessages() ?? null,
          },
          {
            type: SimulationInfoCardType.TotalReceivedMessages,
            value: simulation?.statistics.getReceivedMessages() ?? null,
          },
          {
            type: SimulationInfoCardType.MessagesSentOnRound,
            value: simulation?.isAsyncMode
              ? null
              : ((simulation as SynchronousSimulation | undefined)?.statistics
                  .getLastRoundSentMessages()
                  .toString() ?? null),
          },
          {
            type: SimulationInfoCardType.FramingRate,
            value: simulation?.currentThread?.framingRate ?? null,
          },
        ]}
      />
      <SimulationInfoBar
        ref={refFunc}
        cards={[
          {
            type: SimulationInfoCardType.Nodes,
            value: simulation?.nodeSize() ?? null,
          },
          {
            type: SimulationInfoCardType.Edges,
            value: simulation?.edgeSize() ?? null,
          },
          {
            type: SimulationInfoCardType.RemainingEvents,
            value: simulation?.isAsyncMode
              ? (simulation as AsynchronousSimulation)?.eventQueue.size()
              : null,
          },
          {
            type: SimulationInfoCardType.RefreshingRate,
            value: simulation?.currentThread?.refreshingRate ?? null,
          },
        ]}
      />
      <Divider variant="middle" />
      {/* <NodeInfo node={mouseInNode ?? undefined} />
        <Logs logs={logs} /> // TODO: implement it */}
    </div>
  );
}
