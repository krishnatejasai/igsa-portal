import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import CommunityCard from '../components/CommunityCard';
import CommunityPostForm from '../components/CommunityPostForm';
import GoogleCommunityLogin from '../components/GoogleCommunityLogin';
import { memberRequest, rememberListing, forgetListing, useCommunitySession } from '../utils/communitySession';
import '../community.css';
export default function ManageCommunity() {
  const { id } = useParams();
  const { hash } = useLocation();
  const token = hash.slice(1);
  const { user } = useCommunitySession();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!token && !user) return;
    let active = true;
    memberRequest('community/' + id + '/manage', { method: 'POST', body: JSON.stringify({ token }) })
      .then(data => { if (active) { setItem(data); setError(''); if (token) rememberListing({ id, manageToken: token, name: data.name, location: data.location }); } }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [id, token, retry, user]);
  async function action(name) {
    if (busy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const data = await memberRequest('community/' + id + '/' + name, { method: 'POST', body: JSON.stringify({ token }) });
      if (name === 'delete') { setDeleted(true); forgetListing(id); }
      else { setItem(data); setMessage(name === 'claim' ? 'Linked to your Google account. Find it under My listings on any device.' : 'Your listing is closed and no longer visible publicly.'); }
    } catch (err) { setError(err.message); }
    finally { setBusy(false); setConfirmDelete(false); }
  }
  return <main className="community-page community-manage"><div className="community-shell"><Link to="/community/mine">← My listings</Link><h1>Manage your listing</h1><p>Edit your details, close the post when you find a partner, or delete it permanently.</p>
    {!deleted && <GoogleCommunityLogin />}
    {error && <p role="alert" className="notice notice-error">{error} <button className="underline" onClick={() => setRetry(v => v + 1)}>Retry</button></p>}
    {deleted ? <p role="status" className="community-receipt">Your listing has been deleted.</p> : item ? <><p className="community-note" role="status">Status: <strong>{item.status}</strong> · Visible through {item.expiresOn}</p>
      {editing ? <section className="community-compose"><h2>Edit listing</h2><CommunityPostForm key={item._id} kind={item.kind} initial={item} token={token} requestPath={'community/' + id + '/edit'} onSaved={data => { setItem(data); setEditing(false); setMessage('Changes saved.'); }} /><button className="community-secondary mt-4" onClick={() => setEditing(false)}>Cancel editing</button></section> : <CommunityCard item={item} />}
      {!editing && <div className="community-actions"><button className="community-button" disabled={busy} onClick={() => { setEditing(true); setMessage(''); }}>Edit listing</button>{item.status !== 'closed' && <button className="community-secondary" disabled={busy} onClick={() => action('close')}>Found a partner · close post</button>}<button className="community-danger" disabled={busy} onClick={() => setConfirmDelete(true)}>Delete listing</button>{user && token && <button className="community-secondary" disabled={busy} onClick={() => action('claim')}>Link to my Google account</button>}</div>}
      {confirmDelete && <div role="alert" className="notice notice-error mt-5"><p>Delete this listing permanently? This cannot be undone.</p><div className="community-actions"><button className="community-danger" disabled={busy} onClick={() => action('delete')}>Delete permanently</button><button className="community-secondary" disabled={busy} onClick={() => setConfirmDelete(false)}>Keep listing</button></div></div>}
      {busy && <p role="status">Saving…</p>}{message && <p className="community-receipt" role="status">{message}</p>}
    </> : !error && <p role="status">{token || user ? 'Loading your listing…' : 'Sign in with the Google account used to post, or open your private management link.'}</p>}
  </div></main>;
}
