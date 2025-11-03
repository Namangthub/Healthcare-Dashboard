// src/utils/privacyUtils.js
/**
 * Utility functions for masking PII data
 */

// Mask a name
const maskPII = (fullName) => {
  if (!fullName) return 'Unknown';
  
  // Split by spaces to handle first and last names
  const parts = fullName.split(' ');
  
  return parts.map(part => {
    if (part.length <= 1) return part;
    return `${part.charAt(0)}${'*'.repeat(part.length - 1)}`;
  }).join(' ');
};

// Mask a patient ID
const maskPatientId = (id) => {
  if (!id) return '';
  
  // Keep first 2 characters, mask the rest
  const prefix = id.substring(0, 2);
  const masked = '*'.repeat(id.length - 2);
  
  return prefix + masked;
};

// Mask an email address
const maskEmail = (email) => {
  if (!email) return '';
  
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const name = parts[0];
  const domain = parts[1];
  
  // Keep first and last character of name part
  let maskedName;
  if (name.length <= 2) {
    maskedName = name;
  } else {
    maskedName = name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  }
  
  return maskedName + '@' + domain;
};

// Mask a phone number
const maskPhone = (phone) => {
  if (!phone) return '';
  
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Keep last 4 digits, mask the rest
  if (digits.length <= 4) return phone;
  
  const visiblePart = digits.slice(-4);
  const maskedPart = '*'.repeat(digits.length - 4);
  
  // Try to preserve original format
  if (phone.includes('-') || phone.includes('(')) {
    if (phone.includes('(') && phone.includes(')')) {
      return `(***) ***-${visiblePart}`;
    }
    return `***-***-${visiblePart}`;
  }
  
  return maskedPart + visiblePart;
};

module.exports = {
  maskPII,
  maskPatientId,
  maskEmail,
  maskPhone
};