import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import CommunityCard from '../components/CommunityCard';
import { displayDate, travelLabels } from '../utils/community';
import { contentRequest } from '../utils/content';
import '../community.css';

const currentDay = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
function PostForm({ kind, onCreated }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const sending = useRef(false);
  const [stay, setStay] = useState('temporary');
  const travel = kind === 'travel';
  async function submit(event) {
    event.preventDefault();
    if (sending.current) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    sending.current = true; setBusy(true); setError('');
    try {
      const result = await contentRequest('community', { public: true, method: 'POST', body: JSON.stringify({ ...values, kind, consent: values.consent === 'on' }) });
      onCreated({ ...result, title: values.title });
    } catch (err) { setError(err.message); }
    finally { sending.current = false; setBusy(false); }
  }
  return <form className="community-form" onSubmit={submit}>
    <div className="community-form-grid">
      <label className="field-label">Your name<input name="name" required maxLength={70} autoComplete="name" className="field-input" /></label>
      <label className="field-label">Listing title<input name="title" required maxLength={100} placeholder={travel ? 'Heading to Orlando this weekend' : 'Looking for a roommate near UF'} className="field-input" /></label>
      {travel ? <label className="field-label">Travel option<select name="travelMode" className="field-input">{Object.entries(travelLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label> : <label className="field-label">Stay type<select name="stayType" value={stay} onChange={e => setStay(e.target.value)} className="field-input"><option value="temporary">Temporary</option><option value="permanent">Permanent / long-term</option></select></label>}
      <label className="field-label">{travel ? 'Departure city' : 'Area / city'}<input name="location" required maxLength={100} placeholder="Gainesville, FL" className="field-input" /></label>
      {travel ? <label className="field-label">Destination<input name="destination" required maxLength={100} placeholder="Orlando, Miami, Tampa, or anywhere" className="field-input" /></label> : <label className="field-label">Monthly budget (optional)<input name="budget" maxLength={40} placeholder="e.g. $700–900 per person" className="field-input" /></label>}
      <label className="field-label">{travel ? 'Departure date' : 'Move-in date'}<input type="date" name="startDate" required min={currentDay()} className="field-input" /></label>
      <label className="field-label">{travel ? 'Return date (optional)' : stay === 'temporary' ? 'Stay ends' : 'Stay ends (optional)'}<input type="date" name="endDate" required={!travel && stay === 'temporary'} min={currentDay()} className="field-input" /></label>
      <label className="field-label">Email<input type="email" name="email" maxLength={254} autoComplete="email" className="field-input" /></label>
      <label className="field-label">Phone<input type="tel" name="phone" maxLength={25} autoComplete="tel" placeholder="+1 352 555 0123" className="field-input" /></label>
      <label className="field-label community-wide">A few details (optional)<textarea name="details" rows={4} maxLength={1200} placeholder={travel ? 'Departure time, available seats, luggage, and any shared costs.' : 'About the room, lease, move-in flexibility, and roommate preferences. Please leave out your exact address.'} className="field-input" /></label>
    </div>
    <p className="community-help">Add at least one contact method. Travel posts expire after departure day. Roommate posts stay visible for up to 60 days, or until the stay ends.</p>
    <label className="community-consent"><input type="checkbox" name="consent" required /> <span>I agree to display my name, listing, and provided email/phone publicly so students can contact me.</span></label>
    {error && <p role="alert" className="notice notice-error">{error}</p>}
    <button className="community-button" disabled={busy} aria-busy={busy}>{busy ? 'Publishing…' : 'Publish listing ↗'}</button>
    {busy && <p role="status" className="community-help">Publishing your post. The server may take a moment to respond.</p>}
  </form>;
}
export default function Community() {
  const [params, setParams] = useSearchParams();
  const kind = params.get('kind') === 'travel' ? 'travel' : 'roommate';
  const [filters, setFilters] = useState({ q: '', from: '', to: '', stayType: '', travelMode: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], hasMore: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [copied, setCopied] = useState(false);
  const travel = kind === 'travel';
  useEffect(() => {
    let active = true;
    const query = new URLSearchParams(search);
    query.set('kind', kind); query.set('page', page);
    contentRequest(`community?${query}`, { public: true })
      .then(data => { if (active) { setResult(data); setError(''); } })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [kind, search, page, revision]);
  function switchKind(next) {
    if (next === kind) return;
    setParams({ kind: next }); setPage(1); setSearch(''); setFilters({ q: '', from: '', to: '', stayType: '', travelMode: '' }); setLoading(true); setShowForm(false);
  }
  const manageUrl = receipt ? `${window.location.origin}/community/manage/${receipt.id}#${receipt.manageToken}` : '';
  const field = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  return <><main className="community-page">
    <header className="community-hero"><div className="community-shell"><p className="community-eyebrow">The IGSA community board</p><h1>A shared home.<br /><em>A little company.</em></h1><p>Find a roommate or someone heading your way.</p><div className="community-tabs" aria-label="Listing categories"><button aria-pressed={!travel} onClick={() => switchKind('roommate')}>⌂ Roommates</button><button aria-pressed={travel} onClick={() => switchKind('travel')}>↗ Travel partners</button></div></div></header>
    <div className="community-shell community-body">
      <div className="community-heading"><div><h2>{travel ? 'Who’s heading your way?' : 'Find your next roommate.'}</h2><p>{travel ? 'Orlando, Miami, Tampa, or somewhere new. Match a place and a date.' : 'A short stay or a longer chapter. Find someone to share it with.'}</p></div><button className="community-button" aria-expanded={showForm} aria-controls="post-form" onClick={() => setShowForm(v => !v)}>{showForm ? 'Close form' : '+ Post a listing'}</button></div>
      {receipt && <section className="community-receipt" role="status"><h2>Your listing is live.</h2><p>Visible through {displayDate(receipt.expiresOn)}. Save this private link to close your listing once you’ve found someone. Anyone with this link can close your post.</p><label className="field-label">Private management link<input readOnly value={manageUrl} className="field-input" onFocus={event => event.target.select()} /></label><div className="community-actions"><button className="community-secondary" onClick={async () => { try { await navigator.clipboard.writeText(manageUrl); setCopied(true); } catch { setCopied(false); } }}>{copied ? 'Copied' : 'Copy link'}</button><Link to={manageUrl.replace(window.location.origin, '')}>Manage listing →</Link></div></section>}
      {showForm && <section id="post-form" className="community-compose"><h2>{travel ? 'Share your travel plans' : 'Post a roommate listing'}</h2><PostForm key={kind} kind={kind} onCreated={data => { setReceipt(data); setCopied(false); setShowForm(false); setPage(1); setSearch(''); setFilters({ q: '', from: '', to: '', stayType: '', travelMode: '' }); setLoading(true); setRevision(v => v + 1); }} /></section>}
      <form className="community-filters" onSubmit={event => { event.preventDefault(); setSearch(new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString()); setPage(1); setLoading(true); setRevision(v => v + 1); }}>
        <label className="field-label">{travel ? 'City or destination' : 'Area or keyword'}<input type="search" value={filters.q} maxLength={100} onChange={e => field('q', e.target.value)} placeholder={travel ? 'Try Orlando' : 'Try Gainesville'} className="field-input" /></label>
        <label className="field-label">{travel ? 'Departing from' : 'Move-in from'}<input type="date" value={filters.from} onChange={e => field('from', e.target.value)} className="field-input" /></label>
        <label className="field-label">Through<input type="date" min={filters.from} value={filters.to} onChange={e => field('to', e.target.value)} className="field-input" /></label>
        <label className="field-label">{travel ? 'Travel option' : 'Stay type'}<select className="field-input" value={travel ? filters.travelMode : filters.stayType} onChange={e => field(travel ? 'travelMode' : 'stayType', e.target.value)}><option value="">All options</option>{travel ? Object.entries(travelLabels).map(([v, label]) => <option key={v} value={v}>{label}</option>) : <><option value="temporary">Temporary</option><option value="permanent">Permanent</option></>}</select></label>
        <button className="community-button">Search</button>
      </form>
      {loading ? <div className="community-empty" role="status">Finding community listings…</div> : error ? <div className="notice notice-error" role="alert">{error} <button className="underline" onClick={() => { setLoading(true); setRevision(v => v + 1); }}>Retry</button></div> : result.items.length ? <div className="community-grid">{result.items.map(item => <CommunityCard key={item._id} item={item} />)}</div> : <div className="community-empty"><h3>{search ? 'No matches yet.' : 'Be the first to post.'}</h3><p>{search ? 'Try another city, date range, or stay type.' : 'Share what you’re looking for and let the community find you.'}</p></div>}
      {!loading && !error && (page > 1 || result.hasMore) && <nav className="community-pagination" aria-label="Listing pages"><button className="community-secondary" disabled={page === 1} onClick={() => { setLoading(true); setPage(v => v - 1); }}>Previous</button><span>Page {page}</span><button className="community-secondary" disabled={!result.hasMore} onClick={() => { setLoading(true); setPage(v => v + 1); }}>Next</button></nav>}
      <p className="community-note">These are student-submitted listings. Confirm plans and details directly. To report a listing, email <a href="mailto:igsa.uf@gmail.com">igsa.uf@gmail.com</a> with its title and the poster’s name.</p>
    </div>
  </main><Footer /></>;
}
