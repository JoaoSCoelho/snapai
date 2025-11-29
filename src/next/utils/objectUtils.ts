import { FieldErrors } from "react-hook-form";

export function flattenFormErrors(
  errors: FieldErrors<Record<string, any>>,
): Record<string, any> {
  return Object.entries(errors).reduce(
    (acc, [key, value]) => {
      if (value) {
        acc[key] = value.message ?? flattenFormErrors(value as any);
      }
      return acc;
    },
    {} as Record<string, any>,
  );
}
