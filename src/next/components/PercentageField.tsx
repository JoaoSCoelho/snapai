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
import { PercentageField as PercentageFieldCls } from "@/simulator/configurations/layout/fields/PercentageField";

type PercentageFieldProps = FormFieldProps & {
  field: PercentageFieldCls;
  formControlAttr?: FormControlProps;
  inputAttr?: TextFieldProps;
};

export default function PercentageField({
  field,
  register,
  containerAttr,
  nestedIn,
  formControlAttr,
  inputAttr,
  control,
  onChange,
}: PercentageFieldProps) {
  const nameAsArray = [nestedIn, field.name].filter(Boolean);
  const fullName = nameAsArray.join(".");
  const error = control.getFieldState(fullName)?.error?.message;

  return (
    <div
      style={{ gridColumn: `span ${field.occupedColumns}` }}
      {...containerAttr}
    >
      <FormControl fullWidth {...formControlAttr}>
        <TextField
          variant="outlined"
          label={field.label}
          type={"number"}
          slotProps={{
            formHelperText: { error: true },
            htmlInput: {
              step: field.isFloat ? 0.0000000000000000001 : 1,
              min: field.min,
              max: field.max,
            },
            input: {
              endAdornment: (
                <>
                  <InputAdornment position="end">%</InputAdornment>
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
                </>
              ),
            },
          }}
          helperText={error}
          id={fullName}
          required={field.required}
          {...register(fullName, {
            valueAsNumber: true,
            onChange: (e) =>
              onChange?.(field.name, fullName, e.target.value, false),
          })}
          {...inputAttr}
        />
      </FormControl>
    </div>
  );
}
