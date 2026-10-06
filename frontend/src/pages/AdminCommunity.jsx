import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import CommunityCard from '../components/CommunityCard';
import { contentRequest } from '../utils/content';
import '../community.css';
export default function AdminCommunity() {
  const [status, setStatus] = useState('active');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], hasMore: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    contentRequest(`community/admin?status=${status}&page=${page}`)
      .then(data => { if (active) { setResult(data); setError(''); } }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [status, page, revision]);
  async function moderate(id, nextStatus) {
    setBusy(id); setError('');
    try { await contentRequest(`community/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) }); setLoading(true); setRevision(v => v + 1); }
    catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }
  return <AdminLayout><div className="community-heading"><div><h1 className="text-3xl font-bold text-blue-950">Community listings</h1><p>Posts publish immediately. Hide unwanted posts or restore a hidden listing.</p></div><label className="field-label">Status<select className="field-input" value={status} onChange={e => { setStatus(e.target.value); setPage(1); setLoading(true); }}><option value="active">Active (including expired)</option><option value="hidden">Hidden</option><option value="closed">Closed</option></select></label></div>{error && <p className="notice notice-error" role="alert">{error} <button className="underline" onClick={() => { setLoading(true); setRevision(v => v + 1); }}>Retry</button></p>}{loading ? <p role="status">Loading listings…</p> : <><div className="community-grid">{result.items.map(item => <CommunityCard key={item._id} item={item}><p className="community-help">Expires {item.expiresOn} · ID: {item._id}</p><div className="community-actions">{item.status !== 'hidden' && <button className="community-secondary" disabled={!!busy} onClick={() => moderate(item._id, 'hidden')}>{busy === item._id ? 'Saving…' : 'Hide listing'}</button>}{item.status === 'hidden' && <button className="community-secondary" disabled={!!busy} onClick={() => moderate(item._id, 'active')}>{busy === item._id ? 'Saving…' : 'Restore listing'}</button>}</div></CommunityCard>)}</div>{!result.items.length && <p className="community-empty">No {status} listings.</p>}<nav className="community-pagination" aria-label="Listing pages"><button className="community-secondary" disabled={page === 1} onClick={() => { setLoading(true); setPage(v => v - 1); }}>Previous</button><span>Page {page}</span><button className="community-secondary" disabled={!result.hasMore} onClick={() => { setLoading(true); setPage(v => v + 1); }}>Next</button></nav></>}</AdminLayout>;
}
