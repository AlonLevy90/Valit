interface ValidationError {
  message: string;
  path?: string[];
  type: ErrorType;
}

type message = [required: string, received: string];

type ErrorType = "required" | "typeMismatch" | "ruleViolation";

export { ErrorType, message, ValidationError };
