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
import { NumberTripleField as NumberTripleFieldCls } from "@/simulator/configurations/layout/fields/NumberTripleField";

export type NumberTripleFieldProps = FormFieldProps & {
  field: NumberTripleFieldCls;
  controllerAttr?: ControllerProps;
  inputAttr?: TextFieldProps;
};

export default function NumberTripleField({
  control,
  field,
  containerAttr,
  nestedIn,
  inputAttr,
  onChange,
}: NumberTripleFieldProps) {
  const nameAsArray = [nestedIn, field.name].filter(Boolean);
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
          const [first, middle, last] =
            renderField.value ?? ([0, 0, 0] as const);
          const setFirst = (val: number) => {
            renderField.onChange([val, middle, last]);
            onChange?.(field.name, fullName, [val, middle, last], false);
          };
          const setMiddle = (val: number) => {
            renderField.onChange([first, val, last]);
            onChange?.(field.name, fullName, [first, val, last], false);
          };
          const setLast = (val: number) => {
            renderField.onChange([first, middle, val]);
            onChange?.(field.name, fullName, [first, middle, val], false);
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
                  value={first}
                  sx={{
                    "& fieldset": { border: "none" },
                    flex: 1,
                  }}
                  slotProps={{
                    htmlInput: {
                      step: field.isFloat ? 0.0000000000000000001 : 1,
                      min: field.minFirst,
                      max: field.maxFirst,
                    },
                  }}
                  onChange={(e) => setFirst(Number(e.target.value))}
                  error={!!error}
                  {...inputAttr}
                />
                <Divider orientation="vertical" flexItem />
                <TextField
                  type="number"
                  value={middle}
                  sx={{
                    "& fieldset": { border: "none" },
                    flex: 1,
                  }}
                  slotProps={{
                    htmlInput: {
                      step: field.isFloat ? 0.0000000000000000001 : 1,
                      min: field.minMiddle,
                      max: field.maxMiddle,
                    },
                  }}
                  onChange={(e) => setMiddle(Number(e.target.value))}
                  error={!!error}
                  {...inputAttr}
                />
                <Divider orientation="vertical" flexItem />
                <TextField
                  type="number"
                  value={last}
                  sx={{
                    "& fieldset": { border: "none" },
                    flex: 1,
                  }}
                  slotProps={{
                    htmlInput: {
                      step: field.isFloat ? 0.0000000000000000001 : 1,
                      min: field.minLast,
                      max: field.maxLast,
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
                  onChange={(e) => setLast(Number(e.target.value))}
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
