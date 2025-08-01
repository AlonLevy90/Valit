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
      } else if (input === undefined) {
        return {
          valid: false,
          error: [{ message: "Required", path: [], type: "required" }],
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
              {
                message: `Must be at least ${min} characters`,
                path: [],
                type: "min",
              },
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
              {
                message: `Must be at most ${max} characters`,
                path: [],
                type: "max",
              },
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
