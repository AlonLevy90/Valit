# Valit

A lightweight TypeScript validation library with centralized error handling and a fluent API.

## Features

- 🚀 **Lightweight** - Minimal bundle size with zero dependencies
- 🔒 **Type-safe** - Full TypeScript support with excellent type inference
- 🎯 **Centralized Error Handling** - Uniform error structure across all validators
- 🔧 **Fluent API** - Chain validation rules for better readability
- 📦 **Tree-shakable** - Only import what you need

## Installation

```bash
npm install valit
```

## Quick Start

```typescript
import { string, number, boolean, object } from "valit";

// String validation
const nameSchema = string().min(2).max(50);
const result = nameSchema.validate("John");
console.log(result.valid); // true

// Number validation
const ageSchema = number().min(0).max(120);
const ageResult = ageSchema.validate(25);
console.log(ageResult.valid); // true

// Boolean validation
const isActiveSchema = boolean();
const boolResult = isActiveSchema.validate(true);
console.log(boolResult.valid); // true

// Object validation
const userSchema = object({
  name: string().min(2),
  age: number().min(0),
  isActive: boolean(),
});

const userResult = userSchema.validate({
  name: "John",
  age: 25,
  isActive: true,
});
console.log(userResult.valid); // true
```

## API Reference

### String Validator

```typescript
import { string } from "valit";

const schema = string()
  .min(3) // Minimum length
  .max(50) // Maximum length
  .optional(); // Make field optional

const result = schema.validate("hello");
```

**Methods:**

- `min(length: number)` - Set minimum string length
- `max(length: number)` - Set maximum string length
- `optional()` - Make the field optional

### Number Validator

```typescript
import { number } from "valit";

const schema = number()
  .min(0) // Minimum value
  .max(100) // Maximum value
  .optional(); // Make field optional

const result = schema.validate(42);
```

**Methods:**

- `min(value: number)` - Set minimum value
- `max(value: number)` - Set maximum value
- `optional()` - Make the field optional

### Boolean Validator

```typescript
import { boolean } from "valit";

const schema = boolean().optional();
const result = schema.validate(true);
```

**Methods:**

- `optional()` - Make the field optional

### Object Validator

```typescript
import { object, string, number } from "valit";

const schema = object({
  name: string().min(2),
  age: number().min(0).max(120),
  email: string().optional(),
});

const result = schema.validate({
  name: "John",
  age: 25,
  email: "john@example.com",
});
```

**Methods:**

- `optional()` - Make the field optional

## Error Handling

All validators return a consistent error structure:

```typescript
interface ValidationResult<T> {
  valid: boolean;
  error?: ValidationError[];
  value?: unknown;
  data?: T;
}

interface ValidationError {
  message: string;
  path: string[];
  type: ErrorType;
}

type ErrorType = "required" | "typeMismatch" | "ruleViolation";
```

### Error Examples

```typescript
import { string } from "valit";

const schema = string().min(3).max(10);
const result = schema.validate("hi");

console.log(result);
// {
//   valid: false,
//   error: [{
//     type: "ruleViolation",
//     message: "required: minimum of 3 characters, received: 2 characters",
//     path: []
//   }]
// }
```

## Advanced Usage

### Custom Error Messages

```typescript
import { string } from "valit";

const schema = string().min(3);
const result = schema.validate("hi");

if (!result.valid) {
  console.log("Validation failed:", result.error[0].message);
}
```

### Nested Object Validation

```typescript
import { object, string, number } from "valit";

const addressSchema = object({
  street: string().min(5),
  city: string().min(2),
  zipCode: string().min(5),
});

const userSchema = object({
  name: string().min(2),
  age: number().min(0),
  address: addressSchema,
});

const result = userSchema.validate({
  name: "John",
  age: 25,
  address: {
    street: "123 Main St",
    city: "New York",
    zipCode: "10001",
  },
});
```

### Optional Fields

```typescript
import { object, string, number } from "valit";

const schema = object({
  name: string().min(2),
  email: string().optional(), // This field is optional
  age: number().min(0).optional(),
});

// This will pass validation
const result = schema.validate({
  name: "John",
  // email and age are optional, so they can be omitted
});
```

## TypeScript Support

Valit is built with TypeScript and provides excellent type inference:

```typescript
import { object, string, number } from "valit";

const userSchema = object({
  name: string().min(2),
  age: number().min(0),
});

// TypeScript will infer the correct type
const result = userSchema.validate({
  name: "John",
  age: 25,
});

// result.data will be typed as { name: string; age: number }
if (result.valid) {
  console.log(result.data.name); // TypeScript knows this is a string
  console.log(result.data.age); // TypeScript knows this is a number
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.0

- Initial release
- String, number, boolean, and object validators
- Centralized error handling
- TypeScript support
- Fluent API
