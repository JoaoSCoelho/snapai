import { Divider } from "@mui/material";
import { useGraphVisualizationContext } from "../contexts/GraphVisualizationContext";
import {
  SimulationInfoBar,
  SimulationInfoBarRef,
  SimulationInfoCardType,
} from "./SimulationInfoBar";
import NodeInfo from "./NodeInfo";
export type SimulationSideInfoBarProps = {};

export function SimulationSideInfoBar({}: SimulationSideInfoBarProps) {
  const { infoBarRef, focusedNode, hoveredNode } =
    useGraphVisualizationContext();

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
          { type: SimulationInfoCardType.Time },
          { type: SimulationInfoCardType.TotalMessagesSent },
          { type: SimulationInfoCardType.TotalReceivedMessages },
          { type: SimulationInfoCardType.MessagesSentOnRound },
          { type: SimulationInfoCardType.MessagesReceivedOnRound },
          { type: SimulationInfoCardType.FramingRate },
        ]}
      />
      <SimulationInfoBar
        ref={refFunc}
        cards={[
          { type: SimulationInfoCardType.Nodes },
          { type: SimulationInfoCardType.Edges },
          { type: SimulationInfoCardType.RemainingEvents },
          { type: SimulationInfoCardType.RefreshingRate },
        ]}
      />
      <Divider variant="middle" />
      <NodeInfo node={hoveredNode ?? focusedNode ?? undefined} />
      {/* <Logs logs={logs} /> // TODO: implement it */}
    </div>
  );
}
