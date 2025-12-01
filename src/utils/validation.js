export const validators = {
  required: (value) => {
    if (value === null || value === undefined) return "This field is required";
    if (typeof value === "string" && value.trim() === "") return "This field is required";
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : "Please enter a valid email address";
  },

  mobile: (value) => {
    if (!value) return null;
    const cleaned = value.replace(/\D/g, "");
    return /^[6-9]\d{9}$/.test(cleaned)
      ? null
      : "Please enter a valid 10-digit mobile number";
  },

  minLength: (min) => (value) =>
    value && value.length < min ? `Must be at least ${min} characters` : null,

  maxLength: (max) => (value) =>
    value && value.length > max ? `Must be no more than ${max} characters` : null,

  password: (value) => {
    if (!value) return null;
    if (value.length < 8) return "Password must be at least 8 characters long";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/\d/.test(value)) return "Password must contain at least one number";
    return null;
  },

  number: (value) =>
    value && isNaN(value) ? "Must be a valid number" : null,

  min: (minValue) => (value) =>
    value && Number(value) < minValue ? `Must be at least ${minValue}` : null,

  max: (maxValue) => (value) =>
    value && Number(value) > maxValue ? `Must be no more than ${maxValue}` : null,

  pattern: (regex, message) => (value) =>
    value && !regex.test(value) ? message || "Invalid format" : null,
};

// Multiple validators
export function composeValidators(...validators) {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
}

// Whole form validation
export function validateForm(values, schema) {
  const errors = {};
  for (const [field, rule] of Object.entries(schema)) {
    const error = rule(values[field]);
    if (error) errors[field] = error;
  }
  return errors;
}
