import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GoogleCommunityLogin from '../components/GoogleCommunityLogin';
import CommunityPostForm from '../components/CommunityPostForm';
import { useCommunitySession } from '../utils/communitySession';
import Footer from '../components/Footer';
import CommunityCard from '../components/CommunityCard';
import { displayDate } from '../utils/community';
import { contentRequest } from '../utils/content';
import { getCachedPublicValue, clearPublicCache } from '../utils/publicCache';
import '../community.css';

export default function Community() {
  const [params, setParams] = useSearchParams();
  const kind = params.get('kind') === 'travel' ? 'travel' : 'roommate';
  const { user } = useCommunitySession();
  const [filters, setFilters] = useState({ q: '', origin: '', destination: '', date: '', stayType: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState(null);
  const [revision, setRevision] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [copied, setCopied] = useState(false);
  const travel = kind === 'travel';
  const query = new URLSearchParams(search);
  query.set('kind', kind); query.set('page', page);
  const path = `community?${query}`;
  const current = response?.path === path ? response : null;
  const result = getCachedPublicValue(path) || current?.data;
  const error = current?.error || '';
  const loading = !result && !error;
  useEffect(() => {
    let active = true;
    contentRequest(path, { public: true })
      .then(data => {
        if (active) setResponse({ path, data });
        // Load the other category after the visible one, making tab switching quick.
        if (active && !search && page === 1) {
          const other = kind === 'travel' ? 'roommate' : 'travel';
          contentRequest(`community?kind=${other}&page=1`, { public: true }).catch(() => {});
        }
      })
      .catch(err => { if (active) setResponse({ path, error: err.message }); });
    return () => { active = false; };
  }, [path, kind, search, page, revision]);
  function switchKind(next) {
    if (next === kind) return;
    setParams({ kind: next }); setPage(1); setSearch(''); setFilters({ q: '', origin: '', destination: '', date: '', stayType: '' }); setShowForm(false);
  }
  const manageUrl = receipt ? `${window.location.origin}/community/manage/${receipt.id}#${receipt.manageToken}` : '';
  const field = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  return <><main className="community-page">
    <header className="community-hero"><div className="community-shell"><p className="community-eyebrow">The IGSA community board</p><h1>A shared home.<br /><em>A little company.</em></h1><p>Find a roommate or someone heading your way.</p><div className="community-tabs" aria-label="Listing categories"><button aria-pressed={!travel} onClick={() => switchKind('roommate')}>⌂ Roommates</button><button aria-pressed={travel} onClick={() => switchKind('travel')}>↗ Travel partners</button></div></div></header>
    <div className="community-shell community-body">
      <div className="community-heading"><div><h2>{travel ? 'Who’s heading your way?' : 'Find your next roommate.'}</h2><p>{travel ? 'Orlando, Miami, Tampa, or somewhere new. Match a place and a date.' : 'A short stay or a longer chapter. Find someone to share it with.'}</p></div><div className="community-actions"><Link className="community-secondary" to="/community/mine">My listings / {user ? user.name.split(" ")[0] : "Sign in"}</Link><button className="community-button" aria-expanded={showForm} aria-controls="post-form" onClick={() => setShowForm(v => !v)}>{showForm ? 'Close form' : '+ Post a listing'}</button></div></div>
      {receipt && <section className="community-receipt" role="status"><h2>Your listing is live.</h2><p>Visible through {displayDate(receipt.expiresOn)}. Save this private link to edit, close, or delete your listing. Anyone with this link can manage your post.</p><label className="field-label">Private management link<input readOnly value={manageUrl} className="field-input" onFocus={event => event.target.select()} /></label><div className="community-actions"><button className="community-secondary" onClick={async () => { try { await navigator.clipboard.writeText(manageUrl); setCopied(true); } catch { setCopied(false); } }}>{copied ? 'Copied' : 'Copy link'}</button><Link to={manageUrl.replace(window.location.origin, '')}>Manage listing →</Link></div></section>}
      {showForm && <section id="post-form" className="community-compose"><h2>{travel ? 'Share your travel plans' : 'Post a roommate listing'}</h2><GoogleCommunityLogin /><CommunityPostForm key={kind} kind={kind} onSaved={data => { setReceipt(data); setCopied(false); setShowForm(false); setPage(1); setSearch(''); setFilters({ q: '', origin: '', destination: '', date: '', stayType: '' }); setRevision(v => v + 1); }} /></section>}
      <form className={`community-filters ${travel ? 'travel-filters' : 'roommate-filters'}`} onSubmit={event => { event.preventDefault(); clearPublicCache(); setSearch(new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString()); setPage(1); setRevision(v => v + 1); }}>
        {travel ? <><label className="field-label">From · departure city<input type="search" value={filters.origin} maxLength={100} onChange={e => field('origin', e.target.value)} placeholder="Gainesville" className="field-input" /></label><label className="field-label">To · destination<input type="search" value={filters.destination} maxLength={100} onChange={e => field('destination', e.target.value)} placeholder="Orlando" className="field-input" /></label></> : <label className="field-label">Area or name<input type="search" value={filters.q} maxLength={100} onChange={e => field('q', e.target.value)} placeholder="Try Gainesville" className="field-input" /></label>}
        {travel ? <label className="field-label">Date (optional)<input type="date" value={filters.date} onChange={e => field('date', e.target.value)} className="field-input" /></label> : <label className="field-label">Stay type<select className="field-input" value={filters.stayType} onChange={e => field('stayType', e.target.value)}><option value="">All options</option><option value="temporary">Temporary</option><option value="permanent">Permanent</option></select></label>}
        <button className="community-button">Search</button>
      </form>
      {loading ? <div className="community-empty" role="status">Finding community listings…</div> : error ? <div className="notice notice-error" role="alert">{error} <button className="underline" onClick={() => { setResponse(null); clearPublicCache(); setRevision(v => v + 1); }}>Retry</button></div> : result.items.length ? <div className="community-grid">{result.items.map(item => <CommunityCard key={item._id} item={item} />)}</div> : <div className="community-empty"><h3>{search ? 'No matches yet.' : 'Be the first to post.'}</h3><p>{search ? 'Try another city, date, or stay type.' : 'Share what you’re looking for and let the community find you.'}</p></div>}
      {!loading && !error && (page > 1 || result.hasMore) && <nav className="community-pagination" aria-label="Listing pages"><button className="community-secondary" disabled={page === 1} onClick={() => { setPage(v => v - 1); }}>Previous</button><span>Page {page}</span><button className="community-secondary" disabled={!result.hasMore} onClick={() => { setPage(v => v + 1); }}>Next</button></nav>}
      <p className="community-note">These are student-submitted listings. Confirm plans and details directly. To report a listing, email <a href="mailto:igsa.uf@gmail.com">igsa.uf@gmail.com</a> with the poster’s name and area or route.</p>
    </div>
  </main><Footer /></>;
}
