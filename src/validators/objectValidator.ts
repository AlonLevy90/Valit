import { errorBuilder } from "../error/errorBuilder";
import { objectProps, ObjectSchema, ValidationResult } from "../types";

export default function objectValidator(props: objectProps): ObjectSchema {
  let isOptional = false;

  const schema: ObjectSchema = {
    validate(
      input: Record<string, unknown>,
    ): ValidationResult<Record<string, unknown>> {
      if (isOptional && !input) {
        return { valid: true, data: input };
      } else if (!input) {
        return {
          valid: false,
          error: [errorBuilder("typeMismatch", ["object", typeof input], [])],
        };
      }
      if (typeof input !== "object") {
        return {
          valid: false,
          error: [errorBuilder("typeMismatch", ["object", typeof input], [])],
        };
      }
      for (const [key, validator] of Object.entries(props)) {
        const result = validator.validate(input[key]);
        if (result.error) {
          console.log("in result");
          result.error.forEach((error) => {
            error.path.unshift(key);
          });
          return { valid: false, error: result.error };
        }
      }
      return { valid: true, data: input };
    },
    optional() {
      isOptional = true;
      return this;
    },
  };

  return schema;
}
