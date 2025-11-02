import {
  FormControl,
  FormControlProps,
  IconButton,
  InputAdornment,
  TextField as MaterialTextField,
  TextFieldProps as MaterialTextFieldProps,
  TextField as ColorField,
  Tooltip,
} from "@mui/material";
import { FormFieldProps } from "./FormField";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Field } from "@/simulator/configurations/layout/fields/Field";

export type ColorField = Field & {
  type: "color";
  value: `#${string}`;
};

export type ColorFieldProps = FormFieldProps & {
  inputAttr?: MaterialTextFieldProps;
  formControlAttr?: FormControlProps;
  field: ColorField;
};

function ColorField({
  field,
  fieldIndex,
  inputAttr,
  containerAttr,
  formControlAttr,
  nestedIn,
  control,
  register,
}: ColorFieldProps) {
  const nameAsArray = [...(nestedIn ?? []), field.name];
  const fullName = nameAsArray.join(".");
  const error = control.getFieldState(fullName)?.error?.message;

  return (
    <div
      key={fullName + fieldIndex}
      style={{ gridColumn: `span ${field.occupedColumns}` }}
      {...containerAttr}
    >
      <FormControl fullWidth {...formControlAttr}>
        <MaterialTextField
          variant="outlined"
          label={field.label}
          type={field.type}
          id={fullName}
          helperText={error}
          required={field.required}
          slotProps={{
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
          {...register(fullName)}
          {...inputAttr}
        />
      </FormControl>
    </div>
  );
}

export default ColorField;
