import { forwardRef, useState } from "react";
import { Slider } from "@mui/material";
import AngleSlider from "./AngleSlider";
import clsx from "clsx";

export type AngleDropdownProps = {
  angle: number;
  isFloat: boolean;
  isDegrees: boolean;
  minValue: number | null;
  maxValue: number | null;
  onChange?: (angle: number) => any;
  onFocusAdjusments?: () => any;
  onBlurAdjusments?: () => any;
  alignment?: "left" | "right";
};

const AngleDropdown = forwardRef<unknown, AngleDropdownProps>(
  (
    {
      minValue,
      maxValue,
      isFloat,
      angle = 0,
      onChange,
      isDegrees,
      onFocusAdjusments,
      onBlurAdjusments,
      alignment,
    },
    ref,
  ) => {
    const step = isFloat ? 0.01 : 1;
    const [fineAdjustment, setFineAdjustment] = useState(step);
    return (
      <div
        className={clsx(
          "pb-20 top-full absolute w-full max-w-2xs min-w-44 z-10 ",
          alignment === "right" ? "right-0" : "left-0",
        )}
      >
        <div className="w-full max-w-2xs min-w-44 z-10 border border-gray-300 mt-1 bg-white">
          <AngleSlider
            fineAdjustment={fineAdjustment}
            scrollStep={1}
            onChange={(angle) => {
              if (minValue !== null && angle < minValue) angle = minValue;
              if (maxValue !== null && angle > maxValue) angle = maxValue;
              onChange?.(angle);
            }}
            angle={angle}
            isDegrees={isDegrees}
          />
          <div className="adjustments-form flex flex-col gap-1 mb-2">
            <div className="flex flex-col px-3">
              <label htmlFor="angle_dropdown_fine_adjust">Fine adjusment</label>
              <div className="flex items-center gap-1.5">
                <Slider
                  onFocus={onFocusAdjusments}
                  onBlur={onBlurAdjusments}
                  defaultValue={1 * step}
                  onChange={(_, value) => setFineAdjustment(value)}
                  min={0.01 * Math.min(step, 1)}
                  max={3 * Math.max(step, 1)}
                  step={0.1 * step}
                />
                <span className="text-center w-14">{fineAdjustment}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default AngleDropdown;
