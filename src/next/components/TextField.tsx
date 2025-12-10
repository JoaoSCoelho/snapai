import {
  FormControl,
  FormControlProps,
  IconButton,
  InputAdornment,
  TextField as MaterialTextField,
  TextFieldProps as MaterialTextFieldProps,
  Tooltip,
} from "@mui/material";
import { FormFieldProps } from "./FormField";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { TextField as TextFieldCls } from "@/simulator/configurations/layout/fields/TextField";

export type TextFieldProps = FormFieldProps & {
  inputAttr?: MaterialTextFieldProps;
  formControlAttr?: FormControlProps;
  field: TextFieldCls;
};

function TextField({
  field,
  inputAttr,
  containerAttr,
  formControlAttr,
  nestedIn,
  control,
  register,
  onChange,
}: TextFieldProps) {
  const nameAsArray = [nestedIn, field.name].filter(Boolean);
  const fullName = nameAsArray.join(".");
  const error = control.getFieldState(fullName).error?.message;

  return (
    <div
      style={{ gridColumn: `span ${field.occupedColumns}` }}
      {...containerAttr}
    >
      <FormControl fullWidth {...formControlAttr}>
        <MaterialTextField
          variant="outlined"
          label={field.label}
          type="text"
          id={fullName}
          helperText={error}
          required={field.required}
          slotProps={{
            formHelperText: { error: true },
            htmlInput: {
              minLength: field.minLength,
              maxLength: field.maxLength,
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
          {...register(fullName, {
            onChange: (e) =>
              onChange?.(field.name, fullName, e.target.value, false),
          })}
          {...inputAttr}
        />
      </FormControl>
    </div>
  );
}

export default TextField;
