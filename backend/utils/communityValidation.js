const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
function text(value, label, max, required = false) {
  if (value == null && !required) return '';
  if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) throw new Error(`Enter a valid ${label} (up to ${max} characters).`);
  return value.trim();
}
function date(value, label, required = false) {
  const result = text(value, label, 10, required);
  if (result && (!/^\d{4}-\d{2}-\d{2}$/.test(result) || !Number.isFinite(Date.parse(result)) || new Date(result).toISOString().slice(0, 10) !== result)) throw new Error(`Enter a valid ${label}.`);
  return result;
}
function fiveMonthsAfter(day) {
  const value = new Date(day + 'T12:00:00Z');
  const originalDay = value.getUTCDate();
  value.setUTCDate(1);
  value.setUTCMonth(value.getUTCMonth() + 5);
  const last = new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + 1, 0)).getUTCDate();
  value.setUTCDate(Math.min(originalDay, last));
  return value.toISOString().slice(0, 10);
}
function communityInput(body, currentDay = today(), originalStartDate) {
  if (!['roommate', 'travel'].includes(body.kind)) throw new Error('Choose roommates or travel partners.');
  if (body.consent !== true) throw new Error('Please agree to publish your listing and contact details.');
  const data = {
    kind: body.kind,
    name: text(body.name, 'name', 70, true),
    details: text(body.details, 'description', 1200),
    email: text(body.email, 'email', 254).toLowerCase(),
    phone: text(body.phone, 'phone number', 25),
    location: text(body.location, body.kind === 'travel' ? 'departure city' : 'location', 100, true),
    startDate: date(body.startDate, body.kind === 'travel' ? 'departure date' : 'move-in date', true),
    endDate: body.kind === 'travel' ? '' : date(body.endDate, 'end date'),
  };
  if (!data.email && !data.phone) throw new Error('Add an email address or phone number so students can contact you.');
  if (data.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)) throw new Error('Enter a valid email address.');
  if (data.phone && (!/^\+?[\d ()-]+$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 7 || data.phone.replace(/\D/g, '').length > 15)) throw new Error('Enter a valid phone number, including country code where needed.');
  if (data.startDate < currentDay && data.startDate !== originalStartDate) throw new Error('Choose today or a future date.');
  if (data.startDate > String(Number(currentDay.slice(0, 4)) + 2) + currentDay.slice(4)) throw new Error('Choose a date within the next two years.');
  if (data.endDate && data.endDate < data.startDate) throw new Error('The stay end date must be on or after the start date.');
  if (data.kind === 'roommate') {
    if (!['temporary', 'permanent'].includes(body.stayType)) throw new Error('Choose temporary or permanent housing.');
    data.stayType = body.stayType;
    data.gender = text(body.gender, 'gender', 30);
    if (!['', 'Woman', 'Man', 'Non-binary', 'Prefer not to say', 'Self-describe'].includes(data.gender)) throw new Error('Choose a valid gender option.');
    data.genderDescription = data.gender === 'Self-describe' ? text(body.genderDescription, 'gender description', 50, true) : '';
    data.apartment = text(body.apartment, 'apartment name / number', 100);
    data.budget = text(body.budget, 'monthly budget', 40);
    data.destination = '';
    data.travelMode = '';
  } else {
    data.destination = text(body.destination, 'destination', 100, true);
    if (!['offering-ride', 'need-ride', 'travel-together'].includes(body.travelMode)) throw new Error('Choose a travel option.');
    data.travelMode = body.travelMode;
    data.stayType = '';
    data.budget = '';
    data.gender = '';
    data.genderDescription = '';
    data.apartment = '';
  }
  data.title = data.kind === 'travel' ? `${data.location} → ${data.destination}` : `${data.name} · ${data.location}`;
  data.expiresOn = fiveMonthsAfter(currentDay);
  data.retentionVersion = 2;
  return data;
}
module.exports = { communityInput, today, date, fiveMonthsAfter };
