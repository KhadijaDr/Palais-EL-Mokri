/**
 * Multilingual validation utilities with internationalized error messages
 */

import { translations } from './translations';

// Type definitions for supported languages
export type SupportedLanguage = 'fr' | 'en' | 'ar';

// Type definitions for validation results
export interface ValidationResult {
  isValid: boolean;
  error: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

// Get current language from browser or default to French
export const getCurrentLanguage = (): SupportedLanguage => {
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    return ['fr', 'en', 'ar'].includes(browserLang) ? browserLang : 'fr';
  }
  return 'fr';
};

// Get translated error message
export const getErrorMessage = (
  key: string,
  lang: SupportedLanguage = getCurrentLanguage()
): string => {
  const keys = key.split('.');
  let message: any = translations[lang].errors;
  
  for (const k of keys) {
    message = message?.[k];
  }
  
  return typeof message === 'string' ? message : key;
};

// Enhanced validation functions with multilingual support
export const validateEmailMultilingual = (
  email: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!email.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = EMAIL_REGEX.test(email.trim());
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.email', lang),
  };
};

export const validatePhoneMultilingual = (
  phone: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;
  
  if (!phone.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  const isValid = PHONE_REGEX.test(cleanPhone);
  
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.phone', lang),
  };
};

export const validateNameMultilingual = (
  name: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]{2,50}$/;
  
  if (!name.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = NAME_REGEX.test(name.trim());
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.name', lang),
  };
};

export const validateSubjectMultilingual = (
  subject: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const SUBJECT_REGEX = /^[a-zA-ZÀ-ÿ\u0600-\u06FF0-9\s.,!?'-]{3,100}$/;
  
  if (!subject.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = SUBJECT_REGEX.test(subject.trim());
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.subject', lang),
  };
};

export const validateAddressMultilingual = (
  address: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const ADDRESS_REGEX = /^[a-zA-ZÀ-ÿ\u0600-\u06FF0-9\s.,'-]{5,200}$/;
  
  if (!address.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = ADDRESS_REGEX.test(address.trim());
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.address', lang),
  };
};

export const validateCityMultilingual = (
  city: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const CITY_REGEX = /^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]{2,50}$/;
  
  if (!city.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = CITY_REGEX.test(city.trim());
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.city', lang),
  };
};

export const validateCountryMultilingual = (
  country: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const COUNTRY_REGEX = /^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]{2,50}$/;
  
  if (!country.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = COUNTRY_REGEX.test(country.trim());
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.country', lang),
  };
};

export const validatePostalCodeMultilingual = (
  postalCode: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const POSTAL_CODE_REGEX = /^[A-Z0-9\s-]{3,10}$/i;
  
  if (!postalCode.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = POSTAL_CODE_REGEX.test(postalCode.trim());
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.postalCode', lang),
  };
};

export const validateAmountMultilingual = (
  amount: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const AMOUNT_REGEX = /^\d+(\.\d{1,2})?$/;
  
  if (!amount.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = AMOUNT_REGEX.test(amount.trim()) && parseFloat(amount) > 0;
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.amount', lang),
  };
};

export const validatePasswordMultilingual = (
  password: string,
  lang: SupportedLanguage = getCurrentLanguage()
): PasswordValidationResult => {
  const errors: string[] = [];

  if (!password) {
    errors.push(getErrorMessage('validation.required', lang));
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push(getErrorMessage('validation.password.minLength', lang));
  }

  if (!/[a-z]/.test(password)) {
    errors.push(getErrorMessage('validation.password.lowercase', lang));
  }

  if (!/[A-Z]/.test(password)) {
    errors.push(getErrorMessage('validation.password.uppercase', lang));
  }

  if (!/\d/.test(password)) {
    errors.push(getErrorMessage('validation.password.number', lang));
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push(getErrorMessage('validation.password.special', lang));
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateDateMultilingual = (
  date: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!date.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  if (!DATE_REGEX.test(date)) {
    return { isValid: false, error: getErrorMessage('validation.date', lang) };
  }
  
  const dateObj = new Date(date);
  const isValid = dateObj instanceof Date && !isNaN(dateObj.getTime());
  
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.date', lang),
  };
};

export const validateTimeMultilingual = (
  time: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (!time.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = TIME_REGEX.test(time.trim());
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.time', lang),
  };
};

export const validateUrlMultilingual = (
  url: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const URL_REGEX = /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/;
  
  if (!url.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = URL_REGEX.test(url.trim());
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.url', lang),
  };
};

export const validateCreditCardMultilingual = (
  cardNumber: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const CREDIT_CARD_REGEX = /^[0-9]{13,19}$/;
  
  if (!cardNumber.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const isValid = CREDIT_CARD_REGEX.test(cleanNumber);
  
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.creditCard', lang),
  };
};

export const validateCVVMultilingual = (
  cvv: string,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  const CVV_REGEX = /^[0-9]{3,4}$/;
  
  if (!cvv.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }
  
  const isValid = CVV_REGEX.test(cvv.trim());
  return {
    isValid,
    error: isValid ? '' : getErrorMessage('validation.cvv', lang),
  };
};

// Generic form field validation with multilingual support
export const validateFormFieldMultilingual = (
  fieldName: string,
  value: string,
  required: boolean = false,
  lang: SupportedLanguage = getCurrentLanguage()
): ValidationResult => {
  if (required && !value.trim()) {
    return { isValid: false, error: getErrorMessage('validation.required', lang) };
  }

  if (!value.trim()) {
    return { isValid: true, error: '' };
  }

  switch (fieldName.toLowerCase()) {
    case 'email':
      return validateEmailMultilingual(value, lang);
    case 'phone':
    case 'telephone':
      return validatePhoneMultilingual(value, lang);
    case 'firstname':
    case 'lastname':
    case 'prenom':
    case 'nom':
      return validateNameMultilingual(value, lang);
    case 'subject':
    case 'sujet':
      return validateSubjectMultilingual(value, lang);
    case 'address':
    case 'adresse':
      return validateAddressMultilingual(value, lang);
    case 'city':
    case 'ville':
      return validateCityMultilingual(value, lang);
    case 'country':
    case 'pays':
      return validateCountryMultilingual(value, lang);
    case 'postalcode':
    case 'codepostal':
      return validatePostalCodeMultilingual(value, lang);
    case 'amount':
    case 'montant':
      return validateAmountMultilingual(value, lang);
    case 'date':
      return validateDateMultilingual(value, lang);
    case 'time':
      return validateTimeMultilingual(value, lang);
    case 'url':
      return validateUrlMultilingual(value, lang);
    case 'creditcard':
      return validateCreditCardMultilingual(value, lang);
    case 'cvv':
      return validateCVVMultilingual(value, lang);
    default:
      return { isValid: true, error: '' };
  }
};

// Hook for React components to use multilingual validation
export const useMultilingualValidation = (lang?: SupportedLanguage) => {
  const currentLang = lang || getCurrentLanguage();
  
  return {
    validateEmail: (email: string) => validateEmailMultilingual(email, currentLang),
    validatePhone: (phone: string) => validatePhoneMultilingual(phone, currentLang),
    validateName: (name: string) => validateNameMultilingual(name, currentLang),
    validateSubject: (subject: string) => validateSubjectMultilingual(subject, currentLang),
    validateAddress: (address: string) => validateAddressMultilingual(address, currentLang),
    validateCity: (city: string) => validateCityMultilingual(city, currentLang),
    validateCountry: (country: string) => validateCountryMultilingual(country, currentLang),
    validatePostalCode: (postalCode: string) => validatePostalCodeMultilingual(postalCode, currentLang),
    validateAmount: (amount: string) => validateAmountMultilingual(amount, currentLang),
    validatePassword: (password: string) => validatePasswordMultilingual(password, currentLang),
    validateDate: (date: string) => validateDateMultilingual(date, currentLang),
    validateTime: (time: string) => validateTimeMultilingual(time, currentLang),
    validateUrl: (url: string) => validateUrlMultilingual(url, currentLang),
    validateCreditCard: (cardNumber: string) => validateCreditCardMultilingual(cardNumber, currentLang),
    validateCVV: (cvv: string) => validateCVVMultilingual(cvv, currentLang),
    validateFormField: (fieldName: string, value: string, required?: boolean) => 
      validateFormFieldMultilingual(fieldName, value, required, currentLang),
    getErrorMessage: (key: string) => getErrorMessage(key, currentLang),
    currentLanguage: currentLang,
  };
};