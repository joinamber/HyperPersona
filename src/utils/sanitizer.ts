
// Utility function to sanitize HTML content and prevent XSS attacks
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Only remove truly dangerous content, preserve normal punctuation and apostrophes
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Sanitize arrays of strings
export function sanitizeArray(arr: string[]): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => sanitizeText(item)).filter(Boolean);
}

// Validate and sanitize persona data
export function sanitizePersona(persona: any) {
  if (!persona || typeof persona !== 'object') {
    return null;
  }

  return {
    id: sanitizeText(persona.id || ''),
    name: sanitizeText(persona.name || ''),
    age: sanitizeText(persona.age || ''),
    occupation: sanitizeText(persona.occupation || ''),
    location: sanitizeText(persona.location || ''),
    reasoning: sanitizeText(persona.reasoning || ''),
    marketingChannel: sanitizeText(persona.marketingChannel || ''),
    interests: sanitizeArray(persona.interests || []),
    values: sanitizeArray(persona.values || []),
    purchaseBehavior: sanitizeArray(persona.purchaseBehavior || []),
    researchQuestions: sanitizeArray(persona.researchQuestions || [])
  };
}
