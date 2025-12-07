import { Tooltip } from "@mui/material";
import clsx from "clsx";
import Image from "next/image";
import { forwardRef, HTMLAttributes, ReactElement, ReactNode } from "react";

export type SimulationInfoChipRef = HTMLParagraphElement;

export type SimulationInfoChipProps = {
  icon?: ReactElement;
  iconImage?: {
    src: string;
    alt: string;
  };
  text: string;
  title: ReactNode;
  fullWidth?: boolean;
  boxAttr?: HTMLAttributes<HTMLDivElement>;
};

//TODO: Review this component
export const SimulationInfoChip = forwardRef<
  SimulationInfoChipRef,
  SimulationInfoChipProps
>(({ icon, iconImage, text, fullWidth, title, boxAttr }, ref) => {
  return (
    <Tooltip arrow title={title}>
      <div
        {...boxAttr}
        className={clsx(
          "flex",
          fullWidth && "w-full",
          "items-center",
          "justify-between",
          "gap-2",
          "bg-gray-100",
          "h-15",
          "py-4",
          "px-2",
          "rounded-md",
          "shadow-md",
          boxAttr?.className,
        )}
      >
        {icon ??
          (iconImage && (
            <Image
              src={iconImage.src}
              alt={iconImage.alt}
              width={24}
              height={24}
            />
          ))}
        <p ref={ref} className="block font-bold text-gray-700 font-mono">
          {text}
        </p>
      </div>
    </Tooltip>
  );
});
