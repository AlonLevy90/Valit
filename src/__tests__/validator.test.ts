// Simple test runner without external dependencies
import {
  BooleanValidator,
  NumberValidator,
  StringValidator,
  validate,
} from "../validators";

// Test utilities
function assertEqual(actual: any, expected: any, message: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${message}\nExpected: ${JSON.stringify(
        expected,
      )}\nActual: ${JSON.stringify(actual)}`,
    );
  }
}

function assertTrue(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFalse(condition: boolean, message: string) {
  if (condition) {
    throw new Error(message);
  }
}

function assertThrows(fn: () => void, expectedError: string) {
  try {
    fn();
    throw new Error(
      `Expected function to throw "${expectedError}" but it didn't throw`,
    );
  } catch (error: any) {
    if (!error.message.includes(expectedError)) {
      throw new Error(
        `Expected error to contain "${expectedError}" but got "${error.message}"`,
      );
    }
  }
}

// Test results
let passedTests = 0;
let failedTests = 0;

function runTest(testName: string, testFn: () => void) {
  try {
    testFn();
    console.log(`✅ ${testName}`);
    passedTests++;
  } catch (error: any) {
    console.log(`❌ ${testName}: ${error.message}`);
    failedTests++;
  }
}

console.log("🧪 Running Validator Tests...\n");

// StringValidator Tests
console.log("📝 StringValidator Tests:");

runTest("should validate string with maxLength", () => {
  const validator = new StringValidator("hello", "Name");
  const result = validator.maxLength(10).validate();
  assertTrue(
    result.isValid === true,
    "Should be valid when string is within max length",
  );
  assertEqual(result.errors.length, 0, "Should have no errors");
});

runTest("should fail when string exceeds maxLength", () => {
  const validator = new StringValidator("hello world", "Name");
  const result = validator.maxLength(5).validate();
  assertTrue(
    result.isValid === false,
    "Should be invalid when string exceeds max length",
  );
  assertEqual(result.errors.length, 1, "Should have one error");
  assertTrue(
    result.errors[0].includes("greater than max length"),
    "Error message should mention max length",
  );
});

runTest("should handle undefined optional field", () => {
  const validator = new StringValidator(undefined, "Name");
  const result = validator.optional().maxLength(10).validate();
  assertTrue(
    result.isValid === true,
    "Should be valid for optional undefined field",
  );
  assertEqual(result.errors.length, 0, "Should have no errors");
});

runTest("should fail undefined required field", () => {
  const validator = new StringValidator(undefined, "Name");
  const result = validator.required().maxLength(10).validate();
  assertTrue(
    result.isValid === false,
    "Should be invalid for required undefined field",
  );
  assertEqual(result.errors.length, 1, "Should have one error");
  assertTrue(
    result.errors[0].includes("required"),
    "Error message should mention required",
  );
});

runTest("should chain validation methods", () => {
  const validator = new StringValidator("hello", "Name");
  const result = validator.required().maxLength(10).validate();
  assertTrue(result.isValid === true, "Should be valid when chaining methods");
});

// NumberValidator Tests
console.log("\n🔢 NumberValidator Tests:");

runTest("should validate number with min", () => {
  const validator = new NumberValidator(10, "Age");
  const result = validator.min(5).validate();
  assertTrue(
    result.isValid === true,
    "Should be valid when number is above minimum",
  );
  assertEqual(result.errors.length, 0, "Should have no errors");
});

runTest("should fail when number is below min", () => {
  const validator = new NumberValidator(3, "Age");
  const result = validator.min(5).validate();
  assertTrue(
    result.isValid === false,
    "Should be invalid when number is below minimum",
  );
  assertEqual(result.errors.length, 1, "Should have one error");
  assertTrue(
    result.errors[0].includes("less than minimum"),
    "Error message should mention minimum",
  );
});

runTest("should validate number with max", () => {
  const validator = new NumberValidator(10, "Age");
  const result = validator.max(15).validate();
  assertTrue(
    result.isValid === true,
    "Should be valid when number is below maximum",
  );
  assertEqual(result.errors.length, 0, "Should have no errors");
});

runTest("should fail when number exceeds max", () => {
  const validator = new NumberValidator(20, "Age");
  const result = validator.max(15).validate();
  assertTrue(
    result.isValid === false,
    "Should be invalid when number exceeds maximum",
  );
  assertEqual(result.errors.length, 1, "Should have one error");
  assertTrue(
    result.errors[0].includes("greater than maximum"),
    "Error message should mention maximum",
  );
});

runTest("should handle undefined optional number", () => {
  const validator = new NumberValidator(undefined, "Age");
  const result = validator.optional().min(5).validate();
  assertTrue(
    result.isValid === true,
    "Should be valid for optional undefined number",
  );
  assertEqual(result.errors.length, 0, "Should have no errors");
});

// BooleanValidator Tests
console.log("\n🔘 BooleanValidator Tests:");

runTest("should create boolean validator", () => {
  const validator = new BooleanValidator(true, "Active");
  assertTrue(
    validator instanceof BooleanValidator,
    "Should create BooleanValidator instance",
  );
});

runTest("should handle undefined boolean", () => {
  const validator = new BooleanValidator(undefined, "Active");
  const result = validator.validate();
  assertTrue(
    result.isValid === undefined,
    "Should have undefined validity for new validator",
  );
});

// Schema Validation Tests
console.log("\n📋 Schema Validation Tests:");

runTest("should validate simple schema", () => {
  const schema = {
    name: new StringValidator("John", "Name").required().maxLength(10),
    age: new NumberValidator(25, "Age").required().min(18).max(100),
  };

  const result = validate(schema, { name: "John", age: 25 });
  assertTrue(result.isValid === true, "Should be valid for correct data");
  assertEqual(result.errors.length, 0, "Should have no errors");
});

runTest("should fail schema with multiple errors", () => {
  const schema = {
    name: new StringValidator("Very Long Name That Exceeds Limit", "Name")
      .required()
      .maxLength(10),
    age: new NumberValidator(15, "Age").required().min(18).max(100),
  };

  const result = validate(schema, { name: "Very Long Name", age: 15 });
  assertTrue(result.isValid === false, "Should be invalid for incorrect data");
  assertTrue(result.errors.length >= 2, "Should have multiple errors");
});

runTest("should handle mixed optional and required fields", () => {
  const schema = {
    name: new StringValidator("John", "Name").required().maxLength(10),
    email: new StringValidator(undefined, "Email").optional().maxLength(50),
  };

  const result = validate(schema, { name: "John" });
  assertTrue(
    result.isValid === true,
    "Should be valid with optional undefined field",
  );
  assertEqual(result.errors.length, 0, "Should have no errors");
});

// Error Handling Tests
console.log("\n⚠️ Error Handling Tests:");

runTest("should throw error when calling optional() twice", () => {
  const validator = new StringValidator("test", "Name");
  validator.optional();
  assertThrows(() => validator.optional(), "isRequired is already set");
});

runTest("should throw error when calling required() twice", () => {
  const validator = new StringValidator("test", "Name");
  validator.required();
  assertThrows(() => validator.required(), "isRequired is already set");
});

runTest("should throw error when mixing optional() and required()", () => {
  const validator = new StringValidator("test", "Name");
  validator.optional();
  assertThrows(() => validator.required(), "isRequired is already set");
});

// Edge Cases
console.log("\n🔍 Edge Cases:");

runTest("should handle empty string validation", () => {
  const validator = new StringValidator("", "Name");
  const result = validator.required().maxLength(10).validate();
  assertTrue(
    result.isValid === true,
    "Should be valid for empty string within limit",
  );
});

runTest("should handle zero number validation", () => {
  const validator = new NumberValidator(0, "Count");
  const result = validator.min(0).max(100).validate();
  assertTrue(result.isValid === true, "Should be valid for zero within range");
});

runTest("should handle boundary values", () => {
  const validator = new StringValidator("exact", "Name");
  const result = validator.maxLength(5).validate();
  assertTrue(
    result.isValid === true,
    "Should be valid for exact boundary value",
  );
});

// Test Summary
console.log("\n📊 Test Summary:");
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Total: ${passedTests + failedTests}`);

if (failedTests === 0) {
  console.log("\n🎉 All tests passed!");
} else {
  console.log("\n💥 Some tests failed. Please review the errors above.");
  process.exit(1);
}
