import { toast } from "sonner";

export class ErrorSystem {
  /**
   * Emits an error to the console of the application and uses the toastError function.
   * @param message
   * @param description
   */
  public static emitError(
    error: any,
    message: string,
    description?: string,
  ): void {
    console.error(message, description, error);
    ErrorSystem.toastError(message, description);
  }

  /**
   * Displays an error toast using the sonner library
   * @param message
   * @param description
   */
  public static toastError(message: string, description?: string): void {
    toast.error(message, {
      description: description ?? "See console for more details",
    });
  }
}
