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
import clsx from "clsx";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { MultiSelectField as MultiSelectFieldCls } from "@/simulator/configurations/layout/fields/MultiSelectField";

export type MultiSelectFieldProps = FormFieldProps & {
  field: MultiSelectFieldCls;
  formControlAttr?: FormControlProps;
  selectAttr?: SelectProps;
};

export default function MultiSelectField({
  field,
  control,
  selectAttr,
  formControlAttr,
  nestedIn,
  containerAttr,
  onChange,
}: MultiSelectFieldProps) {
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
                multiple
                variant="outlined"
                label={field.label}
                id={fullName}
                value={controllerField.value || []}
                onChange={(e) => {
                  controllerField.onChange(e);
                  onChange?.(field.name, fullName, e.target.value, false);
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
                className={clsx(selectAttr?.className, "h-full")}
              >
                {(Array.isArray(field.options)
                  ? field.options
                  : field.options()
                ).map((option, optionIndex) => (
                  <MenuItem
                    key={`${option.value}_${optionIndex}`}
                    value={option.value}
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
