import SimulationInfoChip from "./SimulationInfoChip";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import SendAndArchiveRoundedIcon from "@mui/icons-material/SendAndArchiveRounded";
import ScheduleSendRoundedIcon from "@mui/icons-material/ScheduleSendRounded";
import { ReactElement } from "react";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";

export enum SimulationInfoCardType {
  TotalMessagesSent,
  MessagesSentOnRound,
  Time,
  Nodes,
  Edges,
  RemainingEvents,
}
// TODO: review this component
export type SimulationInfoCard = {
  type: SimulationInfoCardType;
  value: string | number | null;
};

export type SimulationInfoBarProps = {
  cards: SimulationInfoCard[];
};
export function SimulationInfoBar({ cards }: SimulationInfoBarProps) {
  return (
    <div className="flex w-full gap-2">
      {cards.map((card, index) => {
        let title: string = "";
        let icon: ReactElement | undefined = undefined;
        let iconImage: { src: string; alt: string } | undefined = undefined;

        if (card.type === SimulationInfoCardType.Time) {
          title = "Simulation time";
          icon = (
            <AccessTimeFilledRoundedIcon
              fontSize="large"
              style={{ color: "#666" }}
            />
          );
        } else if (card.type === SimulationInfoCardType.TotalMessagesSent) {
          title = "Total messages sent";
          icon = (
            <SendAndArchiveRoundedIcon
              fontSize="large"
              style={{ color: "#666" }}
            />
          );
        } else if (card.type === SimulationInfoCardType.MessagesSentOnRound) {
          title = "Messages sent on this round";
          icon = (
            <ScheduleSendRoundedIcon
              fontSize="large"
              style={{ color: "#666" }}
            />
          );
        } else if (card.type === SimulationInfoCardType.Nodes) {
          title = "Number of Nodes";
          iconImage = {
            src: "/assets/num-nodes.svg",
            alt: "Number of Nodes icon",
          };
        } else if (card.type === SimulationInfoCardType.Edges) {
          title = "Number of Edges";
          iconImage = {
            src: "/assets/num-links.svg",
            alt: "Number of Edges icon",
          };
        } else if (card.type === SimulationInfoCardType.RemainingEvents) {
          title = "Remaining Events";
          icon = (
            <EventRepeatRoundedIcon
              fontSize="large"
              style={{ color: "#666" }}
            />
          );
        }
        return (
          <SimulationInfoChip
            key={index}
            fullWidth
            title={title}
            text={card.value?.toString() ?? "----"}
            icon={icon}
            iconImage={iconImage}
          />
        );
      })}
    </div>
  );
}
