import { Tooltip, TooltipProps } from "@mui/material";
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

export type SimulationInfoChipRef = {
  box: HTMLDivElement | null;
  image: HTMLImageElement | null;
  text: HTMLParagraphElement | null;
  hoverBox: HTMLDivElement | null;
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
    },
    ref,
  ) => {
    const boxRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const hoverBoxRef = useRef<HTMLDivElement>(null);

    const [hovered, setHovered] = useState(false);

    useImperativeHandle(ref, () => ({
      box: boxRef.current,
      image: imageRef.current,
      text: textRef.current,
      hoverBox: hoverBoxRef.current,
    }));

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
              "bg-gray-100",
              "h-8",
              "px-1.5",
              "rounded-md",
              "shadow-md",
            )}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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
          hidden={!hovered}
          className={clsx(
            "pb-20 top-full absolute w-fit min-w-full z-10 left-0 whitespace-nowrap",
          )}
        >
          <div
            id={hoverBoxId}
            ref={hoverBoxRef}
            className="bg-amber-50 border-amber-200 whitespace-nowrap text-slate-700 w-full z-10 border mt-1 rounded-sm py-1 px-1.5 text-sm"
          >
            {title}
          </div>
        </div>
      </div>
    );
  },
);
