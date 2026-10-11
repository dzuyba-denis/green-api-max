/**
 * Cleans phone number or chatId input and converts to proper GREEN-API chatId format
 * Supports phone numbers (+7..., 8..., 7...) and raw IDs (10000000, etc.)
 */
export function normalizeChatId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  // If already contains @c.us or @g.us, clean the leading + if any
  if (trimmed.includes('@')) {
    return trimmed.replace(/^\+/, '');
  }

  // Remove spaces, hyphens, parentheses, plus
  const digits = trimmed.replace(/\D/g, '');

  // If 11 digits starting with 8 (Russian format: 8900...), replace 8 with 7
  if (digits.length === 11 && digits.startsWith('8')) {
    return `7${digits.slice(1)}@c.us`;
  }

  // If standard 11 digits starting with 7
  if (digits.length === 11 && digits.startsWith('7')) {
    return `${digits}@c.us`;
  }

  // If other international phone number (10 to 15 digits)
  if (digits.length >= 10 && digits.length <= 15) {
    return `${digits}@c.us`;
  }

  // Otherwise, it might be a MAX ID (e.g., 10000000) or custom id
  return digits || trimmed;
}

/**
 * Formats a chatId into a human-readable phone number or name
 */
export function formatChatIdDisplay(chatId: string): string {
  if (!chatId) return '';
  const clean = chatId.replace(/@c\.us$/, '').replace(/@g\.us$/, '');

  // If 11 digits starting with 7: +7 (999) 123-45-67
  if (/^7\d{10}$/.test(clean)) {
    return `+7 (${clean.slice(1, 4)}) ${clean.slice(4, 7)}-${clean.slice(7, 9)}-${clean.slice(9, 11)}`;
  }

  // If starts with other digits: +<digits>
  if (/^\d{10,15}$/.test(clean)) {
    return `+${clean}`;
  }

  return clean;
}

/**
 * Generates consistent initials from chat name or phone
 */
export function getInitials(nameOrPhone: string): string {
  if (!nameOrPhone) return '?';
  const clean = nameOrPhone.replace(/@.*$/, '').trim();

  // If words, take first letters of first 2 words
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  if (words.length === 1) {
    // If numbers, take last 2 digits or first 2
    if (/^\+?\d+$/.test(words[0])) {
      const d = words[0].replace(/\D/g, '');
      return d.slice(-2);
    }
    return words[0].slice(0, 2).toUpperCase();
  }

  return '?';
}
