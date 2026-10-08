// Memory only: never persist public contact listings to browser storage.
const entries = new Map();
let version = 0;
export function publicCacheKey(path) {
  const [route, query = ''] = path.split('?');
  const params = new URLSearchParams(query);
  params.sort();
  return route + (params.size ? `?${params}` : '');
}
export function publicCacheTTL(path) {
  return path.startsWith('community?') ? 30000 : 60000;
}
export function isPublicCachePath(path) {
  return /^(events|board-members)$/.test(path) || path === 'gallery?summary=1' || path.startsWith('community?');
}
export function clearPublicCache() { version += 1; entries.clear(); }
export function getCachedPublicValue(path, now = Date.now()) {
  const entry = entries.get(publicCacheKey(path));
  return entry && entry.expires > now ? entry.value : undefined;
}
export function cachedPublicRequest(path, request, now = Date.now()) {
  const key = publicCacheKey(path);
  const existing = entries.get(key);
  if (existing && existing.expires > now) return existing.promise;
  const generation = version;
  const entry = { expires: Infinity };
  entry.promise = request().then(value => {
    if (generation === version && entries.get(key) === entry) {
      entry.value = value;
      entry.expires = Date.now() + publicCacheTTL(path);
    }
    return value;
  }).catch(error => { if (entries.get(key) === entry) entries.delete(key); throw error; });
  // Bound memory when students try many searches.
  if (entries.size >= 40) entries.delete(entries.keys().next().value);
  entries.set(key, entry);
  return entry.promise;
}
