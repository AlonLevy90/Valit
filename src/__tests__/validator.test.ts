// Simple test runner without external dependencies
import stringValidator from "../validators/StringValidator";
import BooleanValidator from "../validators/booleanValidator";
import numberValidator from "../validators/numberValidator";
import objectValidator from "../validators/objectValidator";

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

runTest("should validate valid string", () => {
  const validator = stringValidator();
  const result = validator.validate("hello");
  assertTrue(result.valid === true, "Should be valid for valid string");
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should validate string with min length", () => {
  const validator = stringValidator().min(3);
  const result = validator.validate("hello");
  assertTrue(
    result.valid === true,
    "Should be valid when string meets min length",
  );
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should fail when string is too short", () => {
  const validator = stringValidator().min(5);
  const result = validator.validate("hi");
  assertTrue(
    result.valid === false,
    "Should be invalid when string is too short",
  );
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "ruleViolation",
    "Error should be ruleViolation type",
  );
});

runTest("should validate string with max length", () => {
  const validator = stringValidator().max(10);
  const result = validator.validate("hello");
  assertTrue(
    result.valid === true,
    "Should be valid when string is within max length",
  );
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should fail when string exceeds max length", () => {
  const validator = stringValidator().max(5);
  const result = validator.validate("hello world");
  assertTrue(
    result.valid === false,
    "Should be invalid when string exceeds max length",
  );
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "ruleViolation",
    "Error should be ruleViolation type",
  );
});

runTest("should handle undefined optional field", () => {
  const validator = stringValidator().optional();
  const result = validator.validate(undefined as any);
  assertTrue(
    result.valid === true,
    "Should be valid for optional undefined field",
  );
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should fail undefined required field", () => {
  const validator = stringValidator();
  const result = validator.validate(undefined as any);
  assertTrue(
    result.valid === false,
    "Should be invalid for required undefined field",
  );
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "required",
    "Error should be required type",
  );
});

runTest("should fail for wrong type", () => {
  const validator = stringValidator();
  const result = validator.validate(123 as any);
  assertTrue(result.valid === false, "Should be invalid for wrong type");
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "typeMismatch",
    "Error should be typeMismatch type for wrong type",
  );
});

runTest("should chain validation methods", () => {
  const validator = stringValidator().min(3).max(10);
  const result = validator.validate("hello");
  assertTrue(result.valid === true, "Should be valid when chaining methods");
});

// NumberValidator Tests
console.log("\n🔢 NumberValidator Tests:");

runTest("should validate valid number", () => {
  const validator = numberValidator();
  const result = validator.validate(42);
  assertTrue(result.valid === true, "Should be valid for valid number");
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should validate number with min", () => {
  const validator = numberValidator().min(5);
  const result = validator.validate(10);
  assertTrue(
    result.valid === true,
    "Should be valid when number is above minimum",
  );
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should fail when number is below min", () => {
  const validator = numberValidator().min(5);
  const result = validator.validate(3);
  assertTrue(
    result.valid === false,
    "Should be invalid when number is below minimum",
  );
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "ruleViolation",
    "Error should be ruleViolation type",
  );
});

runTest("should validate number with max", () => {
  const validator = numberValidator().max(15);
  const result = validator.validate(10);
  assertTrue(
    result.valid === true,
    "Should be valid when number is below maximum",
  );
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should fail when number exceeds max", () => {
  const validator = numberValidator().max(15);
  const result = validator.validate(20);
  assertTrue(
    result.valid === false,
    "Should be invalid when number exceeds maximum",
  );
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "ruleViolation",
    "Error should be ruleViolation type",
  );
});

runTest("should handle undefined optional number", () => {
  const validator = numberValidator().optional();
  const result = validator.validate(undefined as any);
  assertTrue(
    result.valid === true,
    "Should be valid for optional undefined number",
  );
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should fail undefined required number", () => {
  const validator = numberValidator();
  const result = validator.validate(undefined as any);
  assertTrue(
    result.valid === false,
    "Should be invalid for required undefined number",
  );
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "required",
    "Error should be required type",
  );
});

runTest("should fail for wrong type", () => {
  const validator = numberValidator();
  const result = validator.validate("not a number" as any);
  assertTrue(result.valid === false, "Should be invalid for wrong type");
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "typeMismatch",
    "Error should be typeMismatch type",
  );
});

// BooleanValidator Tests
console.log("\n🔘 BooleanValidator Tests:");

runTest("should validate valid boolean", () => {
  const validator = BooleanValidator();
  const result = validator.validate(true);
  assertTrue(result.valid === true, "Should be valid for valid boolean");
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should validate false boolean", () => {
  const validator = BooleanValidator();
  const result = validator.validate(false);
  assertTrue(result.valid === true, "Should be valid for false boolean");
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should handle undefined optional boolean", () => {
  const validator = BooleanValidator().optional();
  const result = validator.validate(undefined as any);
  assertTrue(
    result.valid === true,
    "Should be valid for optional undefined boolean",
  );
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should fail undefined required boolean", () => {
  const validator = BooleanValidator();
  const result = validator.validate(undefined as any);
  assertTrue(
    result.valid === false,
    "Should be invalid for required undefined boolean",
  );
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "required",
    "Error should be required type",
  );
});

runTest("should fail for wrong type", () => {
  const validator = BooleanValidator();
  const result = validator.validate("true" as any);
  assertTrue(result.valid === false, "Should be invalid for wrong type");
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "typeMismatch",
    "Error should be typeMismatch type",
  );
});

// ObjectValidator Tests
console.log("\n📋 ObjectValidator Tests:");

runTest("should validate valid object", () => {
  const validator = objectValidator({
    name: stringValidator().min(2),
    age: numberValidator().min(0),
  });
  const result = validator.validate({ name: "John", age: 25 });
  assertTrue(result.valid === true, "Should be valid for valid object");
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should fail object with invalid fields", () => {
  const validator = objectValidator({
    name: stringValidator().min(5),
    age: numberValidator().min(18),
  });
  const result = validator.validate({ name: "Jo", age: 15 });
  assertTrue(
    result.valid === false,
    "Should be invalid for object with invalid fields",
  );
  assertTrue(result.error! && result.error.length > 0, "Should have errors");
});

runTest("should handle undefined optional object", () => {
  const validator = objectValidator({
    name: stringValidator().min(2),
    age: numberValidator().min(0),
  }).optional();
  const result = validator.validate(undefined as any);
  assertTrue(
    result.valid === true,
    "Should be valid for optional undefined object",
  );
  assertEqual(result.error, undefined, "Should have no errors");
});

runTest("should fail undefined required object", () => {
  const validator = objectValidator({
    name: stringValidator().min(2),
    age: numberValidator().min(0),
  });
  const result = validator.validate(undefined as any);
  assertTrue(
    result.valid === false,
    "Should be invalid for required undefined object",
  );
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "typeMismatch",
    "Error should be typeMismatch type",
  );
});

runTest("should fail for wrong type", () => {
  const validator = objectValidator({
    name: stringValidator().min(2),
    age: numberValidator().min(0),
  });
  const result = validator.validate("not an object" as any);
  assertTrue(result.valid === false, "Should be invalid for wrong type");
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "typeMismatch",
    "Error should be typeMismatch type",
  );
});

// Error Structure Tests
console.log("\n⚠️ Error Structure Tests:");

runTest("should have consistent error structure", () => {
  const validator = stringValidator().min(5);
  const result = validator.validate("hi");
  assertTrue(result.valid === false, "Should be invalid");
  assertTrue(result.error! && result.error.length > 0, "Should have error");

  const error = result.error![0];
  assertTrue(typeof error.message === "string", "Error should have message");
  assertTrue(Array.isArray(error.path), "Error should have path array");
  assertTrue(typeof error.type === "string", "Error should have type");
});

runTest("should include path information in nested object errors", () => {
  const validator = objectValidator({
    name: stringValidator().min(5),
    age: numberValidator().min(18),
  });
  const result = validator.validate({ name: "Jo", age: 15 });
  assertTrue(result.valid === false, "Should be invalid");
  assertTrue(result.error! && result.error.length > 0, "Should have errors");

  // Check that errors have path information
  result.error!.forEach((error) => {
    assertTrue(Array.isArray(error.path), "Error should have path array");
  });
});

// Edge Cases
console.log("\n🔍 Edge Cases:");

runTest("should handle empty string validation", () => {
  const validator = stringValidator().max(10);
  const result = validator.validate("");
  assertTrue(
    result.valid === true,
    "Should be valid for empty string within limit",
  );
});

runTest("should handle zero number validation", () => {
  const validator = numberValidator().min(0).max(100);
  const result = validator.validate(0);
  assertTrue(result.valid === true, "Should be valid for zero within range");
});

runTest("should handle boundary values", () => {
  const validator = stringValidator().max(5);
  const result = validator.validate("exact");
  assertTrue(result.valid === true, "Should be valid for exact boundary value");
});

runTest("should handle null object", () => {
  const validator = objectValidator({
    name: stringValidator().min(2),
    age: numberValidator().min(0),
  });
  const result = validator.validate(null as any);
  assertTrue(result.valid === false, "Should be invalid for null object");
  assertTrue(result.error! && result.error.length > 0, "Should have error");
  assertTrue(
    result.error![0].type === "typeMismatch",
    "Error should be typeMismatch type",
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
