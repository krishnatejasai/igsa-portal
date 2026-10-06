// Memory-only cache for non-sensitive public content; community contacts are never cached.
const entries = new Map();
let version = 0;
export function clearPublicCache() { version += 1; entries.clear(); }
export function cachedPublicRequest(key, request, now = Date.now()) {
  const existing = entries.get(key);
  if (existing && existing.expires > now) return existing.promise;
  const generation = version;
  const entry = { expires: Infinity };
  entry.promise = request().then(value => {
    if (generation === version && entries.get(key) === entry) entry.expires = Date.now() + 60000;
    return value;
  }).catch(error => { if (entries.get(key) === entry) entries.delete(key); throw error; });
  entries.set(key, entry);
  return entry.promise;
}
