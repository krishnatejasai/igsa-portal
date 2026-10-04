import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { contentRequest } from '../utils/content';

export default function BoardSection({ preview = true }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    contentRequest('board-members', { public: true }).then(data => { if (active) setMembers(data); }).catch(() => { if (active) setError('We couldn’t load the team. Please try again.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);
  const visible = preview ? members.slice(0, 4) : members;
  return <section className="py-16 md:py-24 bg-[#fffdf9]"><div className="max-w-7xl mx-auto px-5 md:px-8">
    <div className="flex flex-wrap items-end justify-between gap-6 mb-10"><div><p className="text-xs tracking-[.16em] font-bold text-[#b94b00] mb-3">THE PEOPLE BEHIND IGSA</p><h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#003b80]">Your community. Our commitment.</h2><p className="text-slate-600 mt-4 max-w-xl">Meet the students making it all happen.</p></div>{preview && <Link to="/board" className="text-sm font-semibold text-[#003b80] border-b border-slate-300 pb-2">Meet the whole team ↗</Link>}</div>
    {loading ? <p role="status" className="text-slate-500">Loading the team…</p> : error ? <p role="alert" className="notice notice-error">{error}<button onClick={() => { setError(''); setLoading(true); setRetry(value => value + 1); }} className="underline ml-3">Retry</button></p> : !members.length ? <p className="text-slate-600">Our team profiles will be here soon.</p> : <div className={`grid sm:grid-cols-2 ${preview ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-6`}>{visible.map(member => <article key={member._id} className={`${preview ? "board-preview-card" : ""} group bg-white rounded-2xl border border-[#e5e0d4] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5`}>
      <div className="board-profile flex items-center gap-5 mb-5">{member.image ? <img src={member.image} alt={member.name} loading="lazy" width="88" height="104" className="w-[88px] h-[104px] rounded-xl object-cover transition duration-500 group-hover:scale-105" /> : <div className="w-[88px] h-[104px] shrink-0 rounded-xl bg-[#e3f7ec] text-[#176b2d] flex items-center justify-center text-2xl font-semibold">{member.name.split(' ').map(word => word[0]).slice(0, 2).join('')}</div>}<div><p className="text-xs font-semibold text-[#b94b00] mb-2">{member.position}</p><h3 className="text-xl font-semibold tracking-tight text-[#003b80] leading-snug">{member.name}</h3></div></div>
      <p className="board-bio text-sm leading-relaxed text-slate-600">{member.description}</p>{!preview && member.email && <a href={`mailto:${member.email}`} className="inline-block text-xs text-[#176b2d] mt-5 break-all hover:underline">{member.email} ↗</a>}
    </article>)}</div>}
  </div></section>;
}
