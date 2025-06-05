
// Utility function to sanitize HTML content and prevent XSS attacks
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Sanitize arrays of strings
export function sanitizeArray(arr: string[]): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => sanitizeText(item));
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
