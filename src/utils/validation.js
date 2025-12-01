// Validation helper functions

export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  mobile: (value) => {
    if (!value) return null;
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid 10-digit mobile number';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  password: (value) => {
    if (!value) return null;
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters`;
    }
    return null;
  },

  pattern: (regex, message) => (value) => {
    if (!value) return null;
    if (!regex.test(value)) {
      return message || 'Invalid format';
    }
    return null;
  },

  number: (value) => {
    if (!value) return null;
    if (isNaN(value)) {
      return 'Must be a valid number';
    }
    return null;
  },

  min: (minValue) => (value) => {
    if (!value) return null;
    if (Number(value) < minValue) {
      return `Must be at least ${minValue}`;
    }
    return null;
  },

  max: (maxValue) => (value) => {
    if (!value) return null;
    if (Number(value) > maxValue) {
      return `Must be no more than ${maxValue}`;
    }
    return null;
  },
};

// Compose multiple validators
export function composeValidators(...validators) {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
}

// Validate entire form based on schema
export function validateForm(values, schema) {
  const errors = {};
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = values[field];
    const error = rules(value);
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
}
