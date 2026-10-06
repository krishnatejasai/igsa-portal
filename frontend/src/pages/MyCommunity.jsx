import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GoogleCommunityLogin from '../components/GoogleCommunityLogin';
import CommunityCard from '../components/CommunityCard';
import { memberRequest, savedListings, useCommunitySession } from '../utils/communitySession';
import '../community.css';
export default function MyCommunity() {
  const { user } = useCommunitySession();
  const [local] = useState(savedListings);
  const [result, setResult] = useState({ items: [], hasMore: false });
  const [loadedUser, setLoadedUser] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!user) return;
    let active = true;
    memberRequest('community/mine?page=' + page).then(data => { if (active) { setResult(data); setError(''); setLoadedUser(user.sub + ':' + page); } }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [user, page, retry]);
  return <main className="community-page community-manage"><div className="community-shell"><Link to="/community">← Find roommates & travel partners</Link><h1>My listings</h1><GoogleCommunityLogin />
    {user && <section><h2 className="text-2xl font-bold mt-8 mb-5">Linked to your Google account</h2>{error ? <p role="alert" className="notice notice-error">{error} <button className="underline" onClick={() => setRetry(v => v + 1)}>Retry</button></p> : loadedUser !== user.sub + ':' + page ? <p role="status">Loading your listings…</p> : <><div className="community-owned-grid">{result.items.map(item => <CommunityCard key={item._id} item={item}><p className="community-help">{item.status} · Visible through {item.expiresOn}</p><Link className="community-secondary" to={'/community/manage/' + item._id}>Edit or remove →</Link></CommunityCard>)}</div>{!result.items.length && <p className="community-empty">No linked listings yet. Post while signed in, or open an existing private link and choose “Link to my Google account.”</p>}<div className="community-pagination"><button disabled={page === 1} className="community-secondary" onClick={() => setPage(v => v - 1)}>Previous</button><span>Page {page}</span><button disabled={!result.hasMore} className="community-secondary" onClick={() => setPage(v => v + 1)}>Next</button></div></>}</section>}
    <section className="community-local-links"><h2>Private links saved on this browser</h2><p>These links work without signing in. Older posts may need the private link you saved when publishing. Shared-browser users can access links saved here.</p>{local.length ? local.map(item => <Link key={item.id} className="community-saved-link" to={'/community/manage/' + item.id + '#' + item.manageToken}>{item.name || 'Your listing'} · {item.location || 'Manage post'} →</Link>) : <p>No saved links on this browser.</p>}</section><Link className="community-button" to="/community">Post a new listing ↗</Link>
  </div></main>;
}
