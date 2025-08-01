import { Validator } from "../types";
import markOptional from "./baseValidator";

function numberValidator() {
  const rules: ((value: number) => string | undefined)[] = [];

  const validator: Validator<number> = {
    validate(value: unknown) {
      if (typeof value !== "number") {
        return {
          valid: false,
          error: `Expected a number, got ${typeof value}`,
        };
      }
      for (const rule of rules) {
        const error = rule(value);
        if (error) {
          return { valid: false, error };
        }
      }
      return { valid: true, value };
    },
  };

  const builder = {
    min(min: number) {
      rules.push((value) => {
        if (value < min) {
          return `Expected a number greater than or equal to ${min}, got ${value}`;
        }
        return undefined;
      });
      return builder;
    },
    max(max: number) {
      rules.push((value) => {
        if (value > max) {
          return `Expected a number less than or equal to ${max}, got ${value}`;
        }
        return undefined;
      });
      return builder;
    },
    optional() {
      return markOptional(validator);
    },
  };
}

export default numberValidator;
