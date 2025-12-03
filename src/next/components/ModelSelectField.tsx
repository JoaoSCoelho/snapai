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
import { ModelSelectField as ModelSelectFieldCls } from "@/simulator/configurations/layout/fields/ModelSelectField";

export type ModelSelectFieldProps = FormFieldProps & {
  field: ModelSelectFieldCls;
  formControlAttr?: FormControlProps;
  selectAttr?: SelectProps;
  onModelNameChange?: (name: string, fullName: string, value: string) => void;
};

export default function ModelSelectField({
  field,
  control,
  selectAttr,
  formControlAttr,
  nestedIn,
  containerAttr,
  onModelNameChange,
}: ModelSelectFieldProps) {
  const nameAsArray = [nestedIn, field.name].filter(Boolean);
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
                {...controllerField}
                {...selectAttr}
                onChange={(e, child) => {
                  onModelNameChange?.(
                    field.name,
                    fullName,
                    e.target.value as string,
                  );
                  controllerField.onChange(e, child);
                  selectAttr?.onChange?.(e, child);
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
              >
                {(Array.isArray(field.options)
                  ? field.options
                  : field.options()
                ).map(({ value, label }, optionIndex) => (
                  <MenuItem key={`${value}_${optionIndex}`} value={value}>
                    {label}
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
