import { displayDate, travelLabels } from '../utils/community';
export default function CommunityCard({ item, children }) {
  const travel = item.kind === 'travel';
  return <article className={`community-card ${travel ? 'travel-card' : 'room-card'}`}>
    <div className="community-card-top"><span className="community-tag">{travel ? travelLabels[item.travelMode] : `${item.stayType === 'temporary' ? 'Temporary' : 'Permanent'} roommate`}</span><span className="community-symbol" aria-hidden="true">{travel ? '↗' : '⌂'}</span></div>
    <h3>{item.title}</h3>
    <p className="community-route">{item.location}{travel && <> → {item.destination}</>}</p>
    <dl className="community-facts"><div><dt>{travel ? 'Departure' : 'Move-in'}</dt><dd>{displayDate(item.startDate)}</dd></div>{item.endDate && <div><dt>{travel ? 'Return' : 'Until'}</dt><dd>{displayDate(item.endDate)}</dd></div>}{item.budget && <div><dt>Monthly budget</dt><dd>{item.budget}</dd></div>}</dl>
    {item.details && <p className="community-details">{item.details}</p>}
    <div className="community-contact"><p>Posted by <strong>{item.name}</strong></p><div>{item.email && <a href={`mailto:${item.email}`}>Email ↗<span>{item.email}</span></a>}{item.phone && <a href={`tel:${item.phone.replace(/[^+\d]/g, '')}`}>Call ↗<span>{item.phone}</span></a>}</div></div>
    {children}
  </article>;
}
