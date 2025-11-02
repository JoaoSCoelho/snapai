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
import { Field } from "@/simulator/configurations/layout/fields/Field";

export type MultiSelectField = Field & {
  type: "multiselect";
  value: unknown[];
  options: { value: unknown; label: string }[];
  min_selected: number;
  max_selected: number | null;
};

export type MultiSelectFieldProps = FormFieldProps & {
  field: MultiSelectField;
  formControlAttr?: FormControlProps;
  selectAttr?: SelectProps;
};

export default function MultiSelectField({
  nestedIn,
  field,
  control,
  selectAttr,
  formControlAttr,
  fieldIndex,
  containerAttr,
}: MultiSelectFieldProps) {
  const nameAsArray = [...(nestedIn ?? []), field.name];
  const fullName = nameAsArray.join(".");

  return (
    <div
      key={fullName + fieldIndex}
      style={{ gridColumn: `span ${field.occupedColumns}` }}
      {...containerAttr}
    >
      <FormControl fullWidth {...formControlAttr}>
        <InputLabel id={fullName + "__label"}>{field.label}</InputLabel>
        <Controller
          name={fullName}
          control={control}
          defaultValue={field.value ?? []}
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
