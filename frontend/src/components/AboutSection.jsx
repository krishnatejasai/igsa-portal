import { Link } from 'react-router-dom';

const pillars = [
  { number: '01', icon: '✺', title: 'Celebrate your roots.', text: 'From the colors of Holi to the lights of Diwali, bring a piece of home to campus.', label: 'Culture & celebrations', to: '/gallery', tone: 'peach' },
  { number: '02', icon: '↗', title: 'Build your next chapter.', text: 'Meet new people, exchange ideas, and grow through shared experiences.', label: 'Connections & growth', to: '/events', tone: 'sage' },
  { number: '03', icon: '⌂', title: 'Find your people.', text: 'A warm welcome, a familiar conversation, and a community to lean on.', label: 'Community & belonging', to: '/contact', tone: 'lavender' },
];
export default function AboutSection() {
  return <section id="community" className="community-section"><div className="home-shell">
    <div className="section-heading" data-reveal><div><p className="eyebrow">FAR FROM HOME. CLOSE TO EACH OTHER.</p><h2>More than an association.<br /><em>A place to belong.</em></h2></div><p>Graduate life is a big adventure. We’re here to make it a little more connected, colorful, and memorable.</p></div>
    <div className="pillar-grid">{pillars.map((pillar, index) => <Link key={pillar.number} to={pillar.to} className={`pillar-card ${pillar.tone}`} data-reveal style={{ '--delay': `${index * 100}ms` }}><div className="pillar-top"><span>{pillar.number} /</span><span className="pillar-icon" aria-hidden="true">{pillar.icon}</span></div><h3>{pillar.title}</h3><p>{pillar.text}</p><div className="pillar-link">{pillar.label}<span>↗</span></div></Link>)}</div>
  </div></section>;
}
