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
        <div className="hero-actions hero-enter"><Link to="/events" className="home-button">Find your next event <span>↗</span></Link><Link to="/about" className="text-link">Get to know IGSA <span>→</span></Link></div>
        <div className="hero-footnote hero-enter"><span className="little-flower" aria-hidden="true">✳</span><span>Rooted in culture.<br /><strong>Growing together in Gainesville.</strong></span></div>
      </div>
      <div className="hero-art" ref={art} aria-label="An illustrated celebration of Indian culture and the UF community">
        <div className="rangoli-frame">
          <svg className="rangoli" viewBox="0 0 520 520" fill="none" aria-hidden="true">
            <circle cx="260" cy="260" r="248" stroke="currentColor" strokeOpacity=".18" strokeDasharray="2 10" />
            <g className="rangoli-outer">{Array.from({ length: 16 }, (_, i) => <g key={i} transform={`rotate(${i * 22.5} 260 260)`}><path d="M260 44C314 93 311 143 260 177C209 143 206 93 260 44Z" fill={i % 2 ? '#f2c8a0' : '#e8793d'} fillOpacity={i % 2 ? '.55' : '.9'} stroke="#c76636" strokeWidth="1" /><circle cx="260" cy="29" r="4" fill="#d56a32" /></g>)}</g>
            <g className="rangoli-inner">{Array.from({ length: 12 }, (_, i) => <path key={i} transform={`rotate(${i * 30} 260 260)`} d="M260 95C303 139 303 184 260 215C217 184 217 139 260 95Z" fill={i % 2 ? '#244d51' : '#183e49'} stroke="#fcf5e9" strokeWidth="2" />)}</g>
            <circle cx="260" cy="260" r="94" fill="#faf4e9" stroke="#d98c52" strokeWidth="2" />
            <circle cx="260" cy="260" r="82" stroke="#d98c52" strokeDasharray="1 5" />
            <text x="260" y="258" textAnchor="middle" fill="#172b40" fontFamily="Georgia,serif" fontSize="48" fontWeight="bold">IGSA</text>
            <text x="260" y="286" textAnchor="middle" fill="#765340" fontFamily="sans-serif" fontSize="11" letterSpacing="5">AT UF</text>
          </svg>
        </div>
        <div className="orbit-tag tag-culture"><span aria-hidden="true">✦</span><div><small>OUR ROOTS</small><strong>A culture worth sharing.</strong></div></div>
        <div className="orbit-tag tag-community"><span aria-hidden="true">☺</span><div><small>YOUR PEOPLE</small><strong>Find your home team.</strong></div></div>
        <span className="art-coordinate">29.6516° N / 82.3248° W</span>
        <span className="art-spark spark-one" aria-hidden="true">✧</span><span className="art-spark spark-two" aria-hidden="true">✧</span>
      </div>
    </div>
    <div className="hero-bottom home-shell"><span>YOUR NEXT CHAPTER STARTS HERE</span><a href="#community" className="scroll-cue">Take a look around <span aria-hidden="true">↓</span></a></div>
  </section>;
}
