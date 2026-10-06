import { useEffect, useRef, useState } from 'react';
import { contentRequest } from '../utils/content';
import { useCommunitySession } from '../utils/communitySession';
let scriptPromise;
function loadGoogle() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptPromise) scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => { script.remove(); scriptPromise = null; reject(new Error('Google sign-in could not load. Check your connection and try again.')); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}
export default function GoogleCommunityLogin() {
  const { user, setSession, signOut } = useCommunitySession();
  const button = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (user) return;
    let active = true;
    async function prepare() {
      try {
        const config = await contentRequest('community/session/config', { public: true });
        if (!config.clientId) throw new Error('Google sign-in is awaiting setup. You can still use your private management links below.');
        const { nonce } = await contentRequest('community/session/nonce', { public: true });
        await loadGoogle();
        if (!active) return;
        window.google.accounts.id.initialize({ client_id: config.clientId, nonce, auto_select: false, callback: async response => {
          if (!active) return;
          setBusy(true); setError('');
          try {
            const result = await contentRequest('community/session/google', { public: true, method: 'POST', body: JSON.stringify({ credential: response.credential, nonce }) });
            if (active) setSession(result);
          } catch (err) { if (active) setError(err.message); }
          finally { if (active) setBusy(false); }
        } });
        button.current.replaceChildren();
        window.google.accounts.id.renderButton(button.current, { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', width: 260 });
        setReady(true);
      } catch (err) { if (active) setError(err.message); }
    }
    prepare();
    return () => { active = false; };
  }, [user, setSession, attempt]);
  if (user) return <div className="community-account"><p>Signed in as <strong>{user.name || user.email}</strong><span>{user.email}</span></p><button className="community-secondary" onClick={signOut}>Sign out</button></div>;
  return <section className="community-account"><div><h2>Keep your listings together.</h2><p>Sign in with Google to manage your posts on any device. No password to create.</p><div ref={button} className="community-google-button" />{!ready && !error && <p role="status">Loading Google sign-in…</p>}{busy && <p role="status">Signing in…</p>}{error && <p role="alert">{error} <button className="underline" onClick={() => { setError(''); setReady(false); setAttempt(v => v + 1); }}>Try again</button></p>}</div></section>;
}
