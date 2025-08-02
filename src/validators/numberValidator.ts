import { errorBuilder } from "../error/errorBuilder";
import { NumberSchema, ValidationError } from "../types";

export default function numberValidator() {
  const rules: ((input: number) => ValidationError | undefined)[] = [];
  let isOptional = false;

  const schema: NumberSchema = {
    validate(input) {
      if (isOptional && !input) {
        return { valid: true, input };
      } else if (!input) {
        return {
          valid: false,
          error: [errorBuilder("required", ["number", typeof input], [])],
        };
      }
      if (typeof input !== "number") {
        return {
          valid: false,
          error: [errorBuilder("typeMismatch", ["number", typeof input], [])],
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
    min(min: number) {
      rules.push((input: number) => {
        if (input < min) {
          return errorBuilder(
            "ruleViolation",
            [`minimum of ${min}`, input.toString()],
            [],
          );
        }
        return undefined;
      });
      return schema;
    },
    max(max: number) {
      rules.push((input: number) => {
        if (input > max) {
          return errorBuilder(
            "ruleViolation",
            [`maximum of ${max}`, input.toString()],
            [],
          );
        }
        return undefined;
      });
      return schema;
    },
    optional() {
      isOptional = true;
      return schema;
    },
  };
  return schema;
}
