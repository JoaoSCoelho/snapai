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
import { NodeSelectField as NodeSelectFieldCls } from "@/simulator/configurations/layout/fields/NodeSelectField";
import { SearchEngine } from "@/simulator/utils/SearchEngine";

export type NodeSelectFieldProps = FormFieldProps & {
  field: NodeSelectFieldCls;
  formControlAttr?: FormControlProps;
  selectAttr?: SelectProps;
  onNodeNameChange?: (name: string, fullName: string, value: string) => void;
};

export default function NodeSelectField({
  field,
  control,
  selectAttr,
  formControlAttr,
  containerAttr,
  nestedIn,
  onNodeNameChange,
}: NodeSelectFieldProps) {
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
                  onNodeNameChange?.(
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
                {SearchEngine.getPrefixedNodesNames().map(
                  (option, optionIndex) => (
                    <MenuItem key={`${option}_${optionIndex}`} value={option}>
                      {option}
                    </MenuItem>
                  ),
                )}
              </Select>
              {error && <FormHelperText error>{error.message}</FormHelperText>}
            </>
          )}
        />
      </FormControl>
    </div>
  );
}
