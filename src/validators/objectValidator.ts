import { Schema, ValidationResult } from "../types";

function Object() {
  const rules: string;

  const schema: Schema<Record<string, unknown>> = {
    validate(
      input: Record<string, unknown>,
    ): ValidationResult<Record<string, unknown>> {
      if (typeof input !== "object") {
        return {
          valid: false,
          error: [
            {
              message: `Expected an object, got ${typeof input}`,
              path: [],
              type: "object required",
            },
          ],
        };
      }
      return { valid: true, data: input };
    },
  };

  return;
}
