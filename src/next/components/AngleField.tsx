import {
  FormControl,
  FormControlProps,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@mui/material";
import { FormFieldProps } from "./FormField";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Controller } from "react-hook-form";
import clsx from "clsx";
import { useState } from "react";
import AngleDropdown from "./AngleDropdown";
import { AngleField as AngleFieldCls } from "@/simulator/configurations/layout/fields/AngleField";

type NumberFieldProps = FormFieldProps & {
  field: AngleFieldCls;
  formControlAttr?: FormControlProps;
  inputAttr?: TextFieldProps;
};

export default function AngleField({
  field,
  containerAttr,
  formControlAttr,
  inputAttr,
  control,
  nestedIn,
}: NumberFieldProps) {
  const nameAsArray = [...(nestedIn ?? []), field.name];
  const fullName = nameAsArray.join(".");
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <div
      style={{ gridColumn: `span ${field.occupedColumns}` }}
      {...containerAttr}
      className={clsx("relative", containerAttr?.className)}
    >
      <Controller
        name={fullName}
        control={control}
        rules={{ required: field.required }}
        render={({ field: controllerField, fieldState: { error } }) => (
          <>
            <FormControl fullWidth {...formControlAttr}>
              <TextField
                variant="outlined"
                label={field.label}
                type="number"
                helperText={error?.message}
                onChange={(e) => {
                  controllerField.onChange(Number(e.target.value));
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                value={controllerField.value}
                slotProps={{
                  htmlInput: {
                    step: "any",
                    min: field.min,
                    max: field.max,
                  },
                  formHelperText: {
                    error: true,
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
                id={fullName}
                required={field.required}
                {...inputAttr}
              />
            </FormControl>
            {focused && (
              <AngleDropdown
                angle={controllerField.value}
                isDegrees={field.angleUnit === "deg"}
                is_float={field.isFloat}
                max_value={field.max}
                min_value={field.min}
                onChange={(angle) => {
                  controllerField.onChange(angle);
                }}
                onFocusAdjusments={() => setFocused(true)}
                onBlurAdjusments={() => setFocused(false)}
              />
            )}
          </>
        )}
      ></Controller>
    </div>
  );
}
