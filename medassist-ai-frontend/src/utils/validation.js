/**
 * Centralized form validation helpers.
 * Each returns an error string when invalid, or empty string when valid.
 */

export const isEmail = (v) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v || '');

export const required = (v, label = 'This field') =>
  v === undefined || v === null || String(v).trim() === '' ? `${label} is required` : '';

export const minLength = (v, n, label = 'This field') =>
  String(v || '').length < n ? `${label} must be at least ${n} characters` : '';

export const matches = (v, target, label = 'This field') =>
  v !== target ? `${label} does not match` : '';

export function passwordStrength(pw = '') {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const tones = ['error', 'error', 'warning', 'warning', 'success', 'success'];
  return { score, label: labels[score], tone: tones[score] };
}
