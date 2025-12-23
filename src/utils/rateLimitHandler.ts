interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public resetTime?: number,
    public limit?: number,
    public remaining?: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export const parseRateLimitHeaders = (headers: Headers): RateLimitInfo | null => {
  const limit = headers.get('X-RateLimit-Limit');
  const remaining = headers.get('X-RateLimit-Remaining');
  const reset = headers.get('X-RateLimit-Reset');

  if (limit && remaining && reset) {
    return {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10),
    };
  }

  return null;
};

export const formatResetTime = (resetTimestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const secondsUntilReset = resetTimestamp - now;
  
  if (secondsUntilReset <= 0) {
    return 'maintenant';
  }

  const minutes = Math.floor(secondsUntilReset / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `dans ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `dans ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `dans ${secondsUntilReset} seconde${secondsUntilReset > 1 ? 's' : ''}`;
  }
};

export const getRateLimitMessage = (error: RateLimitError): string => {
  let message = 'Limite de taux API GitHub atteinte. ';
  
  if (error.resetTime) {
    message += `Réessayez ${formatResetTime(error.resetTime)}. `;
  }
  
  message += 'L\'authentification OAuth augmente la limite de 60 à 5000 requêtes/heure.';
  
  return message;
};

