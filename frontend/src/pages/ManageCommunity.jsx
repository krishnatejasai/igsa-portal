import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard';
import { contentRequest } from '../utils/content';
import '../community.css';
export default function ManageCommunity() {
  const { id } = useParams();
  const [token] = useState(() => window.location.hash.slice(1));
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    contentRequest(`community/${id}/manage`, { public: true, method: 'POST', body: JSON.stringify({ token }) })
      .then(data => { if (active) { setItem(data); setError(''); } }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [id, token, retry]);
  async function close() {
    setBusy(true); setError('');
    try { setItem(await contentRequest(`community/${id}/close`, { public: true, method: 'POST', body: JSON.stringify({ token }) })); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="community-page community-manage"><div className="community-shell"><Link to="/community">← Community board</Link><h1>Manage your listing</h1><p>Found someone? Close your post to remove it from the public board.</p>{error && <p role="alert" className="notice notice-error">{error} <button className="underline" onClick={() => setRetry(v => v + 1)}>Retry</button></p>}{item ? <><p className="community-note" role="status">Status: <strong>{item.status}</strong> · Expires {item.expiresOn}</p><CommunityCard item={item} />{item.status !== 'closed' && <button className="community-button" disabled={busy} onClick={close}>{busy ? 'Closing…' : 'Close my listing'}</button>}{item.status === 'closed' && <p className="community-receipt" role="status">Your listing is closed and no longer visible on the public board.</p>}</> : !error && <p role="status">Loading your listing…</p>}</div></main>;
}
