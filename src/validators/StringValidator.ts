import { errorBuilder } from "../error/errorBuilder";
import { Schema, StringSchema, ValidationResult } from "../types";

export function string(): Schema<string> {
  const rules: ((input: string) => ValidationResult<string> | undefined)[] = [];
  let isOptional = false;

  const schema: StringSchema = {
    validate(input: string): ValidationResult<string> {
      if (isOptional && input === undefined) {
        return {
          valid: true,
          value: input,
        };
      } else if (!input || typeof input !== "string") {
        return {
          valid: false,
          error: [errorBuilder("required", ["string", typeof input], [])],
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
