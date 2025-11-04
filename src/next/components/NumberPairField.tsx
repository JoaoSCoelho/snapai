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
import { NumberPairField as NumberPairFieldCls } from "@/simulator/configurations/layout/fields/NumberPairField";

export type NumberPairFieldProps = FormFieldProps & {
  field: NumberPairFieldCls;
  controllerAttr?: ControllerProps;
  inputAttr?: TextFieldProps;
};

export default function NumberPairField({
  control,
  field,
  containerAttr,
  inputAttr,
  nestedIn,
}: NumberPairFieldProps) {
  const nameAsArray = [...(nestedIn ?? []), field.name];
  const fullName = nameAsArray.join(".");

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
