import { ValidationError } from "./error/errorType";

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

interface NumberSchema extends Schema<number> {
  min(min: number): NumberSchema;
  max(max: number): NumberSchema;
  optional(): NumberSchema;
}

interface BooleanSchema extends Schema<boolean> {
  optional(): BooleanSchema;
}

export {
  BooleanSchema,
  NumberSchema,
  Schema,
  StringSchema,
  ValidationError,
  ValidationResult,
};
