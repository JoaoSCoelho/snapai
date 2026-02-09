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
import { AngleUnit } from "@/simulator/utils/types";
import { debounce } from "../utils/debounce";
import { GiCancel } from "react-icons/gi";

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
  nestedIn,
  control,
  onChange,
}: NumberFieldProps) {
  const nameAsArray = [nestedIn, field.name].filter(Boolean);
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
                  onChange?.(
                    field.name,
                    fullName,
                    Number(e.target.value),
                    false,
                  );
                }}
                onFocus={() => {
                  setFocused(true);
                }}
                onBlur={() => {
                  setFocused(false);
                }}
                value={controllerField.value}
                slotProps={{
                  htmlInput: {
                    step: field.isFloat ? 0.0000000000000000001 : 1,
                    min: field.min,
                    max: field.max,
                  },
                  formHelperText: {
                    error: true,
                  },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {!field.required && (
                          <IconButton
                            sx={{ mr: "-8px" }}
                            onClick={() => {
                              controllerField.onChange("");
                              onChange?.(field.name, fullName, "", false);
                            }}
                            type="button"
                            title="Clear input"
                          >
                            <GiCancel fontSize="large" />
                          </IconButton>
                        )}
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
                isDegrees={field.angleUnit === AngleUnit.DEG}
                isFloat={field.isFloat}
                maxValue={field.max}
                minValue={field.min}
                onChange={(angle) => {
                  controllerField.onChange(angle);
                  debounce(
                    () => onChange?.(field.name, fullName, angle, true),
                    100,
                  );
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
