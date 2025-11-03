/**
 * Utility functions for masking PII data
 */

// ✅ Mask personally identifiable information (PII)
export function maskPII(name = '') {
  if (!name) return '';
  const parts = name.split(' ');
  return parts.map(p => p[0] + '*'.repeat(Math.max(p.length - 1, 0))).join(' ');
}

// Mask a patient ID
export const maskPatientId = (id) => {
  if (!id) return '';
  const prefix = id.substring(0, 2);
  const masked = '*'.repeat(id.length - 2);
  return prefix + masked;
};

// ✅ Mask email addresses
export function maskEmail(email = '') {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  const maskedUser = user[0] + '*'.repeat(Math.max(user.length - 2, 0)) + user.slice(-1);
  return `${maskedUser}@${domain}`;
}

// ✅ Mask phone numbers
export function maskPhoneNumber(phone = '') {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, ''); // remove non-digits
  if (cleaned.length < 4) return '*'.repeat(cleaned.length);
  const visible = cleaned.slice(-4);
  return `***-***-${visible}`;
}

// Optional alias if you want to keep maskPhone as a name
export const maskPhone = maskPhoneNumber;

export default {
  maskPII,
  maskPatientId,
  maskEmail,
  maskPhone
};
