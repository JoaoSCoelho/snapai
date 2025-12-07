import { Divider } from "@mui/material";
import { useGraphVisualizationContext } from "../contexts/GraphVisualizationContext";
import { SimulationInfoBar, SimulationInfoCardType } from "./SimulationInfoBar";
import { useSimulationContext } from "../contexts/SimulationContext";
import { AsynchronousSimulation } from "@/simulator/models/AsynchronousSimulation";

export type SimulationSideInfoBarProps = {};

export function SimulationSideInfoBar({}: SimulationSideInfoBarProps) {
  const { infoBarRef } = useGraphVisualizationContext();
  const { simulation } = useSimulationContext();

  return (
    <div className="flex w-full flex-col h-full gap-2">
      <SimulationInfoBar
        ref={(el) => {
          if (el) {
            infoBarRef.current[0] = el;
          }
        }}
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
            type: SimulationInfoCardType.FramingRate,
            value: simulation?.currentThread?.framingRate ?? null,
          },
        ]}
      />
      <SimulationInfoBar
        ref={(el) => {
          if (el) {
            infoBarRef.current[1] = el;
          }
        }}
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
