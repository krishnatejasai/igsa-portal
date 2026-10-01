import { useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import EventsSection from '../components/EventsSection';
import BoardSection from '../components/BoardSection';
import GallerySection from '../components/GallerySection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import '../home.css';

export default function Home() {
  const root = useRef(null);
  const progress = useRef(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    const elements = root.current.querySelectorAll('[data-reveal]');
    elements.forEach(element => { element.classList.add('reveal-ready'); observer.observe(element); });
    let frame;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.current?.style.setProperty('transform', `scaleX(${max > 0 ? window.scrollY / max : 0})`);
      });
    }
    function preference() { root.current?.classList.toggle('system-reduced', media.matches); }
    preference(); update();
    media.addEventListener('change', preference);
    window.addEventListener('scroll', update, { passive: true });
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', update); media.removeEventListener('change', preference); };
  }, []);
  return <div ref={root} className={`igsa-home ${paused ? 'motion-paused' : ''}`}>
    <div ref={progress} className="reading-progress" aria-hidden="true" />
    <Hero />
    <div className="culture-ribbon"><p className="sr-only">Culture. Connection. Community. Go Gators.</p><div className="ribbon-track" aria-hidden="true">{[0, 1].map(copy => <div className="ribbon-group" key={copy}><span>CULTURE</span><i>✳</i><span>CONNECTION</span><i>✳</i><span>COMMUNITY</span><i>✳</i><span>GO GATORS</span><i>✳</i></div>)}</div></div>
    <AboutSection />
    <div className="home-events" data-reveal><EventsSection /></div>
    <section className="belong-banner"><div className="home-shell" data-reveal><span className="banner-flower" aria-hidden="true">✳</span><p>Different journeys.<br /><em>One community.</em></p><a href="mailto:igsa.uf@gmail.com" className="home-button light">Say hello <span>↗</span></a></div></section>
    <div className="home-board" data-reveal><BoardSection /></div>
    <div className="home-gallery" data-reveal><GallerySection preview /></div>
    <div className="home-contact" data-reveal><ContactSection /></div>
    <Footer />
    <button type="button" className="motion-toggle" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? '▶ Resume animations' : 'Ⅱ Pause animations'}</button>
  </div>;
}
