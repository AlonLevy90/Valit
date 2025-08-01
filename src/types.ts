interface ValidationError {
  message: string;
  path: string[];
  type: string;
}

interface ValidationResult<T> {
  valid: boolean;
  error?: ValidationError[];
  value?: unknown;
  data?: T;
}

interface Schema<T> {
  validate(input: T): ValidationResult<T>;
}

interface StringSchema extends Schema<string> {
  min(min: number): StringSchema;
  max(max: number): StringSchema;
  optional(): StringSchema;
}

export { Schema, StringSchema, ValidationError, ValidationResult };
