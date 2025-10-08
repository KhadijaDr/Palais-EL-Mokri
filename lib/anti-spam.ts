interface SpamAttempt {
  ip: string;
  timestamp: number;
  attempts: number;
  lastAttempt: number;
}

interface HoneypotField {
  name: string;
  type: 'text' | 'email' | 'hidden';
  style?: any;
}

class AntiSpamProtection {
  private attempts: Map<string, SpamAttempt> = new Map();
  private readonly maxAttempts = 5;
  private readonly baseDelay = 1000; // 1 seconde
  private readonly maxDelay = 300000; // 5 minutes
  private readonly cleanupInterval = 3600000; // 1 heure

  constructor() {
    // Nettoyage périodique des anciennes tentatives
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), this.cleanupInterval);
    }
  }

  /**
   * Génère un champ honeypot invisible pour piéger les bots
   */
  generateHoneypot(): HoneypotField {
    const honeypotNames = [
      'website',
      'url',
      'homepage',
      'company_website',
      'business_url',
      'site_web',
      'email_confirm',
      'confirm_email',
    ];

    const randomName = honeypotNames[Math.floor(Math.random() * honeypotNames.length)];

    return {
      name: randomName,
      type: 'text',
      style: {
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
        tabIndex: -1,
      },
    };
  }

  /**
   * Vérifie si le honeypot a été rempli (indique un bot)
   */
  checkHoneypot(formData: Record<string, any>, honeypotName: string): boolean {
    const honeypotValue = formData[honeypotName];
    return honeypotValue && honeypotValue.trim() !== '';
  }

  /**
   * Calcule le délai nécessaire avant la prochaine tentative
   */
  calculateDelay(attempts: number): number {
    if (attempts <= 1) return 0;
    
    // Délai exponentiel: 1s, 2s, 4s, 8s, 16s, puis plafonné à 5 minutes
    const delay = this.baseDelay * Math.pow(2, attempts - 2);
    return Math.min(delay, this.maxDelay);
  }

  /**
   * Vérifie si une IP peut faire une tentative
   */
  canAttempt(ip: string): { allowed: boolean; waitTime?: number; message?: string } {
    const now = Date.now();
    const attempt = this.attempts.get(ip);

    if (!attempt) {
      // Première tentative
      this.attempts.set(ip, {
        ip,
        timestamp: now,
        attempts: 1,
        lastAttempt: now,
      });
      return { allowed: true };
    }

    // Vérifier si assez de temps s'est écoulé depuis la dernière tentative
    const timeSinceLastAttempt = now - attempt.lastAttempt;
    const requiredDelay = this.calculateDelay(attempt.attempts);

    if (timeSinceLastAttempt < requiredDelay) {
      const waitTime = Math.ceil((requiredDelay - timeSinceLastAttempt) / 1000);
      return {
        allowed: false,
        waitTime,
        message: `Trop de tentatives. Veuillez attendre ${waitTime} secondes avant de réessayer.`,
      };
    }

    // Vérifier si le nombre maximum de tentatives est atteint
    if (attempt.attempts >= this.maxAttempts) {
      const timeSinceFirst = now - attempt.timestamp;
      const cooldownPeriod = 3600000; // 1 heure

      if (timeSinceFirst < cooldownPeriod) {
        const waitTime = Math.ceil((cooldownPeriod - timeSinceFirst) / 60000);
        return {
          allowed: false,
          waitTime: waitTime * 60,
          message: `Trop de tentatives. Veuillez attendre ${waitTime} minutes avant de réessayer.`,
        };
      } else {
        // Reset après la période de cooldown
        this.attempts.set(ip, {
          ip,
          timestamp: now,
          attempts: 1,
          lastAttempt: now,
        });
        return { allowed: true };
      }
    }

    // Mettre à jour les tentatives
    attempt.attempts += 1;
    attempt.lastAttempt = now;
    this.attempts.set(ip, attempt);

    return { allowed: true };
  }

  /**
   * Détecte les comportements suspects dans les données du formulaire
   */
  detectSuspiciousBehavior(formData: Record<string, any>): {
    suspicious: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    // Vérifier les liens dans les champs de texte
    const urlPattern = /(https?:\/\/[^\s]+)/gi;
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string' && urlPattern.test(value)) {
        reasons.push(`Liens détectés dans le champ ${key}`);
      }
    });

    // Vérifier les caractères répétitifs
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const repeatedPattern = /(.)\1{10,}/; // 10+ caractères identiques consécutifs
        if (repeatedPattern.test(value)) {
          reasons.push(`Caractères répétitifs détectés dans le champ ${key}`);
        }
      }
    });

    // Vérifier les mots-clés de spam courants
    const spamKeywords = [
      'viagra', 'casino', 'lottery', 'winner', 'congratulations',
      'click here', 'free money', 'make money', 'work from home',
      'seo', 'backlinks', 'cheap', 'discount', 'offer expires',
    ];

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const lowerValue = value.toLowerCase();
        spamKeywords.forEach(keyword => {
          if (lowerValue.includes(keyword)) {
            reasons.push(`Mot-clé suspect détecté: ${keyword}`);
          }
        });
      }
    });

    return {
      suspicious: reasons.length > 0,
      reasons,
    };
  }

  /**
   * Nettoyage des anciennes tentatives
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 heures

    for (const [ip, attempt] of this.attempts.entries()) {
      if (now - attempt.timestamp > maxAge) {
        this.attempts.delete(ip);
      }
    }
  }

  /**
   * Obtient les statistiques actuelles
   */
  getStats(): {
    totalAttempts: number;
    blockedIPs: number;
    averageAttempts: number;
  } {
    const attempts = Array.from(this.attempts.values());
    const blockedIPs = attempts.filter(a => a.attempts >= this.maxAttempts).length;
    const totalAttempts = attempts.reduce((sum, a) => sum + a.attempts, 0);
    const averageAttempts = attempts.length > 0 ? totalAttempts / attempts.length : 0;

    return {
      totalAttempts,
      blockedIPs,
      averageAttempts: Math.round(averageAttempts * 100) / 100,
    };
  }
}

// Instance singleton
export const antiSpam = new AntiSpamProtection();

/**
 * Hook React pour utiliser la protection anti-spam
 */
export function useAntiSpam() {
  const honeypot = antiSpam.generateHoneypot();

  return {
    honeypot,
    checkHoneypot: (formData: Record<string, any>) => 
      antiSpam.checkHoneypot(formData, honeypot.name),
    detectSuspiciousBehavior: (formData: Record<string, any>) =>
      antiSpam.detectSuspiciousBehavior(formData),
    canAttempt: (ip: string) => antiSpam.canAttempt(ip),
  };
}

/**
 * Utilitaire pour obtenir l'IP côté serveur
 */
export function getClientIP(request: Request): string {
  // Vérifier les headers de proxy
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback pour le développement
  return '127.0.0.1';
}