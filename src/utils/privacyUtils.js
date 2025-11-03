/**
 * Utility functions for masking PII data
 */

// Mask a name
export const maskPII = (fullName) => {
  if (!fullName) return 'Unknown';
  
  const parts = fullName.split(' ');
  
  return parts.map(part => {
    if (part.length <= 1) return part;
    return `${part.charAt(0)}${'*'.repeat(part.length - 1)}`;
  }).join(' ');
};

// Mask a patient ID
export const maskPatientId = (id) => {
  if (!id) return '';
  
  const prefix = id.substring(0, 2);
  const masked = '*'.repeat(id.length - 2);
  
  return prefix + masked;
};

// Mask an email address
export const maskEmail = (email) => {
  if (!email) return '';
  
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const name = parts[0];
  const domain = parts[1];
  
  let maskedName;
  if (name.length <= 2) {
    maskedName = name;
  } else {
    maskedName = name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  }
  
  return maskedName + '@' + domain;
};

// Mask a phone number
export const maskPhone = (phone) => {
  if (!phone) return '';
  
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length <= 4) return phone;
  
  const visiblePart = digits.slice(-4);
  const maskedPart = '*'.repeat(digits.length - 4);
  
  if (phone.includes('-') || phone.includes('(')) {
    if (phone.includes('(') && phone.includes(')')) {
      return `(***) ***-${visiblePart}`;
    }
    return `***-***-${visiblePart}`;
  }
  
  return maskedPart + visiblePart;
};

export default {
  maskPII,
  maskPatientId,
  maskEmail,
  maskPhone
};
