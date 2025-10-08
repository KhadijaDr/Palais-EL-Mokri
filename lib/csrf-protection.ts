/**
 * CSRF Protection utilities for Next.js application
 */

import { randomBytes } from 'crypto';

// Generate CSRF token
export const generateCSRFToken = (): string => {
  return randomBytes(32).toString('hex');
};

// Validate CSRF token
export const validateCSRFToken = (
  token: string,
  sessionToken: string
): boolean => {
  if (!token || !sessionToken) {
    return false;
  }
  return token === sessionToken;
};

// CSRF middleware for API routes
export const csrfMiddleware = (req: any, res: any, next: () => void) => {
  const token = req.headers['x-csrf-token'] || req.body.csrfToken;
  const sessionToken = req.session?.csrfToken;

  if (!validateCSRFToken(token, sessionToken)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

// Hook for client-side CSRF token management
export const useCSRFToken = () => {
  const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('csrf-token');
    }
    return null;
  };

  const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('csrf-token', token);
    }
  };

  const removeToken = (): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('csrf-token');
    }
  };

  return { getToken, setToken, removeToken };
};