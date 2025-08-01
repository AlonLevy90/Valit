import { Validator } from "../types";
import markOptional from "./baseValidator";

function BooleanValidator() {
  const rules: ((value: unknown) => string | undefined)[] = [];

  const validator: Validator<boolean> = {
    validate(value: unknown) {
      if (typeof value !== "boolean") {
        return {
          valid: false,
          error: `expected boolean, received ${typeof value}`,
        };
      }
      for (const rule of rules) {
        const error = rule(value);
        if (error) {
          return { valid: false, errors: error };
        }
      }
      return { valid: true, data: value };
    },
  };

  const builder = {
    optional() {
      return markOptional(validator);
    },
  };
}
export default BooleanValidator;
