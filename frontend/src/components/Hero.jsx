import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const art = useRef(null);
  function move(event) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    art.current.style.setProperty('--tilt-x', `${(event.clientX - box.left - box.width / 2) / 45}deg`);
    art.current.style.setProperty('--tilt-y', `${-(event.clientY - box.top - box.height / 2) / 45}deg`);
  }
  function reset() {
    art.current.style.setProperty('--tilt-x', '0deg');
    art.current.style.setProperty('--tilt-y', '0deg');
  }
  return <section className="home-hero" onPointerMove={move} onPointerLeave={reset}>
    <div className="hero-glow" aria-hidden="true" />
    <div className="home-shell hero-grid">
      <div className="hero-copy">
        <p className="eyebrow hero-enter"><span className="status-dot" /> UNIVERSITY OF FLORIDA · GAINESVILLE</p>
        <h1 className="hero-enter">A little India.<br />A lot of <span className="hero-italic">belonging.<svg viewBox="0 0 500 25" aria-hidden="true"><path d="M5 18Q245 -8 492 13" /></svg></span></h1>
        <p className="hero-description hero-enter">New city. Familiar faces. A community that feels like home. We’re the Indian Graduate Student Association at UF.</p>
        <div className="hero-actions hero-enter"><Link to="/events" className="home-button">Find your next event <span>↗</span></Link><Link to="/community" className="text-link">Find roommates & travel partners <span>→</span></Link></div>
      </div>
      <div className="hero-art" ref={art} aria-label="An illustrated celebration of Indian culture and the UF community">
        <div className="rangoli-frame">
          <svg className="rangoli" viewBox="0 0 520 520" fill="none" aria-hidden="true">
            <circle cx="260" cy="260" r="248" stroke="currentColor" strokeOpacity=".18" strokeDasharray="2 10" />
            <g className="rangoli-outer">{Array.from({ length: 16 }, (_, i) => <g key={i} transform={`rotate(${i * 22.5} 260 260)`}><path d="M260 44C314 93 311 143 260 177C209 143 206 93 260 44Z" fill={i % 2 ? '#f79827' : '#ed7815'} fillOpacity="1" stroke="#d76812" strokeWidth="1" /><circle cx="260" cy="29" r="4" fill="#d76812" /></g>)}</g>
            <g className="rangoli-inner">{Array.from({ length: 12 }, (_, i) => <path key={i} transform={`rotate(${i * 30} 260 260)`} d="M260 95C303 139 303 184 260 215C217 184 217 139 260 95Z" fill={i % 2 ? '#138808' : '#247337'} stroke="#ffffff" strokeWidth="1.5" />)}</g>
            <circle cx="260" cy="260" r="94" fill="#ffffff" stroke="#ce7c29" strokeWidth="1.5" />
            <circle cx="260" cy="260" r="82" stroke="#ce7c29" strokeDasharray="1 5" />
            <text x="260" y="258" textAnchor="middle" fill="#003b80" fontFamily="Georgia,serif" fontSize="48" fontWeight="bold">IGSA</text>
            <text x="260" y="286" textAnchor="middle" fill="#005bbb" fontFamily="sans-serif" fontSize="11" letterSpacing="5">AT UF</text>
          </svg>
        </div>
      </div>
    </div>
  </section>;
}
