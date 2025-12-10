import { FormFieldProps } from "./FormField";
import { Controller, ControllerProps } from "react-hook-form";
import {
  Box,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@mui/material";
import clsx from "clsx";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { AnglePairField as AnglePairFieldCls } from "@/simulator/configurations/layout/fields/AnglePairField";
import AngleDropdown from "./AngleDropdown";
import { useState } from "react";
import { AngleUnit } from "@/simulator/utils/types";

export type AnglePairFieldProps = FormFieldProps & {
  field: AnglePairFieldCls;
  controllerAttr?: ControllerProps;
  inputAttr?: TextFieldProps;
};

export default function AnglePairField({
  control,
  field,
  containerAttr,
  inputAttr,
  nestedIn,
  onChange,
}: AnglePairFieldProps) {
  const nameAsArray = [nestedIn, field.name].filter(Boolean);
  const fullName = nameAsArray.join(".");
  const [focusedLeft, setFocusedLeft] = useState<boolean>(false);
  const [focusedRight, setFocusedRight] = useState<boolean>(false);

  return (
    <div
      style={{
        gridColumn: `span ${field.occupedColumns}`,
        position: "relative",
      }}
      {...containerAttr}
    >
      <Controller
        control={control}
        name={fullName}
        render={({ field: renderField, fieldState: { error } }) => {
          const [min, max] = renderField.value ?? ([0, 0] as [number, number]);
          const setMin = (val: number) => {
            renderField.onChange([val, max]);
            onChange?.(field.name, fullName, [val, max], false);
          };
          const setMax = (val: number) => {
            renderField.onChange([min, val]);
            onChange?.(field.name, fullName, [min, val], false);
          };
          return (
            <>
              <InputLabel
                shrink
                id={`input_label_${fullName}}`}
                className={clsx(
                  "ml-2",
                  "block",
                  "pl-2",
                  "-mb-4",
                  "bg-white",
                  "w-min",
                  "relative",
                  "z-10",
                )}
                style={{
                  padding: "0 8px",
                }}
              >
                {field.label}
              </InputLabel>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                }}
              >
                <TextField
                  type="number"
                  value={min}
                  sx={{
                    "& fieldset": { border: "none" },
                    flex: 1,
                  }}
                  slotProps={{
                    htmlInput: {
                      step: field.isFloat ? 0.0000000000000000001 : 1,
                      min: field.minLeft,
                      max: field.maxLeft,
                    },
                  }}
                  onFocus={() => setFocusedLeft(true)}
                  onBlur={() => setFocusedLeft(false)}
                  onChange={(e) => setMin(Number(e.target.value))}
                  error={!!error}
                  {...inputAttr}
                />
                {focusedLeft && (
                  <AngleDropdown
                    key="left"
                    angle={renderField.value?.[0]}
                    isDegrees={field.angleUnit === AngleUnit.DEG}
                    isFloat={field.isFloat}
                    maxValue={field.maxLeft}
                    minValue={field.minLeft}
                    onChange={(angle) => {
                      setMin(angle);
                    }}
                    onFocusAdjusments={() => setFocusedLeft(true)}
                    onBlurAdjusments={() => setFocusedLeft(false)}
                  />
                )}
                <Divider orientation="vertical" flexItem />
                <TextField
                  type="number"
                  value={max}
                  sx={{
                    "& fieldset": { border: "none" },
                    flex: 1,
                  }}
                  onFocus={() => setFocusedRight(true)}
                  onBlur={() => setFocusedRight(false)}
                  onChange={(e) => setMax(Number(e.target.value))}
                  slotProps={{
                    htmlInput: {
                      step: field.isFloat ? 0.0000000000000000001 : 1,
                      min: field.minRight,
                      max: field.maxRight,
                    },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip
                            arrow
                            placement="bottom-end"
                            title={field.info.helpText}
                          >
                            <IconButton disableTouchRipple sx={{ mr: "-8px" }}>
                              <HelpOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    },
                  }}
                  error={!!error}
                  {...inputAttr}
                />
                {focusedRight && (
                  <AngleDropdown
                    key="right"
                    angle={renderField.value?.[1]}
                    isDegrees={field.angleUnit === AngleUnit.DEG}
                    isFloat={field.isFloat}
                    maxValue={field.maxRight}
                    minValue={field.minRight}
                    onChange={(angle) => {
                      setMax(angle);
                    }}
                    onFocusAdjusments={() => setFocusedRight(true)}
                    onBlurAdjusments={() => setFocusedRight(false)}
                    alignment="right"
                  />
                )}
              </Box>
              {error?.message && (
                <FormHelperText className="block w-full" error>
                  {error.message}
                </FormHelperText>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
