import { FormFieldProps } from "./FormField";
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormControlProps,
  FormHelperText,
  IconButton,
  Tooltip,
} from "@mui/material";
import clsx from "clsx";
import { Controller } from "react-hook-form";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Field } from "@/simulator/configurations/layout/fields/Field";

export type CheckboxField = Field & {
  type: "checkbox";
  value: boolean;
};

export type CheckboxFieldProps = FormFieldProps & {
  field: CheckboxField;
  checkboxAttr?: CheckboxProps;
  formControlAttr?: FormControlProps;
  formControlLabelAttr?: FormControlLabelProps;
};

export default function CheckboxField({
  field,
  fieldIndex,
  containerAttr,
  checkboxAttr,
  formControlAttr,
  formControlLabelAttr,
  nestedIn,
  control,
}: CheckboxFieldProps) {
  const nameAsArray = [...(nestedIn ?? []), field.name];
  const fullName = nameAsArray.join(".");
  const error = control.getFieldState(fullName)?.error?.message;

  return (
    <div
      key={fullName + fieldIndex}
      style={{ gridColumn: `span ${field.occupedColumns}` }}
      {...containerAttr}
    >
      <FormControl
        sx={{
          px: 1.5,
          border: "1px solid #ccc",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          height: "100%",
          minHeight: "56px",
        }}
        variant="outlined"
        fullWidth
        {...formControlAttr}
        className={clsx("h-full", formControlAttr?.className)}
      >
        <Controller
          name={fullName}
          control={control}
          render={({ field: controllerField }) => {
            return (
              <FormControlLabel
                title={field.info.title}
                control={
                  <Checkbox
                    required={field.required}
                    id={fullName}
                    checked={controllerField.value ?? false}
                    onChange={(e) => {
                      controllerField.onChange(e.target.checked);
                    }}
                    {...checkboxAttr}
                  />
                }
                label={
                  <>
                    {field.label}
                    {field.required && <span className="opacity-60">*</span>}
                  </>
                }
                {...formControlLabelAttr}
              />
            );
          }}
        />

        <Tooltip arrow placement="bottom-end" title={field.info.helpText}>
          <IconButton disableTouchRipple sx={{ mr: "-8px" }}>
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </FormControl>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  );
}
