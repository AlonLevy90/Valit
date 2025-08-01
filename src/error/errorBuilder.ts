import { ErrorType, ValidationError, message } from "./errorType";

export function errorBuilder(
  errorType: ErrorType,
  message: message,
  path: string[],
): ValidationError {
  return {
    type: errorType,
    message: `required: ${message[0]}, received: ${message[1]}`,
    path,
  };
}
