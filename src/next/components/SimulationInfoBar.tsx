import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import { forwardRef, ReactElement, useImperativeHandle, useRef } from "react";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";
import { SimulationInfoChip } from "./SimulationInfoChip";
import { PiGraphDuotone } from "react-icons/pi";
import { GrNodes } from "react-icons/gr";
import { Md30FpsSelect, MdOutbox } from "react-icons/md";
import { HiInboxIn } from "react-icons/hi";
import { FaFastForward } from "react-icons/fa";

export enum SimulationInfoCardType {
  TotalMessagesSent,
  TotalReceivedMessages,
  MessagesSentOnRound,
  FramingRate,
  Time,
  Nodes,
  Edges,
  RemainingEvents,
  RefreshingRate,
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
              fontSize="medium"
              style={{ color: "#666" }}
            />
          );
        } else if (card.type === SimulationInfoCardType.TotalMessagesSent) {
          title = "Total messages sent";
          icon = <MdOutbox color="#666" fontSize={24} />;
        } else if (card.type === SimulationInfoCardType.TotalReceivedMessages) {
          title = "Total received messages";
          icon = <HiInboxIn color="#666" fontSize={24} />;
        } else if (card.type === SimulationInfoCardType.FramingRate) {
          title = "Frame Rate";
          icon = <Md30FpsSelect color="#666" fontSize={24} />;
        } else if (card.type === SimulationInfoCardType.Nodes) {
          title = "Number of Nodes";
          icon = <GrNodes fontSize={24} color="#666" />;
        } else if (card.type === SimulationInfoCardType.Edges) {
          title = "Number of Edges";
          icon = <PiGraphDuotone fontSize={24} color="#666" />;
        } else if (card.type === SimulationInfoCardType.RemainingEvents) {
          title = "Remaining Events";
          icon = (
            <EventRepeatRoundedIcon
              fontSize="medium"
              style={{ color: "#666" }}
            />
          );
        } else if (card.type === SimulationInfoCardType.RefreshingRate) {
          title = "Refresh Rate";
          icon = <FaFastForward fontSize="medium" style={{ color: "#666" }} />;
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
