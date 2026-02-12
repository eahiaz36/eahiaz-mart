export function sanitizeSearch(q: string) {
  // Basic sanitization to reduce operator injection in text search
  return q.replace(/[^\p{L}\p{N}\s\-_.]/gu, "").trim().slice(0, 80);
}
