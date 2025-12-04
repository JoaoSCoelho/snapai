import { Divider } from "@mui/material";
import { useGraphVisualizationContext } from "../contexts/GraphVisualizationContext";
import { SimulationInfoBar, SimulationInfoCardType } from "./SimulationInfoBar";

export type SimulationSideInfoBarProps = {};

export function SimulationSideInfoBar({}: SimulationSideInfoBarProps) {
  const {
    simulationInfo: {
      time,
      nodes,
      edges,
      remainingEvents,
      numberOfMessagesOverAll,
      numberOfMessagesInThisRound,
    },
  } = useGraphVisualizationContext();

  return (
    <div className="flex w-full flex-col h-full gap-2">
      <SimulationInfoBar
        cards={[
          { type: SimulationInfoCardType.Time, value: time },
          {
            type: SimulationInfoCardType.TotalMessagesSent,
            value: numberOfMessagesOverAll,
          },
          {
            type: SimulationInfoCardType.MessagesSentOnRound,
            value: numberOfMessagesInThisRound,
          },
        ]}
      />
      <SimulationInfoBar
        cards={[
          { type: SimulationInfoCardType.Nodes, value: nodes },
          { type: SimulationInfoCardType.Edges, value: edges },
          {
            type: SimulationInfoCardType.RemainingEvents,
            value: remainingEvents,
          },
        ]}
      />
      <Divider variant="middle" />
      {/* <NodeInfo node={mouseInNode ?? undefined} />
        <Logs logs={logs} /> // TODO: implement it */}
    </div>
  );
}
