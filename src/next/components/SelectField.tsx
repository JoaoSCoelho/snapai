import { FormFieldProps } from "./FormField";
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  Tooltip,
} from "@mui/material";
import { Controller } from "react-hook-form";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { SelectField as SelectFieldCls } from "@/simulator/configurations/layout/fields/SelectField";

export type SelectFieldProps = FormFieldProps & {
  field: SelectFieldCls;
  formControlAttr?: FormControlProps;
  selectAttr?: SelectProps;
};

export default function SelectField({
  field,
  control,
  selectAttr,
  formControlAttr,
  nestedIn,
  containerAttr,
}: SelectFieldProps) {
  const nameAsArray = [nestedIn, field.name];
  const fullName = nameAsArray.join(".");

  return (
    <div
      style={{ gridColumn: `span ${field.occupedColumns}` }}
      {...containerAttr}
    >
      <FormControl fullWidth {...formControlAttr}>
        <InputLabel id={fullName + "__label"}>{field.label}</InputLabel>
        <Controller
          name={fullName}
          control={control}
          rules={{ required: field.required }}
          render={({ field: controllerField, fieldState: { error } }) => (
            <>
              <Select
                labelId={fullName + "__label"}
                variant="outlined"
                label={field.label}
                id={fullName}
                value={controllerField.value ?? ""}
                onChange={(e) => {
                  controllerField.onChange(e);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <Tooltip
                      arrow
                      placement="bottom-end"
                      title={field.info.helpText}
                    >
                      <IconButton disableTouchRipple sx={{ mr: "16px" }}>
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                }
                {...selectAttr}
              >
                {field.options.map((option, optionIndex) => (
                  <MenuItem
                    key={`${option.value}_${optionIndex}`}
                    value={option.value as string | number}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {error && <FormHelperText error>{error.message}</FormHelperText>}
            </>
          )}
        />
      </FormControl>
    </div>
  );
}
