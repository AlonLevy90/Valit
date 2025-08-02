import { errorBuilder } from "../error/errorBuilder";
import { BooleanSchema, ValidationError, ValidationResult } from "../types";

export default function BooleanValidator() {
  const rules: ((value: unknown) => ValidationError | undefined)[] = [];
  let isOptional = false;

  const validator: BooleanSchema = {
    validate(input): ValidationResult<boolean> {
      if (isOptional && !input) {
        return { valid: true, value: input };
      } else if (!input) {
        return {
          valid: false,
          error: [errorBuilder("required", ["boolean", typeof input], [])],
        };
      }
      if (typeof input !== "boolean") {
        return {
          valid: false,
          error: [errorBuilder("typeMismatch", ["boolean", typeof input], [])],
        };
      }
      for (const rule of rules) {
        const error = rule(input);
        if (error) {
          return { valid: false, error: [error] };
        }
      }
      return { valid: true, value: input };
    },
    optional() {
      isOptional = true;
      return validator;
    },
  };
  return validator;
}
