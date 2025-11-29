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
}: AnglePairFieldProps) {
  const nameAsArray = [nestedIn, field.name];
  const fullName = nameAsArray.join(".");
  const [focusedLeft, setFocusedLeft] = useState<boolean>(false);
  const [focusedRight, setFocusedRight] = useState<boolean>(false);

  return (
    <div
      style={{ gridColumn: `span ${field.occupedColumns}` }}
      {...containerAttr}
    >
      <Controller
        control={control}
        name={fullName}
        render={({ field: renderField, fieldState: { error } }) => {
          const [min, max] = renderField.value ?? ([0, 0] as [number, number]);
          const setMin = (val: number) => {
            renderField.onChange([val, max]);
          };
          const setMax = (val: number) => {
            renderField.onChange([min, val]);
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
                      min: field.minLeft,
                      max: field.maxLeft,
                    },
                  }}
                  onChange={(e) => setMin(Number(e.target.value))}
                  error={!!error}
                  {...inputAttr}
                />
                {focusedLeft && (
                  <AngleDropdown
                    angle={renderField.value[0]}
                    isDegrees={field.angleUnit === "deg"}
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
                  slotProps={{
                    htmlInput: {
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
                  onChange={(e) => setMax(Number(e.target.value))}
                  error={!!error}
                  {...inputAttr}
                />
                {focusedLeft && (
                  <AngleDropdown
                    angle={renderField.value[1]}
                    isDegrees={field.angleUnit === "deg"}
                    isFloat={field.isFloat}
                    maxValue={field.maxRight}
                    minValue={field.minRight}
                    onChange={(angle) => {
                      setMax(angle);
                    }}
                    onFocusAdjusments={() => setFocusedRight(true)}
                    onBlurAdjusments={() => setFocusedRight(false)}
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
