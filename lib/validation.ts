/**
 * Validation utilities with robust regex patterns for security
 */

// Email validation with comprehensive regex (RFC 5322 compliant)
export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone validation (international format with country codes)
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// Moroccan phone validation (more specific)
export const MOROCCO_PHONE_REGEX = /^(\+212|0)[5-7]\d{8}$/;

// Strong password validation (min 8 chars, uppercase, lowercase, number, special char)
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Name validation (letters, spaces, hyphens, apostrophes, accents - French/Arabic compatible)
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]{2,50}$/;

// Subject/Title validation (alphanumeric with common punctuation)
export const SUBJECT_REGEX = /^[a-zA-ZÀ-ÿ\u0600-\u06FF0-9\s.,!?'-]{3,100}$/;

// Address validation (more flexible for international addresses)
export const ADDRESS_REGEX = /^[a-zA-ZÀ-ÿ\u0600-\u06FF0-9\s.,'-]{5,200}$/;

// Postal code validation (flexible international format)
export const POSTAL_CODE_REGEX = /^[A-Z0-9\s-]{3,10}$/i;

// City validation
export const CITY_REGEX = /^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]{2,50}$/;

// Country validation
export const COUNTRY_REGEX = /^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]{2,50}$/;

// URL validation
export const URL_REGEX =
  /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/;

// Credit card validation (basic format check)
export const CREDIT_CARD_REGEX = /^[0-9]{13,19}$/;

// CVV validation
export const CVV_REGEX = /^[0-9]{3,4}$/;

// Amount validation (for donations, prices)
export const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;

// Date validation (YYYY-MM-DD format)
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Time validation (HH:MM format)
export const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Validation functions
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  return PHONE_REGEX.test(cleanPhone);
};

export const validateMoroccanPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  return MOROCCO_PHONE_REGEX.test(cleanPhone);
};

export const validateName = (name: string): boolean => {
  return NAME_REGEX.test(name.trim());
};

export const validateSubject = (subject: string): boolean => {
  return SUBJECT_REGEX.test(subject.trim());
};

export const validateAddress = (address: string): boolean => {
  return ADDRESS_REGEX.test(address.trim());
};

export const validateCity = (city: string): boolean => {
  return CITY_REGEX.test(city.trim());
};

export const validateCountry = (country: string): boolean => {
  return COUNTRY_REGEX.test(country.trim());
};

export const validatePostalCode = (postalCode: string): boolean => {
  return POSTAL_CODE_REGEX.test(postalCode.trim());
};

export const validateAmount = (amount: string): boolean => {
  return AMOUNT_REGEX.test(amount.trim()) && parseFloat(amount) > 0;
};

export const validateDate = (date: string): boolean => {
  if (!DATE_REGEX.test(date)) return false;
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

export const validateTime = (time: string): boolean => {
  return TIME_REGEX.test(time.trim());
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
  }

  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push(
      'Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUrl = (url: string): boolean => {
  return URL_REGEX.test(url.trim());
};

export const validateCreditCard = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  return CREDIT_CARD_REGEX.test(cleanNumber);
};

export const validateCVV = (cvv: string): boolean => {
  return CVV_REGEX.test(cvv.trim());
};

// Enhanced sanitization functions to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
    .trim();
};

export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/<link\b[^>]*>/gi, '') // Remove link tags
    .replace(/<meta\b[^>]*>/gi, '') // Remove meta tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .trim();
};

// Rate limiting helper
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return {
    isAllowed: (identifier: string): boolean => {
      const now = Date.now();
      const userAttempts = attempts.get(identifier);

      if (!userAttempts || now > userAttempts.resetTime) {
        attempts.set(identifier, { count: 1, resetTime: now + windowMs });
        return true;
      }

      if (userAttempts.count >= maxAttempts) {
        return false;
      }

      userAttempts.count++;
      return true;
    },
    getRemainingTime: (identifier: string): number => {
      const userAttempts = attempts.get(identifier);
      if (!userAttempts) return 0;
      return Math.max(0, userAttempts.resetTime - Date.now());
    },
  };
};

// Form validation helper
export const validateFormField = (
  fieldName: string,
  value: string,
  required: boolean = false
): { isValid: boolean; error: string } => {
  if (required && !value.trim()) {
    return { isValid: false, error: `Le champ ${fieldName} est requis` };
  }

  if (!value.trim()) {
    return { isValid: true, error: '' };
  }

  switch (fieldName.toLowerCase()) {
    case 'email':
      return {
        isValid: validateEmail(value),
        error: validateEmail(value) ? '' : 'Format d\'email invalide',
      };
    case 'phone':
    case 'telephone':
      return {
        isValid: validatePhone(value),
        error: validatePhone(value) ? '' : 'Numéro de téléphone invalide',
      };
    case 'firstname':
    case 'lastname':
    case 'prenom':
    case 'nom':
      return {
        isValid: validateName(value),
        error: validateName(value)
          ? ''
          : 'Le nom ne doit contenir que des lettres, espaces, tirets et apostrophes',
      };
    case 'subject':
    case 'sujet':
      return {
        isValid: validateSubject(value),
        error: validateSubject(value) ? '' : 'Sujet invalide',
      };
    case 'address':
    case 'adresse':
      return {
        isValid: validateAddress(value),
        error: validateAddress(value) ? '' : 'Adresse invalide',
      };
    case 'city':
    case 'ville':
      return {
        isValid: validateCity(value),
        error: validateCity(value) ? '' : 'Nom de ville invalide',
      };
    case 'country':
    case 'pays':
      return {
        isValid: validateCountry(value),
        error: validateCountry(value) ? '' : 'Nom de pays invalide',
      };
    case 'postalcode':
    case 'codepostal':
      return {
        isValid: validatePostalCode(value),
        error: validatePostalCode(value) ? '' : 'Code postal invalide',
      };
    case 'amount':
    case 'montant':
      return {
        isValid: validateAmount(value),
        error: validateAmount(value) ? '' : 'Montant invalide',
      };
    default:
      return { isValid: true, error: '' };
  }
};