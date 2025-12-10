import { Divider, Tooltip } from "@mui/material";
import clsx from "clsx";
import Image from "next/image";
import {
  forwardRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { renderToString } from "react-dom/server";
import { SimulationInfoChipHelper } from "../utils/SimulationInfoChipHelper";
import { useGraphVisualizationContext } from "../contexts/GraphVisualizationContext";

export type SimulationInfoChipUpdaterProps = {
  text?: string | null;
  hoverBoxShortContent?: ReactNode | null;
  hoverBoxFullContent?: ReactNode | null;
};
export type SimulationInfoChipUpdater = (
  props: SimulationInfoChipUpdaterProps,
) => void;

export type SimulationInfoChipRef = {
  box: HTMLDivElement | null;
  image: HTMLImageElement | null;
  text: HTMLParagraphElement | null;
  hoverBox: HTMLDivElement | null;
  update: SimulationInfoChipUpdater;
};

export type SimulationInfoChipProps = {
  tooltipId?: string;
  textId?: string;
  boxId?: string;
  imageId?: string;
  hoverBoxId?: string;
  icon?: ReactElement;
  iconImage?: {
    src: string;
    alt: string;
  };
  text?: string;
  title: ReactNode;
  hoverBoxContent?: ReactNode;
  fullWidth?: boolean;
  boxAttr?: HTMLAttributes<HTMLDivElement>;
};

export const SimulationInfoChip = forwardRef<
  SimulationInfoChipRef,
  SimulationInfoChipProps
>(
  (
    {
      icon,
      iconImage,
      text,
      fullWidth,
      title,
      boxAttr,
      boxId,
      imageId,
      textId,
      tooltipId,
      hoverBoxId,
      hoverBoxContent,
    },
    ref,
  ) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const hoverBoxShortRef = useRef<HTMLDivElement>(null);
    const hoverBoxFullRef = useRef<HTMLDivElement>(null);
    const hoveredRef = useRef(false);
    const clickedRef = useRef(false);
    const hoverBoxShortDataRef = useRef<string | null>(null);
    const hoverBoxFullDataRef = useRef<string | null>(null);

    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    useImperativeHandle(ref, () => ({
      box: boxRef.current,
      image: imageRef.current,
      text: textRef.current,
      hoverBox: hoverBoxShortRef.current,
      update,
    }));

    const update = ({
      text: newText,
      hoverBoxShortContent: newHoverBoxShortContent,
      hoverBoxFullContent: newHoverBoxFullContent,
    }: SimulationInfoChipUpdaterProps) => {
      if (newText === null) newText = "----";
      if (newHoverBoxFullContent === null) newHoverBoxFullContent = "----";
      if (newHoverBoxShortContent === null) newHoverBoxShortContent = "----";

      if (textRef.current)
        textRef.current.textContent = newText ?? textRef.current.textContent;

      hoverBoxFullDataRef.current = newHoverBoxFullContent
        ? renderToString(newHoverBoxFullContent)
        : hoverBoxFullDataRef.current;

      hoverBoxShortDataRef.current = newHoverBoxShortContent
        ? renderToString(newHoverBoxShortContent)
        : hoverBoxShortDataRef.current;

      updateHoverBox();
    };

    const updateHoverBox = () => {
      updateHoverBoxShort();
      updateHoverBoxFull();
    };

    const updateHoverBoxShort = () => {
      if (hoverBoxShortRef.current) {
        hoverBoxShortRef.current.innerHTML =
          hoverBoxShortDataRef.current ?? hoverBoxShortRef.current.innerHTML;
      }
    };

    const updateHoverBoxFull = () => {
      if (hoverBoxFullRef.current) {
        hoverBoxFullRef.current.innerHTML =
          hoverBoxFullDataRef.current ?? hoverBoxFullRef.current.innerHTML;
      }
    };

    const onHover = () => {
      setHovered(true);
      hoveredRef.current = true;
      updateHoverBox();
    };

    const onLeave = () => {
      setHovered(false);
      hoveredRef.current = false;
    };

    const onClick = () => {
      setClicked(!clickedRef.current);
      clickedRef.current = !clickedRef.current;
    };

    return (
      <div
        id={boxId}
        {...boxAttr}
        ref={boxRef}
        className={clsx("relative", fullWidth && "w-full", boxAttr?.className)}
      >
        <Tooltip
          id={tooltipId}
          arrow
          placement="top"
          enterDelay={500}
          enterNextDelay={500}
          title={title}
        >
          <div
            className={clsx(
              "flex",
              "items-center",
              "justify-between",
              "gap-2",
              clicked ? "bg-gray-200" : "bg-gray-100",
              "h-8",
              "px-1.5",
              "rounded-md",
              !clicked && "shadow-md",
              "cursor-pointer",
            )}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onClick={onClick}
          >
            {icon ??
              (iconImage && (
                <Image
                  id={imageId}
                  src={iconImage.src}
                  alt={iconImage.alt}
                  ref={imageRef}
                  width={24}
                  height={24}
                />
              ))}
            <p
              id={textId}
              ref={textRef}
              className="block font-bold text-sm text-gray-700 font-mono"
            >
              {text}
            </p>
          </div>
        </Tooltip>
        <div
          hidden={!hovered && !clicked}
          className={clsx(
            "pb-20 top-full absolute w-fit min-w-full z-10 left-0 whitespace-nowrap",
          )}
        >
          <div
            id={hoverBoxId}
            aria-label={clicked ? "full-info" : "short-info"}
            className="bg-amber-50 border-amber-200 whitespace-nowrap text-slate-700 w-full z-10 border mt-1 rounded-sm py-1 px-1.5 text-sm"
          >
            <div ref={hoverBoxShortRef}>{hoverBoxContent ?? title}</div>
            <Divider />
            <div ref={hoverBoxFullRef}></div>
          </div>
        </div>
      </div>
    );
  },
);
