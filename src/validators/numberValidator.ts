import { NumberSchema } from "../types";

function numberValidator() {
  const rules: ((value: number) => string | undefined)[] = [];
  const isOptional = false;

  const schema: NumberSchema = {
    validate(value: number) {
      if (isOptional && value === undefined) {
        return { valid: true, value };
      } else if (!value) {
        return {
          valid: false,
          error: [
            {
              message: `Expected a number, got ${typeof value}`,
              path: [],
              type: "required",
            },
          ],
        };
      }
      if (typeof value !== "number") {
        return {
          valid: false,
          error: [
            {
              message: `Expected a number, got ${typeof value}`,
              path: [],
              type: "",
            },
          ],
        };
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
