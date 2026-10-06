import { useRef, useState } from 'react';
import { travelLabels } from '../utils/community';
import { memberRequest, rememberListing } from '../utils/communitySession';
const currentDay = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export default function CommunityPostForm({ kind, initial = {}, onSaved, requestPath = "community", token }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const sending = useRef(false);
  const [stay, setStay] = useState(initial.stayType || 'temporary');
  const travel = kind === 'travel';
  const [gender, setGender] = useState(initial.gender || '');
  async function submit(event) {
    event.preventDefault();
    if (sending.current) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    sending.current = true; setBusy(true); setError('');
    try {
      const result = await memberRequest(requestPath, { method: 'POST', body: JSON.stringify({ ...values, kind, token, consent: values.consent === 'on' }) });
      if (result.id && result.manageToken) rememberListing({ ...result, name: values.name, location: values.location });
      onSaved(result);
    } catch (err) { setError(err.message); }
    finally { sending.current = false; setBusy(false); }
  }
  return <form className="community-form" onSubmit={submit}>
    <div className="community-form-grid">
      <label className="field-label">Your name<input name="name" defaultValue={initial.name || ''} required maxLength={70} autoComplete="name" className="field-input" /></label>
      {travel ? <label className="field-label">Travel option<select name="travelMode" defaultValue={initial.travelMode || "offering-ride"} className="field-input">{Object.entries(travelLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label> : <label className="field-label">Stay type<select name="stayType" value={stay} onChange={e => setStay(e.target.value)} className="field-input"><option value="temporary">Temporary</option><option value="permanent">Permanent / long-term</option></select></label>}
      <label className="field-label">{travel ? 'Departure city' : 'Area / city'}<input name="location" defaultValue={initial.location || ''} required maxLength={100} placeholder="Gainesville, FL" className="field-input" /></label>
      {travel ? <label className="field-label">Destination<input name="destination" defaultValue={initial.destination || ''} required maxLength={100} placeholder="Orlando, Miami, Tampa, or anywhere" className="field-input" /></label> : <label className="field-label">Monthly budget (optional)<input name="budget" defaultValue={initial.budget || ''} maxLength={40} placeholder="e.g. $700–900 per person" className="field-input" /></label>}
      <label className="field-label">{travel ? 'Date' : 'Move-in date'}<input type="date" name="startDate" defaultValue={initial.startDate || ''} required min={initial.startDate && initial.startDate < currentDay() ? initial.startDate : currentDay()} className="field-input" /></label>
      {!travel && <label className="field-label">Stay ends (optional)<input type="date" name="endDate" defaultValue={initial.endDate || ''} className="field-input" /></label>}
      {!travel && <><label className="field-label">Gender (optional)<select name="gender" value={gender} onChange={e => setGender(e.target.value)} className="field-input"><option value="">Choose an option</option>{['Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Self-describe'].map(value => <option key={value}>{value}</option>)}</select></label>{gender === 'Self-describe' && <label className="field-label">Gender description<input name="genderDescription" defaultValue={initial.genderDescription || ''} required maxLength={50} className="field-input" /></label>}<label className="field-label">Apartment name / number (optional)<input name="apartment" defaultValue={initial.apartment || ''} maxLength={100} className="field-input" /><span className="field-help">Only include details you want to display publicly.</span></label></>}
      <label className="field-label">Email<input type="email" name="email" defaultValue={initial.email || ''} maxLength={254} autoComplete="email" className="field-input" /></label>
      <label className="field-label">Phone<input type="tel" name="phone" defaultValue={initial.phone || ''} maxLength={25} autoComplete="tel" placeholder="+1 352 555 0123" className="field-input" /></label>
      <label className="field-label community-wide">A few details (optional)<textarea name="details" defaultValue={initial.details || ''} rows={4} maxLength={1200} placeholder={travel ? 'Departure time, available seats, luggage, and any shared costs.' : 'About the room, lease, move-in flexibility, and roommate preferences. Share only the address details you want displayed publicly.'} className="field-input" /></label>
    </div>
    <p className="community-help">Add at least one contact method. Listings stay visible for five months from posting. Edit, close, or delete yours whenever your plans change.</p>
    <label className="community-consent"><input type="checkbox" name="consent" required /> <span>I agree to display my name, listing details (including gender/apartment if entered), and provided email/phone publicly so students can contact me.</span></label>
    {error && <p role="alert" className="notice notice-error">{error}</p>}
    <button className="community-button" disabled={busy} aria-busy={busy}>{busy ? 'Saving…' : initial._id ? 'Save changes' : 'Publish listing ↗'}</button>
    {busy && <p role="status" className="community-help">Saving your post. The server may take a moment to respond.</p>}
  </form>;
}
