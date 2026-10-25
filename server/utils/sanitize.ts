/**
 * Input sanitization helpers to protect against XSS and malicious payloads
 */

export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '') // Strip HTML tags from plain text fields
    .replace(/javascript:/gi, '')
    .trim();
}

export function sanitizeHtml(input: unknown): string {
  if (typeof input !== 'string') return '';
  // Strip potentially executable scripts, event handlers, and data URIs
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // remove onclick, onload, etc.
    .replace(/javascript:/gi, '')
    .trim();
}
