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
import { NumberField as NumberFieldCls } from "@/simulator/configurations/layout/fields/NumberField";

type NumberFieldProps = FormFieldProps & {
  field: NumberFieldCls;
  formControlAttr?: FormControlProps;
  inputAttr?: TextFieldProps;
};

export default function NumberField({
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
                  onChange?.(field.name, fullName, e.target.value, false);
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
          </>
        )}
      ></Controller>
    </div>
  );
}
