import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { canManageBoard, canManageGallery } from '../config/permissions';
import { contentRequest } from '../utils/content';

export default function ContentManager({ kind }) {
  const board = kind === 'board';
  const base = board ? 'board-members' : 'gallery';
  const allowed = board ? canManageBoard() : canManageGallery();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [retry, setRetry] = useState(0);
  const [deleting, setDeleting] = useState('');
  useEffect(() => {
    let active = true;
    contentRequest(base).then(data => { if (active) setItems(data); }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [base, retry]);
  async function remove(item) {
    if (!window.confirm(`Remove “${board ? item.name : item.album}” from the website?${!board && item.externalUrl ? ' The linked external album will not be deleted.' : ''}`)) return;
    setDeleting(item._id);
    setError('');
    try { await contentRequest(`${base}/${item._id}`, { method: 'DELETE' }); setItems(prev => prev.filter(row => row._id !== item._id)); }
    catch (err) { setError(err.message); }
    finally { setDeleting(''); }
  }
  const filtered = items.filter(item => `${item.name || item.album} ${item.position || ''}`.toLowerCase().includes(query.toLowerCase()));
  return <AdminLayout>
    <div className="flex flex-wrap justify-between items-start gap-5 mb-8"><div><p className="text-xs uppercase tracking-widest text-orange-700 font-bold">Community / {board ? 'People' : 'Memories'}</p><h1 className="text-3xl md:text-4xl font-bold text-blue-950 mt-2">{board ? 'Board members' : 'Gallery albums'}</h1><p className="text-slate-600 mt-3">{board ? 'Edit profiles and set their display order. Lower numbers appear first.' : 'Manage event highlights and full album links in one place.'}</p></div>{allowed && <Link to={`/admin/${kind}/${board ? 'create' : 'upload'}`} className="bg-blue-950 text-white px-5 py-3 rounded-xl font-semibold">+ Add {board ? 'member' : 'album'}</Link>}</div>
    {location.state?.message && <p role="status" className="notice mb-5">{location.state.message}</p>}
    {error && <div role="alert" className="notice notice-error mb-5">{error} <button onClick={() => { setError(''); setLoading(true); setRetry(prev => prev + 1); }} className="underline font-bold ml-3">Retry</button></div>}
    <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-3"><label className="flex-1 max-w-md text-sm font-semibold text-slate-600">Search {board ? 'members or positions' : 'albums'}<input type="search" value={query} onChange={event => setQuery(event.target.value)} className="field-input" placeholder={board ? 'Search the team…' : 'Find an event album…'} /></label><p className="text-sm text-slate-500">{items.length} {board ? 'members' : 'albums'}</p></div>
    {loading ? <p role="status">Loading…</p> : !filtered.length ? <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center"><h2 className="font-bold text-xl text-blue-950">{query ? 'No matches found' : `No ${board ? 'members' : 'albums'} yet`}</h2><p className="mt-3 text-slate-600">{query ? 'Try a different search.' : board ? 'Add a profile to introduce your team to the community.' : 'Start with a shared Drive link or upload your first highlights.'}</p></div> : <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">{filtered.map(item => <article key={item._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {!board && (item.photos?.[0] || item.image ? <img src={item.photos?.[0] || item.image} alt={item.album} loading="lazy" className="h-48 w-full object-cover" /> : <div className="h-48 bg-gradient-to-br from-blue-950 to-blue-800 text-blue-100 flex items-center justify-center text-xl font-semibold">IGSA Memories ↗</div>)}
      <div className="p-6">{board && <div className="mb-4">{item.image ? <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center text-xl font-bold">{item.name.split(' ').map(word => word[0]).slice(0, 2).join('')}</div>}</div>}<h2 className="text-xl font-bold text-blue-950 break-words">{board ? item.name : item.album}</h2><p className="text-sm text-slate-500 mt-2">{board ? `${item.position} · Order ${item.displayOrder ?? 1000}` : `${item.photos?.length || 0} highlights${item.externalUrl ? ' · Full album linked' : ''}`}</p><p className="text-sm text-slate-600 mt-3 line-clamp-2">{item.description}</p>
      <div className="flex flex-wrap gap-4 items-center mt-5 pt-4 border-t border-slate-100"><Link to={board ? '/board' : `/gallery/${item._id}`} className="text-sm font-semibold text-slate-600">View public page</Link>{allowed && <><Link to={`/admin/${kind}/edit/${item._id}`} className="text-sm font-bold text-blue-800">Edit</Link><button disabled={Boolean(deleting)} onClick={() => remove(item)} className="text-sm text-red-700 disabled:opacity-50">{deleting === item._id ? 'Removing…' : 'Remove'}</button></>}</div></div>
    </article>)}</div>}
  </AdminLayout>;
}
