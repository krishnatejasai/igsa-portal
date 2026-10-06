import { useSyncExternalStore } from 'react';
import { contentRequest } from './content';

const sessionKey = 'igsaCommunitySession';
const linksKey = 'igsaCommunityLinks';
const listeners = new Set();
function readSession() {
  try { return JSON.parse(localStorage.getItem(sessionKey)) || null; } catch { return null; }
}
let session = readSession();
function publish(next) {
  session = next;
  try { if (next) localStorage.setItem(sessionKey, JSON.stringify(next)); else localStorage.removeItem(sessionKey); } catch { /* In-memory sign-in still works. */ }
  listeners.forEach(listener => listener());
}
window.addEventListener('storage', event => { if (event.key === sessionKey) { session = readSession(); listeners.forEach(listener => listener()); } });
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener); };
export function useCommunitySession() {
  const value = useSyncExternalStore(subscribe, () => session);
  return { user: value?.user || null, setSession: publish, signOut: () => { publish(null); window.google?.accounts?.id.disableAutoSelect(); } };
}
export async function memberRequest(path, options = {}) {
  try {
    return await contentRequest(path, { ...options, public: true, headers: { ...(session?.token ? { Authorization: 'Bearer ' + session.token } : {}), ...options.headers } });
  } catch (error) {
    if (error.status === 401) publish(null);
    throw error;
  }
}
export function savedListings() {
  try {
    const values = JSON.parse(localStorage.getItem(linksKey) || '[]');
    return Array.isArray(values) ? values.filter(item => /^[a-f\d]{24}$/.test(item.id) && /^[a-f\d]{64}$/.test(item.manageToken)) : [];
  } catch { return []; }
}
export function rememberListing(item) {
  try { localStorage.setItem(linksKey, JSON.stringify([item, ...savedListings().filter(value => value.id !== item.id)].slice(0, 100))); } catch { /* Copyable private link remains available. */ }
}
export function forgetListing(id) {
  try { localStorage.setItem(linksKey, JSON.stringify(savedListings().filter(item => item.id !== id))); } catch { /* Storage may be unavailable. */ }
}
