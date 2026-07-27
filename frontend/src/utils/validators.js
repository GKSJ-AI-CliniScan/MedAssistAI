export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!regex.test(email)) return 'Invalid email address';
  return true;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  if (!hasNumber || !hasUpper) {
    return 'Password must contain at least one uppercase letter and one number';
  }
  return true;
};

export const validateAge = (age) => {
  const num = parseInt(age, 10);
  if (isNaN(num)) return 'Age must be a number';
  if (num < 0 || num > 120) return 'Age must be between 0 and 120';
  return true;
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const regex = /^\+?[1-9]\d{1,14}$/;
  if (!regex.test(phone.replace(/[\s()-]/g, ''))) return 'Invalid phone number format';
  return true;
};
