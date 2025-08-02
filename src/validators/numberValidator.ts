import { errorBuilder } from "../error/errorBuilder";
import { NumberSchema, ValidationError } from "../types";

function numberValidator() {
  const rules: ((input: number) => ValidationError | undefined)[] = [];
  let isOptional = false;

  const schema: NumberSchema = {
    validate(input) {
      if (isOptional && input === undefined) {
        return { valid: true, input };
      } else if (!input || typeof input !== "number") {
        return {
          valid: false,
          error: [errorBuilder("required", ["number", typeof input], [])],
        };
      }
      for (const rule of rules) {
        const result = rule(input);
        if (result) {
          return { valid: false, error: [result] };
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
export default numberValidator;
