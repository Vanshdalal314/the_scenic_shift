// lib/rateLimit.js
const requests = new Map();

export function checkRateLimit(ip, limit = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const record = requests.get(ip) || { count: 0, start: now };

  if (now - record.start > windowMs) {
    requests.set(ip, { count: 1, start: now });
    return true;
  }

  if (record.count >= limit) return false;

  record.count++;
  requests.set(ip, record);
  return true;
}