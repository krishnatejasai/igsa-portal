const { randomUUID } = require('node:crypto');
function bad(message, status = 400) { const error = new Error(message); error.status = status; throw error; }
const modes = ['required', 'optional', 'hidden'];
function settings(input = {}) {
  const fields = {};
  for (const key of ['phone', 'ufid', 'program']) {
    fields[key] = input.registrationFields?.[key] ?? 'required';
    if (!modes.includes(fields[key])) bad(`Invalid setting for ${key}.`);
  }
  const source = input.slotQuestion || {};
  if (source.enabled !== undefined && typeof source.enabled !== 'boolean') bad('Invalid dropdown setting.');
  const enabled = source.enabled === true;
  if (!enabled) return { registrationFields: fields, slotQuestion: { enabled: false, label: '', options: [] } };
  if (typeof source.label !== 'string' || !source.label.trim() || source.label.length > 200) bad('Enter a dropdown question (up to 200 characters).');
  if (!Array.isArray(source.options) || !source.options.length || source.options.length > 50) bad('Add between 1 and 50 time slots.');
  const ids = new Set(), labels = new Set();
  const options = source.options.map(slot => {
    if (typeof slot.label !== 'string' || !slot.label.trim() || slot.label.length > 150) bad('Each time slot needs a label (up to 150 characters).');
    const capacity = Number(slot.capacity);
    if (!Number.isSafeInteger(capacity) || capacity < 1 || capacity > 100000) bad('Each slot capacity must be a whole number between 1 and 100,000.');
    const id = slot.id || randomUUID();
    if (typeof id !== 'string' || !/^[a-zA-Z0-9-]{1,64}$/.test(id) || ids.has(id)) bad('Invalid or duplicate time slot ID.');
    const label = slot.label.trim();
    if (labels.has(label.toLowerCase())) bad('Time slot labels must be different.');
    ids.add(id); labels.add(label.toLowerCase());
    return { id, label, capacity };
  });
  return { registrationFields: fields, slotQuestion: { enabled, label: source.label.trim(), options } };
}
function eventInput(body) {
  const result = settings(body);
  for (const key of ['title', 'category', 'date', 'time', 'location', 'description', 'registrationLink']) {
    if (typeof body[key] !== 'string' || body[key].length > (key === 'description' ? 10000 : 1000) || (key !== 'registrationLink' && !body[key].trim())) bad(`Enter a valid ${key}.`);
    result[key] = body[key].trim();
  }
  result.capacity = Number(body.capacity);
  if (!Number.isSafeInteger(result.capacity) || result.capacity < 1 || result.capacity > 100000) bad('Event capacity must be a whole number between 1 and 100,000.');
  return result;
}
function studentInput(body, event) {
  const student = {};
  for (const key of ['name', 'email', 'phone', 'ufid', 'program']) {
    const mode = event.registrationFields?.[key] || 'required';
    if (mode === 'hidden' && !['name', 'email'].includes(key)) { student[key] = ''; continue; }
    const value = body[key] ?? '';
    if (typeof value !== 'string' || value.length > 254 || (mode === 'required' && !value.trim())) bad(`Please enter ${key}.`);
    student[key] = value.trim();
  }
  student.email = student.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) bad('Enter a valid email address.');
  if (event.slotQuestion?.enabled) {
    const slot = event.slotQuestion.options.find(option => option.id === body.slotId);
    if (!slot) bad('Choose an available time slot.');
    student.slotId = slot.id;
    student.slotLabel = slot.label;
    student.slotQuestion = event.slotQuestion.label;
  }
  return student;
}
function validateBookedSettings(input, registrations) {
  const confirmed = registrations.filter(row => row.status === 'registered');
  if (confirmed.length > input.capacity) bad('Capacity cannot be lower than the number already registered.');
  for (const row of registrations.filter(row => row.slotId)) {
    const slot = input.slotQuestion.options.find(option => option.id === row.slotId);
    if (!input.slotQuestion.enabled || !slot) bad('A booked slot cannot be removed. Keep it or delete its registrations first.');
    if (confirmed.filter(item => item.slotId === slot.id).length > slot.capacity) bad(`Capacity for ${slot.label} is below its existing bookings.`);
  }
}
module.exports = { bad, settings, eventInput, studentInput, validateBookedSettings };
