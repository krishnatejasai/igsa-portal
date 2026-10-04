import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/igsa-logo-clean.png';

const links = [['Home', '/'], ['About', '/about'], ['Events', '/events'], ['Board', '/board'], ['Gallery', '/gallery'], ['Contact', '/contact']];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return <nav aria-label="Main navigation" className="fixed inset-x-0 top-0 z-50 bg-[#fffdf9]/95 backdrop-blur-xl border-b border-[#003b80]/10">
    <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between gap-5">
      <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 shrink-0"><img src={logo} alt="IGSA UF" className="h-12 w-12 object-contain mix-blend-multiply" /><div><p className="text-lg font-bold tracking-tight text-[#003b80]">IGSA <span className="font-normal text-[#b94b00]">/ UF</span></p><p className="text-[9px] tracking-widest uppercase text-slate-500">A home away from home</p></div></Link>
      <div className="hidden lg:flex items-center gap-7 text-[13px] font-medium">{links.map(([label, path]) => <NavLink key={path} end={path === '/'} to={path} className={({ isActive }) => `py-2 transition-colors ${isActive ? 'text-[#b94b00] border-b border-[#b94b00]' : 'text-[#3f493b] hover:text-[#b94b00]'}`}>{label}</NavLink>)}</div>
      <Link to="/admin/login" className="hidden lg:inline-flex text-xs font-semibold border border-[#003b80]/25 px-5 py-2.5 rounded-full text-[#003b80] hover:bg-[#003b80] hover:text-white transition">Board Login ↗</Link>
      <button onClick={() => setOpen(value => !value)} type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} className="lg:hidden text-2xl w-11 h-11 rounded-xl text-[#003b80]">{open ? '×' : '☰'}</button>
    </div>
    {open && <div id="mobile-menu" className="lg:hidden bg-[#fffdf9] border-t border-slate-200 px-6 py-5 shadow-lg flex flex-col gap-4">{links.map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `font-medium ${isActive ? 'text-[#b94b00]' : 'text-[#003b80]'}`}>{label}</NavLink>)}<Link to="/admin/login" onClick={() => setOpen(false)} className="bg-[#003b80] text-white rounded-xl p-3 text-center">Board Login</Link></div>}
  </nav>;
}
