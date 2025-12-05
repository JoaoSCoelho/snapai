import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import SendAndArchiveRoundedIcon from "@mui/icons-material/SendAndArchiveRounded";
import ScheduleSendRoundedIcon from "@mui/icons-material/ScheduleSendRounded";
import { forwardRef, ReactElement, useImperativeHandle, useRef } from "react";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";
import { SimulationInfoChip } from "./SimulationInfoChip";

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

export type SimulationInfoBarRef = HTMLParagraphElement[];

export type SimulationInfoBarProps = {
  cards: SimulationInfoCard[];
};
export const SimulationInfoBar = forwardRef<
  SimulationInfoBarRef,
  SimulationInfoBarProps
>(({ cards }, ref) => {
  const chipRefs = useRef<HTMLParagraphElement[]>([]);

  // Garante que o array tenha o mesmo tamanho de cards
  chipRefs.current = [];

  useImperativeHandle(ref, () => chipRefs.current);

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
            ref={(el) => {
              if (el) {
                chipRefs.current[index] = el;
              }
            }}
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
});
