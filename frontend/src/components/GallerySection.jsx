import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentRequest } from '../utils/content';

export default function GallerySection({ preview = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    contentRequest('gallery').then(data => { if (active) setItems(data); }).catch(() => { if (active) setError('We couldn’t load the gallery. Please try again.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);
  const filtered = items.filter(item => item.album.toLowerCase().includes(query.toLowerCase()));
  const visible = preview ? filtered.slice(0, 4) : filtered;
  return <section className="py-16 md:py-24 bg-slate-100"><div className="max-w-7xl mx-auto px-5 md:px-6">
    <div className="flex flex-wrap items-end justify-between gap-6 mb-10"><div><p className="text-orange-700 text-xs font-bold uppercase tracking-widest mb-3">Our community, in pictures</p><h2 className="text-3xl md:text-5xl font-bold text-blue-950">Memories made together.</h2><p className="text-slate-600 mt-4">Celebrations, new friendships, and life at UF.</p></div>{preview ? <Link to="/gallery" className="text-blue-900 font-semibold">Explore all albums →</Link> : <label className="text-sm font-semibold text-slate-600">Find an album<input className="field-input bg-white" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search events…" /></label>}</div>
    {loading ? <p role="status">Loading gallery…</p> : error ? <p role="alert" className="notice notice-error">{error} <button className="underline ml-2" onClick={() => { setError(''); setLoading(true); setRetry(prev => prev + 1); }}>Retry</button></p> : !visible.length ? <div className="bg-white rounded-3xl p-12 text-center text-slate-600">{query ? 'No albums match your search.' : 'Our next memories are on their way. Event photos will appear here.'}</div> : <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{visible.map(item => <Link key={item._id} to={`/gallery/${item._id}`} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition">
      <div className="h-56 bg-blue-950 overflow-hidden">{item.photos?.[0] || item.image ? <img src={item.photos?.[0] || item.image} alt={item.album} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /> : <div className="h-full flex flex-col justify-center px-6 bg-gradient-to-br from-blue-950 to-blue-800 text-white"><span className="text-blue-200 text-xs uppercase tracking-widest">IGSA / Photo collection</span><span className="text-3xl font-bold mt-4">Good times.<br />Great company.</span></div>}</div>
      <div className="p-5"><p className="text-xs text-orange-700 font-semibold mb-2">{item.externalUrl ? 'Full collection available ↗' : `${item.photos?.length || 0} highlights`}</p><h3 className="font-bold text-lg text-blue-950">{item.album}</h3><p className="text-sm text-slate-500 mt-2 line-clamp-2">{item.description}</p></div>
    </Link>)}</div>}
  </div></section>;
}
