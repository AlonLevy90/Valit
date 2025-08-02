import { errorBuilder } from "../error/errorBuilder";
import { BooleanSchema } from "../types";

function BooleanValidator() {
  const rules: ((value: unknown) => string | undefined)[] = [];
  let isOptional = false;

  const validator: BooleanSchema = {
    validate(input) {
      if (isOptional && !input) {
        return { valid: true, input };
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
      return { valid: true, input };
    },
    optional() {
      isOptional = true;
      return validator;
    },
  };
  return validator;
}
export default BooleanValidator;
