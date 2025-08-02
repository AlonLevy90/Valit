import { errorBuilder } from "../error/errorBuilder";
import { StringSchema, ValidationResult } from "../types";

export default function stringValidator(): StringSchema {
  const rules: ((input: string) => ValidationResult<string> | undefined)[] = [];
  let isOptional = false;

  const schema: StringSchema = {
    //TODO extract common code with basic validators
    // TODO consider decorator for optional and other rule
    validate(input: string): ValidationResult<string> {
      if (isOptional && input === undefined) {
        return {
          valid: true,
          value: input,
        };
      } else if (input === undefined || input === null) {
        return {
          valid: false,
          error: [errorBuilder("required", ["string", typeof input], [])],
        };
      } else if (typeof input !== "string") {
        return {
          valid: false,
          error: [errorBuilder("typeMismatch", ["string", typeof input], [])],
        };
      }
      for (const rule of rules) {
        const result = rule(input);
        if (result) {
          return result;
        }
      }
      return {
        valid: true,
        value: input,
      };
    },
    min(min: number): StringSchema {
      rules.push((input: string) => {
        if (input.length < min) {
          return {
            valid: false,
            error: [
              errorBuilder(
                "ruleViolation",
                [`minimum of ${min} characters`, `${input.length} characters`],
                [],
              ),
            ],
          };
        }
        return;
      });
      return this;
    },
    max(max: number): StringSchema {
      rules.push((input: string) => {
        if (input.length > max) {
          return {
            valid: false,
            error: [
              errorBuilder(
                "ruleViolation",
                [`maximum of ${max} characters`, `${input.length} characters`],
                [],
              ),
            ],
          };
        }
        return;
      });
      return this;
    },
    optional(): StringSchema {
      isOptional = true;
      return this;
    },
  };
  return schema;
}
