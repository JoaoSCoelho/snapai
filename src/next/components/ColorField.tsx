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
import { ColorField as ColorFieldCls } from "@/simulator/configurations/layout/fields/ColorField";
import { debounce } from "../utils/debounce";

export type ColorFieldProps = FormFieldProps & {
  inputAttr?: MaterialTextFieldProps;
  formControlAttr?: FormControlProps;
  field: ColorFieldCls;
};

function ColorField({
  field,
  inputAttr,
  containerAttr,
  formControlAttr,
  control,
  register,
  nestedIn,
  onChange,
}: ColorFieldProps) {
  const nameAsArray = [nestedIn, field.name].filter(Boolean);
  const fullName = nameAsArray.join(".");
  const error = control.getFieldState(fullName)?.error?.message;
  const debouncedOnChange = onChange && debounce(onChange, 200);

  return (
    <div
      style={{ gridColumn: `span ${field.occupedColumns}` }}
      {...containerAttr}
    >
      <FormControl fullWidth {...formControlAttr}>
        <MaterialTextField
          variant="outlined"
          label={field.label}
          type="color"
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
          {...register(fullName, {
            onChange: (e) =>
              debouncedOnChange?.(field.name, fullName, e.target.value, false),
          })}
          {...inputAttr}
        />
      </FormControl>
    </div>
  );
}

export default ColorField;
