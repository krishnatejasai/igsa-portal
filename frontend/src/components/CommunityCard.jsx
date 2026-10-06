import { displayDate, travelLabels } from '../utils/community';
export default function CommunityCard({ item, children }) {
  const travel = item.kind === 'travel';
  return <article className={`community-card ${travel ? 'travel-card' : 'room-card'}`}>
    <div className="community-card-top"><span className="community-tag">{travel ? travelLabels[item.travelMode] : `${item.stayType === 'temporary' ? 'Temporary' : 'Permanent'} roommate`}</span><span className="community-symbol" aria-hidden="true">{travel ? '↗' : '⌂'}</span></div>
    <h3>{item.name}</h3>
    <p className="community-route">{item.location}{travel && <> → {item.destination}</>}</p>
    {travel && item.startDate < new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()) && <p className="community-help">Departure date has passed · contact the poster for updated plans.</p>}
    <dl className="community-facts">{!travel && item.gender && <div><dt>Gender</dt><dd>{item.gender === 'Self-describe' ? item.genderDescription : item.gender}</dd></div>}{!travel && item.apartment && <div><dt>Apartment</dt><dd>{item.apartment}</dd></div>}<div><dt>{travel ? 'Departure' : 'Move-in'}</dt><dd>{displayDate(item.startDate)}</dd></div>{item.endDate && <div><dt>{travel ? 'Return' : 'Until'}</dt><dd>{displayDate(item.endDate)}</dd></div>}{item.budget && <div><dt>Monthly budget</dt><dd>{item.budget}</dd></div>}</dl>
    {item.details && <p className="community-details">{item.details}</p>}
    <div className="community-contact"><p>Posted by <strong>{item.name}</strong></p><div>{item.email && <a href={`mailto:${item.email}`}>Email ↗<span>{item.email}</span></a>}{item.phone && <a href={`tel:${item.phone.replace(/[^+\d]/g, '')}`}>Call ↗<span>{item.phone}</span></a>}</div></div>
    {children}
  </article>;
}
